import React, { useState, useEffect } from "react"
import { ArrowLeft, Plus, History, CreditCard, ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon } from "lucide-react"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import Button from "../component/Button"
import Input from "../component/Input"
import { assets } from "../assets/assets"
import axiosInstance from "../utils/axiosInstance"

/**
 * Wallet — Alden Clothing Timeless Editorial Luxury Wallet Workspace
 * Dark Deep Espresso `#30251F` hero card with gold/copper balance typography.
 */
const Wallet = () => {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState("")

  // Fetch wallet balance + transactions on load
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem("userToken")
        const res = await axiosInstance.get("/api/wallet", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setBalance(res.data.balance || 0)
        setTransactions(res.data.transactions || [])
        setUserName(res.data.user?.name || "User")
      } catch (err) {
        console.error("Failed to load wallet", err)
      }
    }
    fetchWallet()
  }, [])

  // Credit funds to wallet
  const handleAddFunds = async () => {
    if (!amount || amount <= 0) return
    setIsLoading(true)
    try {
      const token = localStorage.getItem("userToken")
      const paymentId = `PAY_${Date.now()}`
      const res = await axiosInstance.post(
        "/api/wallet/credit",
        { amount, paymentId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setBalance(res.data.balance)

      const walletRes = await axiosInstance.get("/api/wallet", {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTransactions(walletRes.data.transactions)
      setAmount("")
    } catch (err) {
      console.error("Add funds failed", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#F5EFE8] min-h-screen text-[#30251F] font-sans selection:bg-[#8B634B] selection:text-white">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-4 md:px-8 py-12">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#DED4CB]">
          <div className="space-y-2">
            <a href="/profile" className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#76675D] hover:text-[#30251F] transition-colors">
              <ArrowLeft className="w-4 h-4 text-[#8B634B]" />
              <span>RETURN TO PROFILE</span>
            </a>
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#30251F]">
              ALDEN DIGITAL WALLET
            </h1>
          </div>
        </div>

        {/* 12-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (5 Columns: Balance Hero Card & Add Funds Form) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Dark Deep Espresso Balance Hero Card */}
            <div className="bg-[#30251F] text-[#FBF9F6] border border-[#30251F] rounded-[16px] p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D8C4B4]">
                    AVAILABLE BALANCE
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif text-white pt-1">
                    ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </h2>
                </div>
                <CreditCard className="w-8 h-8 text-[#D8C4B4]" />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-[#D8C4B4]">
                <span>CLIENT: <strong className="text-white uppercase">{userName}</strong></span>
                <span className="bg-[#8B634B] text-white px-2 py-0.5 rounded-[4px] text-[10px] uppercase tracking-wider">ACTIVE WALLET</span>
              </div>
            </div>

            {/* Add Funds Form */}
            <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[12px] p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#30251F] pb-2 border-b border-[#DED4CB]">
                CREDIT FUNDS TO WALLET
              </h3>

              <div className="space-y-3">
                <Input
                  label="Amount (₹)"
                  type="number"
                  placeholder="Enter credit amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

                {/* Preset Amount Pills */}
                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 2000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className="py-2 rounded-[6px] border border-[#DED4CB] bg-[#F5EFE8] text-xs font-semibold text-[#30251F] hover:bg-[#8B634B] hover:text-white transition-colors cursor-pointer"
                    >
                      + ₹{val}
                    </button>
                  ))}
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  disabled={isLoading || !amount || parseFloat(amount) <= 0}
                  onClick={handleAddFunds}
                  className="h-11 text-xs"
                >
                  {isLoading ? "PROCESSING TRANSFER..." : "CONFIRM TOP-UP TRANSFER"}
                </Button>
              </div>
            </div>

          </div>

          {/* Right Column (7 Columns: Activity Ledger) */}
          <div className="lg:col-span-7">
            <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[12px] p-6 space-y-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#30251F] pb-2 border-b border-[#DED4CB]">
                WALLET ACTIVITY LEDGER
              </h3>

              <div className="space-y-3 max-h-120 overflow-y-auto pr-1 custom-scrollbar">
                {(!transactions || transactions.length === 0) ? (
                  <div className="text-center py-16 space-y-2">
                    <WalletIcon className="w-10 h-10 text-[#76675D] mx-auto" />
                    <p className="text-xs text-[#76675D]">No wallet transactions recorded yet.</p>
                  </div>
                ) : (
                  transactions.map((txn, index) => (
                    <div
                      key={txn._id || index}
                      className="p-4 bg-[#F5EFE8] border border-[#DED4CB]/80 rounded-[8px] flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          txn.type === 'DEBIT' ? 'bg-[#8C2727]/10 text-[#8C2727]' : 'bg-[#2D5A27]/10 text-[#2D5A27]'
                        }`}>
                          {txn.type === 'DEBIT' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold uppercase text-[#30251F]">
                            {txn.label || (txn.type === 'DEBIT' ? 'Order Purchase' : 'Wallet Credit Top-up')}
                          </p>
                          <p className="text-[11px] text-[#76675D]">
                            {new Date(txn.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className={`text-sm font-bold ${txn.type === 'DEBIT' ? 'text-[#8C2727]' : 'text-[#2D5A27]'}`}>
                          {txn.type === 'DEBIT' ? '-' : '+'} ₹{parseFloat(txn.amount).toLocaleString('en-IN')}
                        </p>
                        <span className="text-[10px] text-[#76675D] uppercase font-semibold">VALIDATED</span>
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