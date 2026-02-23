import React from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { PiSquaresFourFill, PiShoppingCartSimpleFill, PiBagFill, PiUsersThreeFill, PiShapesFill, PiChartBarFill, PiSignOutBold, PiTagFill, PiTrendUpFill } from "react-icons/pi"
import { assets } from "../assets/assets"
import { showConfirm, showSuccess } from "../utils/alerts.js"

const AdminSidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {

  const navigate = useNavigate()

  const handleLogout = async () => {
    const result = await showConfirm("Logout", "Are you sure you want to logout?", "Logout")
    if (result.isConfirmed) {
      localStorage.removeItem("adminToken")
      showSuccess("Logged out", "You have been logged out successfully")
      navigate("/a-login")
    }
  }

  const activeLink = "w-23 flex flex-col items-center justify-center py-3 rounded-md bg-white/20 text-white transition";
  const normalLink = "w-full flex flex-col items-center justify-center py-3 rounded-md hover:bg-white/10 text-gray-300 transition";

  return (
    <>
      <aside className="hidden md:flex fixed top-0 left-0 w-27.5 pt-7 pb-7 bg-black text-white h-screen flex-col items-center overflow-x-hidden z-50">
        <img className="w-20 mb-10" src={assets.logo} alt="logo" />
        <nav className="flex-1 overflow-y-auto overflow-x-hidden pb-3 no-scrollbar flex flex-col items-center gap-6 text-xs">
            <NavLink to="/a-dash" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                <PiSquaresFourFill className="text-3xl" />Dashboard
            </NavLink>

            <NavLink to="/a-sales" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                <PiTrendUpFill className="text-3xl" />Sales
            </NavLink>

            <NavLink to="/a-orders" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                <PiShoppingCartSimpleFill className="text-3xl" />Orders
            </NavLink>

            <NavLink to="/a-products" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                <PiBagFill className="text-3xl" />Products
            </NavLink>

            <NavLink to="/a-customers" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                <PiUsersThreeFill className="text-3xl" />Customers
            </NavLink>

            <NavLink to="/a-category" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                <PiShapesFill className="text-3xl" />Category
            </NavLink>

            <NavLink to="/a-reports" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                <PiChartBarFill className="text-3xl" />Reports
            </NavLink>

            <NavLink to="/a-promos" className={({ isActive }) => (isActive ? activeLink : normalLink)}>
              <PiTagFill className="text-3xl" />Promos
            </NavLink>
            </nav>

          {/* Logout Button */}
          <button onClick={handleLogout} className="w-full h-15 flex flex-col items-center justify-center rounded-md text-xs
          hover:bg-white/10 text-red-400 transition">
            <PiSignOutBold className="text-3xl" />
            Logout
          </button>
        </aside>
    </>
  )
}

export default AdminSidebar