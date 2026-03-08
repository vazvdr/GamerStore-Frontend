import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

import {
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

    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);

    const cartTotal = cartItems.reduce(
        (total, item) => total + item.preco * item.quantidade,
        0
    );

    const cartCount = cartItems.reduce(
        (sum, item) => sum + item.quantidade,
        0
    );

    // 🔹 carregar carrinho
    async function loadCart() {
        if (!user?.id) {
            setCartItems([]);
            setLoadingCart(false);
            return;
        }
        try {
            const data = await getCart(user.id);
            if (data?.items) {
                const items = data.items.map(item => ({
                    id: item.productId,
                    nome: item.nome,
                    descricao: item.descricao,
                    preco: Number(item.preco),
                    quantidade: Number(item.quantidade),
                    imageUrl: item.imageUrl
                }));
                setCartItems(items);
            } else {
                setCartItems([]);
            }
        } catch (err) {
            console.error("Erro ao buscar carrinho:", err);
            setCartItems([]);
        } finally {
            setLoadingCart(false);
        }
    }

    useEffect(() => {
        loadCart();
    }, [user]);

    async function addToCart(product) {
        if (!user?.id) return;
        const payload = {
            productId: product.id,
            quantidade: 1
        };
        console.log("Payload enviado:", payload);
        await addItemToCart(user.id, payload);
        loadCart();
    }

    // 🔹 remover produto
    async function removeFromCart(productId) {
        if (!user?.id) return;
        await removeItemFromCart(user.id, productId);
        loadCart();
    }

    async function increaseQuantity(productId) {
        if (!user?.id) return;
        const item = cartItems.find(i => i.id === productId);
        if (!item) return;
        const novaQuantidade = item.quantidade + 1;
        await increaseItemQuantity(user.id, productId, novaQuantidade);
        loadCart();
    }
    // 🔹 diminuir quantidade
    async function decreaseQuantity(productId) {
        if (!user?.id) return;
        await decreaseItemQuantity(user.id, productId);
        loadCart();
    }

    // 🔹 limpar carrinho
    async function clearCart() {
        if (!user?.id) return;
        await clearCartRequest(user.id);
        setCartItems([]);
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                cartTotal,
                loadingCart,
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