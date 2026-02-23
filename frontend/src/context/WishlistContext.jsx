import React, { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {

  const [wishlistLoaded, setWishlistLoaded] = useState(false)

  const [wishlistItems, setWishlistItems] = useState(() => {
    const stored = localStorage.getItem("wishlist")
    return stored ? JSON.parse(stored) : []
  })

  // Persist to localStorage
  useEffect(()=>{
    if(!wishlistLoaded) return

    const token = localStorage.getItem("userToken")

    if(token){
      axios.post(
        "http://localhost:4001/api/wishlist/add",
        {items:wishlistItems},
        {headers:{Authorization:`Bearer ${token}`}}
      )
    }
  },[wishlistItems, wishlistLoaded])

  const addToWishlist = product => {

    const token = localStorage.getItem("userToken")
    if (!token) return

    setWishlistItems(prev => {
      const exists = prev.find(item => item._id === product._id)
      if (exists) return prev
      return [...prev, product]
    })
  }

  useEffect(()=>{
    const fetchWishlist = async ()=>{
      const token = localStorage.getItem("userToken")

      try{
        if(token){
          const res = await axios.get(
            "http://localhost:4001/api/wishlist",
            {headers:{Authorization:`Bearer ${token}`}}
          )

          setWishlistItems(res.data.items || [])
        }
      }catch(err){
        console.error("Wishlist fetch error",err)
      }finally{
        // ✅ VERY IMPORTANT
        setWishlistLoaded(true)
      }
    }

    fetchWishlist()
  },[])

  const removeFromWishlist = id => {
    setWishlistItems(prev =>
      prev.filter(item => item._id !== id)
    )
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)