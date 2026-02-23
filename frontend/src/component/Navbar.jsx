import { BrowserRouter as Router, useNavigate, NavLink, useLocation } from "react-router-dom"
import { assets } from "../assets/assets"
import { useWishlist } from "../context/WishlistContext"
import { useCart } from "../context/CartContext"
import { useState, useEffect, useRef } from "react"
import { User, Heart, ShoppingBag } from "lucide-react"

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { wishlistItems } = useWishlist()
  const { cartItems } = useCart()
  const debounceRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState("")

  // Reads search query from URL and puts it back into search input
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get("search") || ""
    setSearchQuery(q)
  }, [location.search])

  // Decides whether searchbar should be visible
  const showSearch =
    location.pathname === "/men" ||
    location.pathname === "/women" ||
    location.pathname === "/kids"

  const handleProfileClick = () => {
    const token = localStorage.getItem("userToken")
    if(token){
      navigate("/profile")
    } else{
      navigate("/login")
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center p-4 transform transition-all duration-300 ease-out hover:scale-[1.01]">
      <nav className="relative w-full max-w-7xl h-17 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between px-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-linear-to-r from-transparent via-white/30 to-transparent"></div>

        {/* Left Section */}
        <div className="flex items-center gap-12">

          {/* Logo */}
          <div className="flex items-center cursor-pointer group" onClick={() => navigate("/")}>
            <img className="h-5" src={assets.logo} alt="ALDEN" />
          </div>
          
          {/* Category */}
          <ul className="hidden md:flex gap-10 text-[10px] uppercase tracking-[0.2em] font-medium">
            {["Home", "Men", "Women", "Kids"].map((item) => (
              <li key={item}>
                <NavLink 
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`} 
                  className={({ isActive }) => `
                    relative py-2 transition-all duration-300
                    ${isActive ? "text-white" : "text-white/40 hover:text-white/80"}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {item}
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] rounded-full animate-pulse"></span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">

          {/* Search Bar */}
          {showSearch && (
            <div className="relative group flex items-center">
              <input type="text" placeholder="DISCOVER..." value={searchQuery} onChange={(e) => { const value = e.target.value
                  setSearchQuery(value)
                  if (debounceRef.current) clearTimeout(debounceRef.current)
                  debounceRef.current = setTimeout(() => {
                    const trimmed = value.trim()
                    navigate(trimmed ? `${location.pathname}?search=${encodeURIComponent(trimmed)}` : location.pathname, { replace: true })
                  }, 300)
                }}
                className="w-32 focus:w-48 h-8 bg-white/5 border border-white/10 rounded-lg px-3 text-[10px] text-white tracking-widest
                placeholder:text-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-500 ease-in-out"/>
            </div>
          )}

          <div className="flex items-center gap-6 border-l border-white/10 pl-5 ml-2">

            {/* Profile */}
            <button onClick={handleProfileClick} className="text-white/60 hover:text-white transition-all duration-300 cursor-pointer">
              <User className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <button onClick={() => navigate("/wishlist")} className="group relative text-white/60 hover:text-white transition-all duration-300 cursor-pointer">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white text-[7px] text-black font-bold items-center justify-center shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                    {wishlistItems.length}
                  </span>
                </span>
              )}
            </button>

            {/* Cart */}
            <button onClick={() => navigate("/cart")} className="group relative text-white/60 hover:text-white transition-all duration-300 cursor-pointer">
              <ShoppingBag className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  {cartItems.length}
                </span>
              )}
            </button>

          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar