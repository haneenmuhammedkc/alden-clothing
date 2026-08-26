import React, { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Star } from "lucide-react"
import Button from "./Button"
import Input from "./Input"
import Select from "./Select"
import axiosInstance from "../utils/axiosInstance"

/**
 * AddressSection — Alden Clothing Saved Address Management Component
 */
const AddressSection = () => {
  const [addresses, setAddresses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    house: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    addressType: "Home",
    isDefault: false
  })

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("userToken")
        const res = await axiosInstance.get("/api/users/address", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAddresses(res.data || [])
      } catch (error) {
        console.error("Failed to fetch addresses", error)
      }
    }
    fetchAddresses()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("userToken")
      const payload = {
        firstName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        addressType: formData.addressType,
        address: {
          line: `${formData.house}, ${formData.area}`,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        isDefault: formData.isDefault
      }
      let res
      if (editingAddressId) {
        res = await axiosInstance.put(
          `/api/users/address/${editingAddressId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        res = await axiosInstance.post(
          "/api/users/address",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
      setAddresses(res.data.addresses || [])
      setShowForm(false)
      setEditingAddressId(null)
    } catch (error) {
      console.error("Address save/update failed", error)
    }
  }

  const setDefault = async (addressId) => {
    try {
      const token = localStorage.getItem("userToken")
      const res = await axiosInstance.put(
        `/api/users/address/${addressId}/default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setAddresses(res.data.addresses || [])
    } catch (error) {
      console.error("Failed to set default address", error)
    }
  }

  const deleteAddress = async (addressId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this address?")
    if (!confirmDelete) return
    try {
      const token = localStorage.getItem("userToken")
      const res = await axiosInstance.delete(
        `/api/users/address/${addressId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setAddresses(res.data.addresses || [])
    } catch (error) {
      console.error("Failed to delete address", error)
    }
  }

  return (
    <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[12px] p-6 space-y-6 shadow-xs font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DED4CB]">
        <h2 className="text-xs font-bold tracking-wider text-[#30251F] uppercase">SAVED ADDRESSES</h2>
        <button
          type="button"
          onClick={() => {
            setEditingAddressId(null)
            setFormData({
              fullName: "", phone: "", email: "", house: "", area: "",
              city: "", state: "", pincode: "", landmark: "", addressType: "Home", isDefault: false
            })
            setShowForm(!showForm)
          }}
          className="flex items-center space-x-1.5 text-xs font-semibold text-[#8B634B] hover:underline uppercase tracking-wider cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD NEW</span>
        </button>
      </div>

      {/* Address Cards List */}
      <div className="space-y-3">
        {addresses.length === 0 ? (
          <p className="text-xs text-[#76675D] italic text-center py-4">No saved addresses found.</p>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr._id}
              className="bg-[#F5EFE8] border border-[#DED4CB] rounded-[8px] p-4 flex justify-between items-start space-x-4 shadow-2xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B634B]">
                    {addr.addressType || "HOME"}
                  </span>
                  {addr.isDefault && (
                    <span className="flex items-center space-x-1 text-[10px] text-[#2D5A27] font-semibold">
                      <Star className="w-3 h-3 fill-[#2D5A27]" /> Default
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-[#30251F]">
                  {addr.firstName} {addr.lastName || ""} • {addr.phone}
                </p>
                <p className="text-xs text-[#76675D] leading-relaxed">
                  {addr.address?.line}, {addr.address?.city}, {addr.address?.state} - {addr.address?.pincode}
                </p>
              </div>

              <div className="flex flex-col items-end space-y-2 shrink-0">
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefault(addr._id)}
                    className="text-[10px] font-semibold text-[#76675D] hover:text-[#30251F] underline cursor-pointer"
                  >
                    SET AS DEFAULT
                  </button>
                )}

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        fullName: addr.firstName || "",
                        phone: addr.phone || "",
                        email: addr.email || "",
                        house: addr.address?.line?.split(",")?.[0] || "",
                        area: addr.address?.line?.split(",")?.[1] || "",
                        city: addr.address?.city || "",
                        state: addr.address?.state || "",
                        pincode: addr.address?.pincode || "",
                        landmark: "",
                        addressType: addr.addressType || "Home",
                        isDefault: addr.isDefault
                      })
                      setEditingAddressId(addr._id)
                      setShowForm(true)
                    }}
                    className="p-1 text-[#76675D] hover:text-[#30251F] cursor-pointer"
                    title="Edit Address"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAddress(addr._id)}
                    className="p-1 text-[#76675D] hover:text-[#8C2727] cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Address Input Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#F5EFE8] border border-[#DED4CB] rounded-[8px] p-4 space-y-3 pt-4">
          <h3 className="text-xs font-bold uppercase text-[#30251F]">
            {editingAddressId ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}
          </h3>

          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <Input
            label="House / Flat / Building"
            name="house"
            value={formData.house}
            onChange={handleChange}
            required
          />

          <Input
            label="Road, Area, Colony"
            name="area"
            value={formData.area}
            onChange={handleChange}
          />

          <div className="grid grid-cols-3 gap-2">
            <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
            <Input label="State" name="state" value={formData.state} onChange={handleChange} required />
            <Input label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Select
              label="Address Type"
              name="addressType"
              value={formData.addressType}
              onChange={handleChange}
              options={[
                { value: "Home", label: "HOME" },
                { value: "Work", label: "WORK" },
                { value: "Other", label: "OTHER" }
              ]}
            />

            <label className="flex items-center space-x-2 text-xs text-[#76675D] font-medium cursor-pointer pt-4">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="accent-[#8B634B]"
              />
              <span>SET AS DEFAULT</span>
            </label>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>
              CANCEL
            </Button>
            <Button variant="primary" type="submit">
              SAVE ADDRESS
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default AddressSection