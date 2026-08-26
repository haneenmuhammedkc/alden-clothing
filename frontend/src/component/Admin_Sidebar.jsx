import React from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  FolderTree, 
  BarChart2, 
  Tag, 
  LogOut 
} from "lucide-react"
import { assets } from "../assets/assets"
import { showConfirm, showSuccess } from "../utils/alerts.js"

/**
 * AdminSidebar — Alden Clothing Operational Admin Navigation
 * Background: #0F172A (Dark Slate Blue)
 * Active State: #8B634B (Cocoa Brown)
 */
const AdminSidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    const result = await showConfirm("Logout", "Are you sure you want to logout from Admin Portal?", "Logout")
    if (result.isConfirmed) {
      localStorage.removeItem("adminToken")
      showSuccess("Logged out", "You have been logged out successfully")
      navigate("/a-login")
    }
  }

  const activeLink = "w-full flex items-center space-x-3 px-4 py-2.5 rounded-[6px] bg-[#8B634B] text-white font-semibold text-xs tracking-wider transition-colors"
  const normalLink = "w-full flex items-center space-x-3 px-4 py-2.5 rounded-[6px] text-slate-400 hover:text-white hover:bg-slate-800 font-medium text-xs tracking-wider transition-colors"

  const navItems = [
    { label: "DASHBOARD", icon: LayoutDashboard, path: "/a-dash" },
    { label: "SALES", icon: TrendingUp, path: "/a-sales" },
    { label: "ORDERS", icon: ShoppingBag, path: "/a-orders" },
    { label: "PRODUCTS", icon: Package, path: "/a-products" },
    { label: "CUSTOMERS", icon: Users, path: "/a-customers" },
    { label: "CATEGORIES", icon: FolderTree, path: "/a-category" },
    { label: "REPORTS", icon: BarChart2, path: "/a-reports" },
    { label: "PROMOS", icon: Tag, path: "/a-promos" },
  ]

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden md:flex fixed top-0 left-0 w-60 h-screen bg-[#0F172A] text-white flex-col justify-between p-4 z-50 border-r border-slate-800 font-sans">
        
        <div className="space-y-6">
          {/* Header Brand Wordmark */}
          <div className="px-4 pt-2 flex items-center space-x-3 border-b border-slate-800 pb-4">
            <span className="font-sans font-bold text-sm tracking-[0.2em] text-white uppercase">
              ALDEN <span className="text-[#8B634B]">ADMIN</span>
            </span>
          </div>

          {/* Navigation Links List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const IconComponent = item.icon
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) => (isActive ? activeLink : normalLink)}
                >
                  <IconComponent className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Admin Logout Action */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-[6px] text-slate-400 hover:text-red-400 hover:bg-slate-800 text-xs font-semibold tracking-wider transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>SIGN OUT</span>
        </button>

      </aside>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 flex">
          <div className="w-64 bg-[#0F172A] h-full p-4 flex flex-col justify-between text-white font-sans">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <span className="font-bold text-sm tracking-widest uppercase">ALDEN ADMIN</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => (isActive ? activeLink : normalLink)}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  )
                })}
              </nav>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false)
                handleLogout()
              }}
              className="flex items-center space-x-3 px-4 py-2.5 text-slate-400 hover:text-red-400 text-xs font-semibold tracking-wider"
            >
              <LogOut className="w-4 h-4" />
              <span>SIGN OUT</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminSidebar