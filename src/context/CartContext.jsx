
import { createContext, useState, useEffect, useContext } from 'react'

export const CartContext = createContext()

const STORAGE_KEY = 'lumina_cart'

function getSavedCart() {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEY)

    if (!savedCart) return []

    const parsedCart = JSON.parse(savedCart)

    if (!Array.isArray(parsedCart)) return []

    return parsedCart.filter(
      (item) =>
        item &&
        item.id !== undefined &&
        item.id !== null &&
        Number.isFinite(Number(item.price)) &&
        Number.isFinite(Number(item.quantity)) &&
        Number(item.quantity) > 0
    )
  } catch {
    return []
  }
}

export default function CartProvider({ children }) {
  const [cart, setCart] = useState(getSavedCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch (error) {
      console.error('Unable to save cart:', error)
    }
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    if (!product || product.id == null) return

    const amount = Number(quantity)

    if (!Number.isFinite(amount) || amount <= 0) return

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id
      )

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Number(item.quantity) + amount }
            : item
        )
      }

      return [...prevCart, { ...product, quantity: amount }]
    })
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== productId)
    )
  }

  const updateQuantity = (productId, amount) => {
    const quantity = Number(amount)

    if (!Number.isFinite(quantity) || quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const cartCount = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  )

  const cartSubtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  )

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
  )
}

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}
