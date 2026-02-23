import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

const CartContext = createContext()

export const CartProvider = ({ children }) => {

  const [cartLoaded, setCartLoaded] = useState(false)

  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || []
  })

  const [promo, setPromo] = useState(() => {
    return JSON.parse(localStorage.getItem("promo")) || null
  })

  // Persist cart
  useEffect(() => {
    if(!cartLoaded) return

    const token = localStorage.getItem("userToken")

    if(token){
      axios.post(
        "http://localhost:4001/api/cart/add",
        {items:cartItems},
        {headers:{Authorization:`Bearer ${token}`}}
      )
    }
  }, [cartItems, cartLoaded])

  // Persist promo
  useEffect(() => {
    localStorage.setItem("promo", JSON.stringify(promo))
  }, [promo])

  // Auto remove promo if cart changes
  useEffect(() => {
    if (!promo) return
    setPromo(null)
  }, [cartItems])

  const applyPromo = (promoData) => {
    setPromo(promoData)
  }

  const clearPromo = () => {
    setPromo(null)
  }

  const addToCart = (product, selectedSize) => {
    const token = localStorage.getItem("userToken")
    if (!token) return
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item._id === product._id && item.size === selectedSize
      )
      if (existing) {
        return prev.map((item) =>
          item._id === product._id && item.size === selectedSize
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }
      const cartItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        color: product.color,
        size: selectedSize,
        qty: 1,
        inStock:
          Number(product.stockQty) > 0 ||
          product.stockStatus === "In Stock"
      }
      return [...prev, cartItem]
    })
  }

  const removeFromCart = (id, size) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item._id === id && item.size === size))
    )
  }

  useEffect(()=>{
    const fetchCart = async ()=>{
      const token = localStorage.getItem("userToken")
      try{
        if(token){
          const res = await axios.get(
            "http://localhost:4001/api/cart",
            {headers:{Authorization:`Bearer ${token}`}}
          )
          setCartItems(res.data.items || [])
        }
      }catch(err){
        console.error("Cart fetch error",err)
      }finally{
        setCartLoaded(true)
      }
    }

    fetchCart()
  },[])

  const updateQty = (id, size, qty) => {
    if (qty < 1) return
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id && item.size === size
          ? { ...item, qty }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, promo, applyPromo, clearPromo }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)