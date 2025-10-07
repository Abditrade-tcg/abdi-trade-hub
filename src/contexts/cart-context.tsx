"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CartContextType {
  cartCount: number
  addToCart: () => void
  removeFromCart: () => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0)

  const addToCart = () => {
    setCartCount((prev) => prev + 1)
  }

  const removeFromCart = () => {
    setCartCount((prev) => Math.max(0, prev - 1))
  }

  const clearCart = () => {
    setCartCount(0)
  }

  return (
    <CartContext.Provider value={{ cartCount, addToCart, removeFromCart, clearCart }}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}