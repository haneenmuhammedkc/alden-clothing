import { useEffect, useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { FiToggleLeft, FiToggleRight } from "react-icons/fi"
import Admin_Sidebar from "../component/Admin_Sidebar"
import { FaBars } from "react-icons/fa"

const AdminPromos = () => {

  const [promos,setPromos] = useState([])
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(null)
  const [form,setForm] = useState({
    code:"",
    discountType:"percent",
    discountValue:"",
    minCartValue:"",
    maxDiscount:"",
    usageLimit:"",
    expiryDate:""
  })

  const token = localStorage.getItem("adminToken")

  // Fetch Promos
  const fetchPromos = async () => {
    try{
      setLoading(true)
      setError(null)
      const res = await axios.get("http://localhost:4001/api/admin/promos",{
        headers:{ Authorization:`Bearer ${token}` }
      })
      // ensure promos is always array
      setPromos(Array.isArray(res.data) ? res.data : [])
    }catch(err){
      console.error(err)
      setError("Failed to load promos")
      setPromos([])
    }finally{
      setLoading(false)
    }
  }

  // Create Promo
  const createPromo = async () => {
    try{
      await axios.post(
        "http://localhost:4001/api/admin/promos",
        form, // ✅ body
        {
          headers:{ Authorization:`Bearer ${token}` } // ✅ config
        }
      )
      setForm({ code:"", discountType:"percent", discountValue:"", minCartValue:"", maxDiscount:"", usageLimit:"", expiryDate:"" })
      fetchPromos()
    }catch(err){
      console.error(err)
      alert("Failed to create promo")
    }
  }

  // Toggle Promo
  const togglePromo = async (id) => {
    try{
      await axios.patch(
        `http://localhost:4001/api/admin/promos/${id}/toggle`,
        {}, // empty body
        {
          headers:{ Authorization:`Bearer ${token}` }
        }
      )
      fetchPromos()
    }catch(err){
      console.error(err)
      alert("Toggle failed")
    }
  }

  useEffect(()=>{
    fetchPromos()
  },[])

  return (
    <div className="min-h-screen flex pl-25">
      <Admin_Sidebar />

      <div className="flex-1 p-10 text-white overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Customer Feedbacks & Reports</h2>
            <FaBars className="text-2xl md:hidden" />
        </div>

        {/* Create Promo Section */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
          className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-10">

          <h2 className="mb-4 font-medium">Create Promo</h2>
          <div className="grid grid-cols-3 gap-4">

            <input className="input" placeholder="Code" value={form.code}
              onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})}/>

            <select className="input" value={form.discountType} onChange={e=>setForm({...form,discountType:e.target.value})}>
              <option value="percent">Percent</option>
              <option value="flat">Flat</option>
            </select>

            <input type="number" className="input" placeholder="Discount Value" value={form.discountValue}
              onChange={e=>setForm({...form,discountValue:e.target.value})}/>

            <input type="number" className="input" placeholder="Min Cart" value={form.minCartValue}
              onChange={e=>setForm({...form,minCartValue:e.target.value})}/>

            <input type="number" className="input" placeholder="Max Discount" value={form.maxDiscount}
              onChange={e=>setForm({...form,maxDiscount:e.target.value})}/>

            <input type="number" className="input" placeholder="Usage Limit" value={form.usageLimit}
              onChange={e=>setForm({...form,usageLimit:e.target.value})}/>

            <input type="date" className="input col-span-2" value={form.expiryDate}
              onChange={e=>setForm({...form,expiryDate:e.target.value})}/>

            <button onClick={createPromo} className="bg-white text-black rounded-lg font-medium">
              Create
            </button>
          </div>
        </motion.div>

        {loading && <p className="text-gray-400">Loading promos...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {/* Promo List */}
        <div className="space-y-4">
          {Array.isArray(promos) && promos.map(p => (
            <motion.div key={p._id} layout
              className="bg-black/40 border border-white/10 p-5 rounded-xl flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{p.code}</h3>

                <p className="text-sm text-gray-400">
                  {p.discountValue}{p.discountType==="percent"?"%":"₹"} •
                  Min ₹{p.minCartValue || 0} •
                  Used {p.usedCount}/{p.usageLimit || "∞"}
                </p>

                <p className="text-xs text-gray-500">
                  Exp: {new Date(p.expiryDate).toLocaleDateString()}
                </p>
              </div>

              <button onClick={()=>togglePromo(p._id)}>
                {p.isActive
                  ? <FiToggleRight className="text-3xl text-green-400"/>
                  : <FiToggleLeft className="text-3xl text-gray-500"/>}
              </button>
            </motion.div>

          ))}

        </div>

      </div>
    </div>
  )
}

export default AdminPromos