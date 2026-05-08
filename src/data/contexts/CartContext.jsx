import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

import {
    syncCart,
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
            quantidade: item.quantity,
            imageUrl: item.imageUrl,
            stock: item.stock
        }));
    }

    function calculateTotals(items) {

        const subtotal = items.reduce(
            (sum, item) =>
                sum + (Number(item.preco ?? 0) * item.quantity),
            0
        );

        setCartSubtotal(subtotal);
        setCartShipping(0);
        setCartTotal(subtotal);
    }

    function saveLocalCart(items) {

        localStorage.setItem("cart", JSON.stringify(items));

        setCartItems(mapLocalToState(items));

        calculateTotals(items);
    }

    function getLocalCart() {

        const localCart = localStorage.getItem("cart");

        return localCart ? JSON.parse(localCart) : [];
    }

    async function loadCart() {

        try {

            setLoadingCart(true);

            const items = getLocalCart();

            saveLocalCart(items);

        } catch (err) {

            console.error("Erro ao carregar carrinho:", err);

        } finally {

            setLoadingCart(false);
        }
    }

    useEffect(() => {
        loadCart();
    }, [user]);

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

        const item = items.find(
            item => item.productId === productId
        );

        if (!item) return;

        if (item.quantity < item.stock) {
            item.quantity += 1;
        }

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

        setCartItems([]);
        setCartSubtotal(0);
        setCartShipping(0);
        setCartTotal(0);
    }

    async function syncCartBeforeCheckout() {

        if (!user?.id) return;

        try {

            const items = getLocalCart();

            if (!items.length) {

                await loadCart();
                return;
            }

            const mapped = items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            // 🔥 sincroniza UMA única vez com Redis
            await syncCart(user.id, mapped);

            // 🔥 busca carrinho consolidado do backend
            const data = await getCart(user.id);

            const subtotal = Number(data?.subTotal ?? 0);
            const shipping = Number(data?.shippingValue ?? 0);
            const total = Number(
                data?.total ?? subtotal + shipping
            );

            setCartSubtotal(subtotal);
            setCartShipping(shipping);
            setCartTotal(total);

            const backendItems = (data?.items ?? []).map(item => ({
                id: item.productId,
                nome: item.nome,
                descricao: item.descricao,
                preco: Number(item.preco ?? 0),
                quantidade: Number(item.quantidade ?? 0),
                imageUrl: item.imageUrl,
                stock: Number(item.estoque ?? 0)
            }));

            setCartItems(backendItems);

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