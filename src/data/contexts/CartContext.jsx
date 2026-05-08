import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

import {
    syncCart,
    clearCart as clearCartRequest,
    getCart
} from "../services/CartService";

const CartContext = createContext();

export function CartProvider({ children }) {

    const { user } = useAuth();

    const [cartItems, setCartItems] = useState([]);
    const [cartSubtotal, setCartSubtotal] = useState(0);
    const [cartShipping, setCartShipping] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    const [loadingCart, setLoadingCart] = useState(true);

    const cartCount = cartItems.reduce(
        (sum, item) => sum + item.quantidade,
        0
    );

    function mapLocalToState(items) {

        return items.map(item => ({
            id: item.productId,
            nome: item.nome,
            descricao: item.descricao,
            preco: Number(item.preco ?? 0),
            quantidade: Number(item.quantity ?? 0),
            imageUrl: item.imageUrl,
            stock: Number(item.stock ?? 0)
        }));
    }

    function calculateTotals(items, shipping = 0) {

        const subtotal = items.reduce(
            (sum, item) =>
                sum + (
                    Number(item.preco ?? 0) *
                    Number(item.quantity ?? 0)
                ),
            0
        );

        setCartSubtotal(subtotal);
        setCartShipping(Number(shipping ?? 0));
        setCartTotal(
            subtotal + Number(shipping ?? 0)
        );
    }

    function saveLocalCart(items) {

        localStorage.setItem(
            "cart",
            JSON.stringify(items)
        );

        setCartItems(mapLocalToState(items));

        const savedShipping = Number(
            localStorage.getItem("cart_shipping") ?? 0
        );

        calculateTotals(items, savedShipping);
    }

    function getLocalCart() {

        const localCart = localStorage.getItem("cart");

        return localCart
            ? JSON.parse(localCart)
            : [];
    }

    function saveShipping(shippingValue) {

        localStorage.setItem(
            "cart_shipping",
            String(shippingValue)
        );

        const items = getLocalCart();

        calculateTotals(items, shippingValue);
    }

    function clearShipping() {

        localStorage.removeItem("cart_shipping");

        const items = getLocalCart();

        calculateTotals(items, 0);
    }

    async function loadCart() {

        try {

            setLoadingCart(true);

            const items = getLocalCart();

            saveLocalCart(items);

        } catch (err) {

            console.error(
                "Erro ao carregar carrinho:",
                err
            );

        } finally {

            setLoadingCart(false);
        }
    }

    useEffect(() => {
        loadCart();
    }, []);

    async function addToCart(product) {

        let items = getLocalCart();

        const existing = items.find(
            item => item.productId === product.id
        );

        if (existing) {

            if (existing.quantity < existing.stock) {
                existing.quantity += 1;
            }

        } else {

            items.push({
                productId: product.id,
                quantity: 1,
                nome: product.name,
                descricao: product.description,
                preco: Number(product.price ?? 0),
                imageUrl: product.imageUrl,
                stock: Number(product.stock ?? 0)
            });
        }

        saveLocalCart(items);
    }

    async function increaseQuantity(productId) {

        let items = getLocalCart();

        items = items.map(item => {

            if (
                item.productId === productId &&
                item.quantity < item.stock
            ) {

                return {
                    ...item,
                    quantity: item.quantity + 1
                };
            }

            return item;
        });

        saveLocalCart(items);
    }

    async function decreaseQuantity(productId) {

        let items = getLocalCart();

        items = items
            .map(item => {

                if (item.productId !== productId) {
                    return item;
                }

                if (item.quantity <= 1) {
                    return null;
                }

                return {
                    ...item,
                    quantity: item.quantity - 1
                };
            })
            .filter(Boolean);

        saveLocalCart(items);
    }

    async function removeFromCart(productId) {

        let items = getLocalCart();

        items = items.filter(
            item => item.productId !== productId
        );

        saveLocalCart(items);
    }

    async function clearCart() {

        localStorage.removeItem("cart");
        localStorage.removeItem("cart_shipping");

        setCartItems([]);
        setCartSubtotal(0);
        setCartShipping(0);
        setCartTotal(0);

        // 🔥 limpa backend apenas se estiver logado
        if (user?.id) {
            await clearCartRequest(user.id);
        }
    }

    // 🔥 ÚNICO ponto que sincroniza com backend
    async function syncCartBeforeCheckout() {

        if (!user?.id) return;

        try {

            const items = getLocalCart();

            const mapped = items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            // 🔥 sincroniza carrinho com Redis
            await syncCart(user.id, mapped);

            // 🔥 pega carrinho atualizado
            const data = await getCart(user.id);

            const subtotal = Number(
                data?.subTotal ?? 0
            );

            const shipping = Number(
                data?.shippingValue ?? 0
            );

            const total = Number(
                data?.total ?? subtotal + shipping
            );

            setCartSubtotal(subtotal);
            setCartShipping(shipping);
            setCartTotal(total);

            // 🔥 salva frete localmente
            localStorage.setItem(
                "cart_shipping",
                String(shipping)
            );

            // 🔥 atualiza frontend sem quebrar estrutura
            const backendItems = (data?.items ?? []).map(item => ({
                productId: item.productId,
                quantity: Number(item.quantidade ?? 0),
                nome: item.nome,
                descricao: item.descricao,
                preco: Number(item.preco ?? 0),
                imageUrl: item.imageUrl,
                stock: Number(item.estoque ?? 0)
            }));

            // 🔥 mantém frontend sincronizado
            localStorage.setItem(
                "cart",
                JSON.stringify(backendItems)
            );

            setCartItems(mapLocalToState(backendItems));

        } catch (err) {

            console.error(
                "Erro ao sincronizar carrinho:",
                err
            );
        }
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                cartSubtotal,
                cartShipping,
                cartTotal,
                loadingCart,
                loadCart,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                saveShipping,
                clearShipping,
                syncCartBeforeCheckout
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}