import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('artisan_wishlist') || '[]')
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('artisan_wishlist', JSON.stringify(items))
  }, [items])

  const toggle = (product) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) {
        toast.success('Removed from wishlist')
        return prev.filter(i => i.id !== product.id)
      }
      toast.success('Added to wishlist')
      return [...prev, product]
    })
  }

  const isWishlisted = (id) => items.some(i => i.id === id)

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
