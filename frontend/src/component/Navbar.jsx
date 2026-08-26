import { useNavigate, NavLink, useLocation } from "react-router-dom"
import { useWishlist } from "../context/WishlistContext"
import { useCart } from "../context/CartContext"
import { useState, useEffect, useRef } from "react"
import { User, Heart, ShoppingBag, Search, Menu, X } from "lucide-react"

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { wishlistItems } = useWishlist()
  const { cartItems } = useCart()
  const debounceRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    location.pathname === "/kids" ||
    location.pathname === "/shop"

  const handleProfileClick = () => {
    const token = localStorage.getItem("userToken")
    if (token) {
      navigate("/profile")
    } else {
      navigate("/login")
    }
  }

  const navLinks = [
    { label: "HOME", path: "/" },
    { label: "MEN", path: "/men" },
    { label: "WOMEN", path: "/women" },
    { label: "KIDS", path: "/kids" },
    { label: "COLLECTIONS", path: "/men" }
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#F5EFE8] border-b border-[#DED4CB] w-full font-sans transition-colors duration-200">
      <nav className="max-w-[1320px] mx-auto h-20 px-4 md:px-8 flex items-center justify-between">
        
        {/* LEFT SECTION: Brand Wordmark */}
        <div className="flex items-center gap-10">
          <div 
            className="flex items-center cursor-pointer select-none" 
            onClick={() => navigate("/")}
          >
            <span className="text-xl font-bold tracking-tight text-[#30251F] font-sans">
              ALDEN
            </span>
          </div>
          
          {/* CENTER SECTION: Navigation Links */}
          <ul className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider font-semibold">
            {navLinks.map((item) => (
              <li key={item.label}>
                <NavLink 
                  to={item.path} 
                  end={item.path === "/"}
                  className={({ isActive }) => `
                    relative py-1 transition-colors duration-150
                    ${isActive ? "text-[#30251F]" : "text-[#76675D] hover:text-[#30251F]"}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8B634B] rounded-full"></span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT SECTION: Search & Icon Controls */}
        <div className="flex items-center gap-5 text-[#30251F]">

          {/* Search Input Field */}
          {showSearch && (
            <div className="relative flex items-center bg-[#FBF9F6] border border-[#DED4CB] rounded-[6px] px-3 py-1.5 w-36 focus-within:w-52 transition-all duration-200">
              <Search className="w-3.5 h-3.5 text-[#76675D] mr-2 shrink-0" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery} 
                onChange={(e) => {
                  const value = e.target.value
                  setSearchQuery(value)
                  if (debounceRef.current) clearTimeout(debounceRef.current)
                  debounceRef.current = setTimeout(() => {
                    const trimmed = value.trim()
                    navigate(trimmed ? `${location.pathname}?search=${encodeURIComponent(trimmed)}` : location.pathname, { replace: true })
                  }, 300)
                }}
                className="w-full bg-transparent text-xs text-[#30251F] placeholder-[#76675D]/60 focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center gap-4">

            {/* Profile Menu Trigger */}
            <button 
              onClick={handleProfileClick} 
              className="p-1.5 text-[#30251F] hover:text-[#8B634B] transition-colors cursor-pointer"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </button>

            {/* Wishlist Trigger */}
            <button 
              onClick={() => navigate("/wishlist")} 
              className="relative p-1.5 text-[#30251F] hover:text-[#8B634B] transition-colors cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 bg-[#B7A08D] text-[#30251F] text-[10px] font-bold rounded-full items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button 
              onClick={() => navigate("/cart")} 
              className="relative p-1.5 text-[#30251F] hover:text-[#8B634B] transition-colors cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8B634B] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#30251F] cursor-pointer"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

          </div>
        </div>

      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F5EFE8] border-b border-[#DED4CB] px-6 py-4 space-y-3 font-sans">
          {navLinks.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 text-xs font-bold uppercase text-[#30251F] border-b border-[#DED4CB] hover:text-[#8B634B] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}

export default Navbar