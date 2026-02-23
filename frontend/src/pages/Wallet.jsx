import React, { useState, useEffect } from "react"
import axios from "axios"
import { ArrowLeft, Plus, History, CreditCard, ArrowUpRight, ArrowDownLeft,  Wallet as WalletIcon, Zap, ShieldCheck } from "lucide-react"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import { assets } from "../assets/assets"

const Wallet = () => {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState("")

  // Fetches wallet balance + transactions, when the page loads
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem("userToken")
        const res = await axios.get("http://localhost:4001/api/wallet", { headers: { Authorization: `Bearer ${token}` } })
        setBalance(res.data.balance || 0)
        setTransactions(res.data.transactions || [])
        setUserName(res.data.user?.name || "User")
      } catch(err){
        console.error("Failed to load wallet", err)
      }
    }
    fetchWallet()
  }, [])

  // For adding money to wallet and updating the UI
  const handleAddFunds = async () => {
    if (!amount || amount <= 0) return
    setIsLoading(true)
    try {
      const token = localStorage.getItem("userToken")
      const paymentId = `PAY_${Date.now()}`
      const res = await axios.post(
        "http://localhost:4001/api/wallet/credit",
        { amount, paymentId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setBalance(res.data.balance)

      // refresh wallet data
      const walletRes = await axios.get("http://localhost:4001/api/wallet", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setTransactions(walletRes.data.transactions)
      setAmount("")
    } catch(err){
      console.error("Add funds failed", err)
    } finally{
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/80">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-25 pb-20 relative z-10">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <a href="/profile" className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center">
              <ArrowLeft size={20} />
            </a>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Wallet</h1>
              <p className="text-gray-400 text-sm">Real-time money management</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Section */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Visual Balance Card */}
            <div className="relative overflow-hidden p-8 rounded-4xl bg-linear-to-br from-black to-gray-800 transition-transform duration-500 hover:scale-[1.03]">
              <div className="absolute top-0 right-0 p-6 opacity-20">
                <Zap size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <CreditCard className="text-white/80" size={32} />
                </div>
                <p className="text-sm uppercase tracking-widest text-blue-100/70 mb-1">Available Funds</p>
                <h2 className="text-5xl font-bold mb-8 tracking-tight">
                  <span className="text-2xl mr-1 opacity-70">₹</span>
                  {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </h2>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase text-white/40 mb-1">Account Holder</p>
                    <p className="text-sm font-medium tracking-wide uppercase">{userName}</p>
                  </div>
                  <div className="h-8 w-12 bg-yellow-500/80 rounded-md shadow-inner shadow-black/20" />
                </div>
              </div>
            </div>

            {/* Add Fund Section */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-cyan-400" />
                Add Funds
              </h3>
              
              <div className="space-y-6">
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-medium text-gray-500
                   group-focus-within:text-cyan-400 transition-colors">₹</span>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-2xl font-semibold
                    focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white transition-all placeholder:text-gray-700"/>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[500, 1000, 2000].map(val => (
                    <button key={val} onClick={() => setAmount(val.toString())}
                      className="py-2.5 rounded-xl bg-black/5 border border-white/10 hover:bg-white hover:text-black hover:border-white/50
                        transition-all duration-400 text-sm font-medium active:scale-95">
                      +₹{val}
                    </button>
                  ))}
                </div>

                {/* Razorpay Button */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 ml-1">Preferred Gateway</p>
                  <button onClick={handleAddFunds} disabled={isLoading || !amount}
                    className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-3
                      hover:bg-neutral-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:hover:bg-white
                      transition-all overflow-hidden relative">
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <img src={assets.Razorpay} alt="Razorpay" className="h-6 grayscale brightness-0"/>
                        <span>Confirm Transfer</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-7">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl h-[92.5%] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <History size={20} className="text-purple-400" />
                  Activity History
                </h3>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto pr-2 max-h-150 custom-scrollbar">
                {(!transactions || transactions.length === 0) ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-30">
                    <WalletIcon size={48} className="mb-4" />
                    <p>No transactions detected</p>
                  </div>
                ) : (
                  transactions.map((txn, index) => (
                    <div 
                      key={txn._id || index}
                      className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl transition-colors ${
                          txn.type === 'DEBIT' 
                          ? 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20' 
                          : 'bg-green-500/10 text-green-400 group-hover:bg-green-500/20'
                        }`}>
                          {txn.type === 'DEBIT' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                        </div>
                        <div>
                          <p className="font-medium group-hover:text-white transition-colors capitalize">{txn.label || (txn.type === 'DEBIT' ? 'Asset Purchase' : 'Credit Top-up')}</p>
                          <p className="text-xs text-gray-500 font-mono">
                            {new Date(txn.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold tracking-tight ${
                          txn.type === 'DEBIT' ? 'text-white' : 'text-green-400'
                        }`}>
                          {txn.type === 'DEBIT' ? '-' : '+'} ₹{parseFloat(txn.amount).toLocaleString('en-IN')}
                        </p>
                        <p className="text-[10px] text-gray-600 uppercase font-mono tracking-widest">Validated</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Wallet