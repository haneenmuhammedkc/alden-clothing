import React, { useEffect, useState } from "react"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import axios from "axios"
import { FiCreditCard, FiPackage, FiArrowLeft, FiActivity } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState("ALL") 
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Fetch user's transaction history
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("userToken")
      if (!token) {
        navigate("/login")
        return
      }
      const { data } = await axios.get(
        "http://localhost:4001/api/transactions/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setTransactions(data.transactions)
    } catch(err){
      setError("Failed to load transactions")
      console.error(err)
    } finally{
      setLoading(false)
    }
  }

  // Fetch transactions once when component mounts
  useEffect(() => {
    fetchTransactions()
  }, [])

  // To Filter Transactions
  const filteredTransactions = transactions.filter((txn) => {
    if (filterType === "CREDIT") return txn.type === "WALLET_CREDIT"
    if (filterType === "DEBIT") return txn.type !== "WALLET_CREDIT"
    return true
  })

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-white selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-25 pb-24">

        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-10">
          <div className="flex items-start gap-6">
            <motion.button whileHover={{ x: -5 }} onClick={() => navigate("/profile")}
              className="p-3 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all">
              <FiArrowLeft />
            </motion.button>
            <div>
              <h1 className="text-4xl md:text-4xl font-black tracking-tighter uppercase leading-none">
                Transaction <span className="text-gray-500">History</span>
              </h1>
              <div className="flex items-center gap-2 mt-4 text-[10px] tracking-[0.4em] text-gray-500 uppercase font-bold">
                <FiActivity className="text-white animate-pulse" />
                Real-time Transaction Stream
              </div>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
        </motion.div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="p-6 border border-white/10 bg-white/5 rounded-sm">
                <p className="text-[10px] tracking-widest text-gray-500 mb-2 font-bold uppercase">Network Status</p>
                <p className="text-xl font-mono">ENCRYPTED</p>
            </div>
            <div className="p-6 border border-white/10 bg-white/5 rounded-sm">
                <p className="text-[10px] tracking-widest text-gray-500 mb-2 font-bold uppercase">Total Events</p>
                <p className="text-xl font-mono">{transactions.length.toString().padStart(2, '0')}</p>
            </div>
            <div className="p-6 border border-white/10 bg-white/5 rounded-sm">
                <p className="text-[10px] tracking-widest text-gray-500 mb-2 font-bold uppercase">Currency</p>
                <p className="text-xl font-mono">INR (₹)</p>
            </div>
        </div>

        {/* Filter Dropdown */}
        <div className="flex justify-end mb-8">
          <select value={filterType} onChange={(e)=>setFilterType(e.target.value)}
            className="bg-black border border-white/20 text-xs uppercase tracking-[0.3em] px-4 py-3 rounded-sm focus:outline-none
              focus:border-white hover:border-white/40 transition-all">
            <option value="ALL">All Transactions</option>
            <option value="CREDIT">Credit Only</option>
            <option value="DEBIT">Debit Only</option>
          </select>
        </div>

        {/* Content Listing Section */}
        <div className="relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
               <p className="text-[10px] tracking-widest text-gray-500 uppercase">Synchronizing Blocks...</p>
            </div>
          ) : error && transactions.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
               <p className="text-red-500 font-mono text-sm uppercase tracking-widest">{error}</p>
            </div>
          ) : transactions.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-20 text-center py-24 border border-white/5 rounded-3xl bg-white/2">
              <div className="text-6xl mb-6 opacity-20 font-black uppercase tracking-tighter">Empty</div>
              <p className="text-gray-500 tracking-widest text-sm uppercase font-bold">No Protocol Data Found</p>
              <p className="text-[10px] text-gray-700 mt-2 font-bold uppercase tracking-widest">Initialize transactions to populate ledger</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredTransactions.map((txn, index) => {
                  const isCredit = txn.type === "WALLET_CREDIT"
                  const isSuccess = txn.status === "SUCCESS"

                  return (
                    <motion.div key={txn._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.005, backgroundColor: "rgba(255,255,255,0.03)" }} className="group relative border p-6
                    border-white/10 bg-black rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
                    
                      {/* Left Side Info */}
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 flex items-center justify-center rounded-sm border ${isCredit ? 'border-white text-white bg-white/10' : 'border-white/20 text-gray-500'}`}>
                          {isCredit ? <FiCreditCard size={24} /> : <FiPackage size={24} />}
                        </div>

                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold tracking-tight uppercase leading-none">
                              {txn.type === "WALLET_CREDIT" ? "Credit_Entry" : "Debit_Event"}
                            </h3>
                            <span className={`text-[9px] px-2 py-0.5 border font-bold ${isSuccess ? 'border-white/20 text-gray-400' : 'border-red-900 text-red-500'}`}>
                              {txn.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 font-mono uppercase tracking-tighter">
                            ID: {txn._id.slice(-8)} || {txn.description}
                          </p>
                          <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-widest font-bold">
                            {formatDate(txn.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Right Side Amounts */}
                      <div className="flex md:flex-col items-end justify-between md:justify-center border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                        <div className={`text-2xl font-black tabular-nums ${isCredit ? 'text-white' : 'text-gray-400'}`}>
                          {isCredit ? "+" : "-"} ₹{txn.amount.toLocaleString()}
                        </div>
                        
                        {txn.balanceAfter !== undefined && (
                          <div className="text-[10px] text-gray-600 mt-1 uppercase tracking-[0.2em] font-mono font-bold">
                            Closing Balance: ₹{txn.balanceAfter.toLocaleString()}
                          </div>
                        )}
                      </div>

                      {/* Hover Side Line */}
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default TransactionHistory