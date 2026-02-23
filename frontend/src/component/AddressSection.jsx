import axios from "axios"
import { useState, useEffect } from "react"
import { FiPlus, FiEdit2, FiTrash2, FiStar } from "react-icons/fi"

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
        const token = localStorage.getItem("userToken");
        const res = await axios.get("http://localhost:4001/api/users/address", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setAddresses(res.data);
      } catch(error){
        console.error("Failed to fetch addresses", error)
      }
    }
    fetchAddresses()
  },[])

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
        // UPDATE
        res = await axios.put(
          `http://localhost:4001/api/users/address/${editingAddressId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
      } else {
        // CREATE
        res = await axios.post(
          "http://localhost:4001/api/users/address",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
      }
      setAddresses(res.data.addresses)
      setShowForm(false)
      setEditingAddressId(null)
    } catch (error) {
      console.error("Address save/update failed", error)
    }
  }

  const setDefault = async (addressId) => {
    try {
      const token = localStorage.getItem("userToken")
      const res = await axios.put(
        `http://localhost:4001/api/users/address/${addressId}/default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setAddresses(res.data.addresses);
    } catch(error){
      console.error("Failed to set default address", error)
    }
  }

  const deleteAddress = async (addressId) => {
  const confirmDelete = window.confirm( "Are you sure you want to delete this address?" )
  if (!confirmDelete) return
    try {
      const token = localStorage.getItem("userToken")
      const res = await axios.delete(
        `http://localhost:4001/api/users/address/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setAddresses(res.data.addresses)
    } catch(error){
      console.error("Failed to delete address", error)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs tracking-[0.3em] font-bold text-white uppercase"> Saved Addresses </h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border-white/10 text-[10px] tracking-widest hover:bg-white/5 hover:border-white transition cursor-pointer">
          <FiPlus /> Add New Address
        </button>
      </div>

      {/* Address Cards */}
      <div className="w-full flex flex-col gap-2.5">
        {addresses.map((addr, index) => (
          <div key={index} className="w-full bg-black/30 border border-white/5 rounded-2xl px-4 py-4 flex justify-between
            hover:border-white/20 transition-all">

            {/* Left content */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-[10px] uppercase text-white tracking-wide"> {addr.addressType} </p>
                {addr.isDefault && (
                  <span className="flex items-center gap-1 text-xs text-white/60"> <FiStar className="text-xs" /> Default </span>
                )}
              </div>
              <p className="text-xs text-gray-300"> {addr.firstName} {addr.lastName || ""} · {addr.phone} </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                {addr.address?.line}, {addr.address?.city},<br />
                {addr.address?.state} - {addr.address?.pincode}
              </p>
            </div>

            {/* Right content */}
            <div className="flex flex-col items-end gap-2 text-gray-400 mt-1">
              {!addr.isDefault && (
                <button onClick={() => setDefault(addr._id)} className="text-xs hover:text-white transition cursor-pointer">
                  Set as default
                </button>
              )}

              <div className="flex gap-3">
                <button onClick={() => { setFormData({
                      fullName: addr.firstName,
                      phone: addr.phone,
                      email: addr.email,
                      house: addr.address.line.split(",")[0] || "",
                      area: addr.address.line.split(",")[1] || "",
                      city: addr.address.city,
                      state: addr.address.state,
                      pincode: addr.address.pincode,
                      landmark: "",
                      addressType: addr.addressType,
                      isDefault: addr.isDefault
                    })
                    setEditingAddressId(addr._id)
                    setShowForm(true)
                  }} className="hover:text-white transition text-sm cursor-pointer">
                  <FiEdit2 />
                </button>
                <button onClick={() => deleteAddress(addr._id)} className="hover:text-red-400 transition text-sm cursor-pointer">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Address Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-black/30 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold">Add New Address</h3>

          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40
            focus:outline-none placeholder:text-gray-600" required/>

          <div className="grid grid-cols-2 gap-3">
            <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40
              focus:outline-none placeholder:text-gray-600" required/>

            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40
              focus:outline-none placeholder:text-gray-600"/>
          </div>

          <input type="text" name="house" placeholder="House / Building" value={formData.house} onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40
            focus:outline-none placeholder:text-gray-600"/>

          <input type="text" name="area" placeholder="Road, Area, Colony" value={formData.area} onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40
            focus:outline-none placeholder:text-gray-600"/>

          <div className="grid grid-cols-2 gap-3">
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40
              focus:outline-none placeholder:text-gray-600"/>

            <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40
              focus:outline-none placeholder:text-gray-600"/>
          </div>

          <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40
            focus:outline-none placeholder:text-gray-600"/>

          <input type="text" name="landmark" placeholder="Nearby Landmark (optional)" value={formData.landmark}
            onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/40
            focus:outline-none placeholder:text-gray-600"/>

          <div className="flex items-center gap-4 cursor-pointer">
            <select name="addressType" value={formData.addressType} onChange={handleChange} className="input">
              <option>Home</option>
              <option>Work</option>
              <option>Other</option>
            </select>

            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
              <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleChange}/>
              Set as default
            </label>
          </div>

          <button type="submit" className="w-full py-2 rounded-full border border-white hover:bg-white hover:text-black
            transition cursor-pointer">
            Save Address
          </button>
        </form>
      )}
    </div>
  )
}

export default AddressSection