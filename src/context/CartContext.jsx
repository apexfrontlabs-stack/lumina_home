   import { createContext, useState, useEffect, useContext } from 'react';

// Create the global Cart Context layer
export const CartContext = createContext();

/**
 * Premium Global Cart Provider Component
 * Handles complete shopping cart state, real-time total updates, and local storage state retention.
 */
export default function CartProvider({ children }) {
  // Initialize state with automated LocalStorage sync mechanism
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('lumina_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to parse cart storage array:', error);
      return [];
    }
  });

  // Keep LocalStorage flawlessly updated whenever modifications occur within the cart array state
  useEffect(() => {
    localStorage.setItem('lumina_cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * Appends an item to the shopping cart array frame or increases its quantity if present
   * @param {Object} product - The complete product object structure from inventory master feeds
   * @param {number} quantity - Target multiplier count adjustment
   */
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const isExist = prevCart.find((item) => item.id === product.id);
      
      if (isExist) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  /**
   * Removes a specific item cleanly from the shopping cart catalog array matrix
   * @param {string} productId - Unique functional target identification parameter index
   */
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  /**
   * Dynamic updates adjusting internal product quantity levels safely
   * @param {string} productId - Unique product target identifier index
   * @param {number} amount - Final updated absolute calculation target setting
   */
  const updateQuantity = (productId, amount) => {
    if (amount <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity: amount } : item))
    );
  };

  /**
   * Safely purges all saved items inside the user's active shopping cart setup
   */
  const clearCart = () => {
    setCart([]);
  };

  // Automated computational analytics derivation rules logic mapping
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Custom Unified Hook abstraction for direct context evaluations
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must explicitly be consumed inside a certified CartProvider scope.');
  }
  return context;
};
