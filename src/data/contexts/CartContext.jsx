import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { saveCart } from "../services/CartService";

const CartContext = createContext();

export function CartProvider({ children }) {
    const { user } = useAuth();

       const [cartItems, setCartItems] = useState(() => {
        const stored = localStorage.getItem("cart");

        if (!stored) return [];

        try {
            const parsed = JSON.parse(stored);
            const items = parsed.items ?? parsed;

            return Array.isArray(items)
                ? items.map(item => ({
                    ...item,
                    quantidade: Number(item.quantidade) || 1,
                    preco: Number(item.preco) || 0,
                    estoque: Number(item.estoque) || Infinity
                }))
                : [];
        } catch {
            return [];
        }
    });

    const cartTotal = cartItems.reduce(
        (total, item) => total + item.preco * item.quantidade,
        0
    );

    const cartCount = cartItems.reduce(
        (sum, item) => sum + item.quantidade,
        0
    );

    useEffect(() => {
        localStorage.setItem(
            "cart",
            JSON.stringify({
                items: cartItems,
                total: cartTotal
            })
        );
    }, [cartItems, cartTotal]);

    useEffect(() => {
        if (!user?.id) return;

        saveCart(user.id, cartItems, cartTotal)
            .then(data => {
                if (data) {
                }
            })
            .catch(err => {
                console.error("Erro ao enviar carrinho:", err);
            });
    }, [user, cartItems, cartTotal]);

    function addToCart(product) {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);

            const estoqueReal =
                Number(product.estoque ?? product.quantity ?? product.stock) || Infinity;

            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantidade:
                                item.quantidade < item.estoque
                                    ? item.quantidade + 1
                                    : item.quantidade
                        }
                        : item
                );
            }

            return [
                ...prev,
                {
                    id: product.id,
                    nome: product.name,
                    descricao: product.description,
                    preco: Number(product.price),
                    imageUrl: product.imageUrl,
                    estoque: estoqueReal,
                    quantidade: 1
                }
            ];
        });
    }

    function removeFromCart(id) {
        setCartItems(prev => prev.filter(item => item.id !== id));
    }

    function increaseQuantity(id) {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        quantidade:
                            item.quantidade < item.estoque
                                ? item.quantidade + 1
                                : item.quantidade
                    }
                    : item
            )
        );
    }

    function decreaseQuantity(id) {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id && item.quantidade > 1
                    ? { ...item, quantidade: item.quantidade - 1 }
                    : item
            )
        );
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                cartTotal,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}