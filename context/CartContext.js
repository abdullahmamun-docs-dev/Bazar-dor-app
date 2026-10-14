
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "bazar-dor-cart";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart after the component mounts
  useEffect(() => {
    let savedItems = [];

    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          savedItems = parsedCart;
        }
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    }

    // Defer state updates until after the effect completes
    const timer = setTimeout(() => {
      setCartItems(savedItems);
      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save cart after it has loaded
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [cartItems, isLoaded]);

  const addToCart = useCallback((product) => {
    const id = product.id ?? product._id ?? product.slug;

    if (id == null) {
      console.error("Product ID is missing:", product);
      return;
    }

    const rawPrice =
      product.today ?? product.price ?? product.todayPrice;

    const parsedPrice = Number(rawPrice);

    const item = {
      id: String(id),
      name:
        product.nameBn ??
        product.name ??
        product.title ??
        "পণ্যের নাম নেই",
      price:
        rawPrice != null && Number.isFinite(parsedPrice)
          ? parsedPrice
          : 0,
      image: product.image ?? product.imageUrl ?? "",
      quantity: 1,
    };

    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return previousItems.map((cartItem) =>
          cartItem.id === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [...previousItems, item];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((items) =>
      items.filter((item) => item.id !== String(id))
    );
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (!Number.isInteger(quantity) || quantity < 1) return;

    setCartItems((items) =>
      items.map((item) =>
        item.id === String(id)
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
