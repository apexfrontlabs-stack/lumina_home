import { useCart as useCartContext } from '../context/CartContext'

export function useCart() {
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
  } = useCartContext()

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount: cartCount,
    subtotal: cartSubtotal,
  }
}

export default useCart