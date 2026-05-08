import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

import {
    syncCart,
    clearCart as clearCartRequest
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

    function calculateTotals(items) {

        const subtotal = items.reduce(
            (sum, item) =>
                sum + (
                    Number(item.preco ?? 0) *
                    Number(item.quantity ?? 0)
                ),
            0
        );

        const shipping = Number(
            localStorage.getItem("cart_shipping") ?? 0
        );

        setCartSubtotal(subtotal);
        setCartShipping(shipping);
        setCartTotal(subtotal + shipping);
    }

    function saveLocalCart(items) {

        // 🔥 SEMPRE SALVA NO LOCALSTORAGE
        localStorage.setItem(
            "cart",
            JSON.stringify(items)
        );

        setCartItems(mapLocalToState(items));

        calculateTotals(items);
    }

    function getLocalCart() {

        const localCart = localStorage.getItem("cart");

        return localCart
            ? JSON.parse(localCart)
            : [];
    }

    function saveShipping(shippingValue) {

        // 🔥 FRETE FICA NO FRONT
        localStorage.setItem(
            "cart_shipping",
            String(shippingValue)
        );

        const items = getLocalCart();

        calculateTotals(items);
    }

    function clearShipping() {

        localStorage.removeItem("cart_shipping");

        const items = getLocalCart();

        calculateTotals(items);
    }

    async function loadCart() {

        try {

            setLoadingCart(true);

            // 🔥 SEMPRE CARREGA DO LOCALSTORAGE
            const items = getLocalCart();

            setCartItems(mapLocalToState(items));

            calculateTotals(items);

        } catch (err) {

            console.error(
                "Erro ao carregar carrinho:",
                err
            );

        } finally {

            setLoadingCart(false);
        }
    }

    // 🔥 NÃO SINCRONIZA NO LOGIN
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

        // 🔥 APENAS LOCALSTORAGE
        saveLocalCart(items);
    }

    async function increaseQuantity(productId) {

        let items = getLocalCart();

        const item = items.find(
            item => item.productId === productId
        );

        if (!item) return;

        if (item.quantity < item.stock) {
            item.quantity += 1;
        }

        // 🔥 APENAS LOCALSTORAGE
        saveLocalCart(items);
    }

    async function decreaseQuantity(productId) {

        let items = getLocalCart();

        const item = items.find(
            item => item.productId === productId
        );

        if (!item) return;

        if (item.quantity <= 1) {

            items = items.filter(
                item => item.productId !== productId
            );

        } else {

            item.quantity -= 1;
        }

        // 🔥 APENAS LOCALSTORAGE
        saveLocalCart(items);
    }

    async function removeFromCart(productId) {

        let items = getLocalCart();

        items = items.filter(
            item => item.productId !== productId
        );

        // 🔥 APENAS LOCALSTORAGE
        saveLocalCart(items);
    }

    async function clearCart() {

        // 🔥 LIMPA LOCALSTORAGE
        localStorage.removeItem("cart");
        localStorage.removeItem("cart_shipping");

        setCartItems([]);
        setCartSubtotal(0);
        setCartShipping(0);
        setCartTotal(0);

        // 🔥 OPCIONAL:
        // limpa backend APENAS se já existir
        // carrinho sincronizado anteriormente
        if (user?.id) {

            try {
                await clearCartRequest(user.id);
            } catch (err) {
                console.error(
                    "Erro ao limpar backend:",
                    err
                );
            }
        }
    }

    // 🔥 ÚNICO PONTO QUE ESCREVE NO REDIS
    async function syncCartBeforeCheckout() {

        if (!user?.id) return;

        try {

            const items = getLocalCart();

            const mapped = items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            // 🔥 AGORA SIM SALVA NO BACKEND
            await syncCart(user.id, mapped);

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