import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

import {
    syncCart,
    addItemToCart,
    removeItemFromCart,
    increaseItemQuantity,
    decreaseItemQuantity,
    clearCart as clearCartRequest,
    getCart
} from "../services/CartService";

const CartContext = createContext();

export function CartProvider({ children }) {

    const { user } = useAuth();

    const [hasSynced, setHasSynced] = useState(false);

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

    function saveLocalCart(items) {
        localStorage.setItem("cart", JSON.stringify(items));
        setCartItems(mapLocalToState(items));

        const subtotal = items.reduce(
            (sum, item) => sum + (Number(item.preco ?? 0) * item.quantity),
            0
        );

        setCartSubtotal(subtotal);
        setCartShipping(0);
        setCartTotal(subtotal);
    }

    function getLocalCart() {
        const localCart = localStorage.getItem("cart");
        return localCart ? JSON.parse(localCart) : [];
    }

    async function syncLocalCartWithBackend() {
        if (!user?.id) return;

        const items = getLocalCart();

        if (!items.length) return;

        try {
            const mapped = items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            await syncCart(user.id, mapped);

            localStorage.removeItem("cart");

        } catch (err) {
            console.error("Erro ao sincronizar carrinho:", err);
        }
    }


    async function loadCart() {

        if (!user?.id) {
            const items = getLocalCart();
            saveLocalCart(items);
            setLoadingCart(false);
            return;
        }

        try {
            setLoadingCart(true);

            const data = await getCart(user.id);

            const subtotal = Number(data?.subTotal ?? 0);
            const shipping = Number(data?.shippingValue ?? 0);
            const total = Number(data?.total ?? subtotal + shipping);

            setCartSubtotal(subtotal);
            setCartShipping(shipping);
            setCartTotal(total);

            setCartItems(
                (data?.items ?? []).map(item => ({
                    id: item.productId,
                    nome: item.nome,
                    descricao: item.descricao,
                    preco: Number(item.preco ?? 0),
                    quantidade: Number(item.quantidade ?? 0),
                    imageUrl: item.imageUrl,
                    stock: Number(item.estoque ?? 0)
                }))
            );

        } catch (err) {
            console.error("Erro ao buscar carrinho:", err);
        } finally {
            setLoadingCart(false);
        }
    }

    useEffect(() => {
        async function initCart() {

            if (!user?.id) {
                setHasSynced(false);
                await loadCart();
                return;
            }

            if (!hasSynced) {
                await syncLocalCartWithBackend();
                setHasSynced(true);
            }

            await loadCart();
        }

        initCart();
    }, [user]);

    async function addToCart(product) {

        // 🟡 DESLOGADO
        if (!user?.id) {

            let items = getLocalCart();

            const existing = items.find(i => i.productId === product.id);

            if (existing) {
                existing.quantity += 1;
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
            return;
        }

        // 🟢 LOGADO
        await addItemToCart(user.id, product.id);
        loadCart();
    }

    async function increaseQuantity(productId) {

        if (!user?.id) {

            let items = getLocalCart();

            const item = items.find(i => i.productId === productId);
            if (!item) return;

            if (item.quantity < item.stock) {
                item.quantity += 1;
            }

            saveLocalCart(items);
            return;
        }

        await increaseItemQuantity(user.id, productId);
        loadCart();
    }

    async function decreaseQuantity(productId) {

        if (!user?.id) {

            let items = getLocalCart();

            const item = items.find(i => i.productId === productId);
            if (!item) return;

            if (item.quantity <= 1) {
                items = items.filter(i => i.productId !== productId);
            } else {
                item.quantity -= 1;
            }

            saveLocalCart(items);
            return;
        }

        await decreaseItemQuantity(user.id, productId);
        loadCart();
    }

    async function removeFromCart(productId) {

        if (!user?.id) {

            let items = getLocalCart();
            items = items.filter(i => i.productId !== productId);

            saveLocalCart(items);
            return;
        }

        await removeItemFromCart(user.id, productId);
        loadCart();
    }

    async function clearCart() {

        if (!user?.id) {

            localStorage.removeItem("cart");
            saveLocalCart([]);
            return;
        }

        await clearCartRequest(user.id);

        setCartItems([]);
        setCartSubtotal(0);
        setCartShipping(0);
        setCartTotal(0);
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
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}