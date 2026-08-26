import React, { useEffect, useState } from "react"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"
import Badge from "../component/Badge"
import { ArrowLeft, CreditCard, Package } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../utils/axiosInstance"

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

/**
 * TransactionHistory — Alden Clothing Timeless Editorial Luxury Ledger Stream
 */
const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState("ALL")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("userToken")
      if (!token) {
        navigate("/login")
        return
      }
      const { data } = await axiosInstance.get(
        "/api/transactions/my",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTransactions(data.transactions || [])
    } catch (err) {
      setError("Failed to load transactions")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const filteredTransactions = transactions.filter((txn) => {
    if (filterType === "CREDIT") return txn.type === "WALLET_CREDIT"
    if (filterType === "DEBIT") return txn.type !== "WALLET_CREDIT"
    return true
  })

  return (
    <div className="bg-[#F5EFE8] min-h-screen text-[#30251F] font-sans selection:bg-[#8B634B] selection:text-white">
      <Navbar />

      <main className="max-w-[1320px] mx-auto px-4 md:px-8 py-12">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#DED4CB]">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#76675D] hover:text-[#30251F] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#8B634B]" />
              <span>RETURN TO PROFILE</span>
            </button>
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#30251F]">
              LEDGER TRANSACTION HISTORY
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="h-10 px-3 bg-[#FBF9F6] border border-[#DED4CB] rounded-[4px] text-xs uppercase font-semibold text-[#30251F] focus:outline-none focus:border-[#8B634B]"
            >
              <option value="ALL">ALL TRANSACTIONS</option>
              <option value="CREDIT">CREDITS ONLY</option>
              <option value="DEBIT">DEBITS ONLY</option>
            </select>
          </div>
        </div>

        {/* Ledger Stream List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-8 h-8 border-2 border-[#DED4CB] border-t-[#8B634B] rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-widest text-[#76675D]">Synchronizing Ledger...</p>
          </div>
        ) : error && transactions.length === 0 ? (
          <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[12px] p-8 text-center text-xs text-[#8C2727] font-semibold">
            {error}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[12px] p-12 text-center space-y-2">
            <p className="text-sm font-serif text-[#30251F]">NO TRANSACTIONS DETECTED</p>
            <p className="text-xs text-[#76675D]">Your financial ledger is currently clear.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((txn) => {
              const isCredit = txn.type === "WALLET_CREDIT"
              const isSuccess = txn.status === "SUCCESS"

              return (
                <div
                  key={txn._id}
                  className="bg-[#FBF9F6] border border-[#DED4CB] rounded-[10px] p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-[6px] flex items-center justify-center shrink-0 border ${
                      isCredit ? 'bg-[#E8F2E6] border-[#A5C69F] text-[#2D5A27]' : 'bg-[#F5EFE8] border-[#DED4CB] text-[#76675D]'
                    }`}>
                      {isCredit ? <CreditCard className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#30251F]">
                          {txn.type === "WALLET_CREDIT" ? "CREDIT ENTRY" : "DEBIT EVENT"}
                        </h3>
                        <Badge variant={isSuccess ? "success" : "danger"}>
                          {txn.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#76675D]">
                        REF ID: {txn._id.slice(-8).toUpperCase()} • {txn.description || "System Transaction"}
                      </p>
                      <p className="text-[11px] text-[#76675D]">
                        {formatDate(txn.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right border-t sm:border-t-0 border-[#DED4CB]/60 pt-2 sm:pt-0">
                    <p className={`text-base font-bold ${isCredit ? 'text-[#2D5A27]' : 'text-[#30251F]'}`}>
                      {isCredit ? "+" : "-"} ₹{(txn.amount || 0).toLocaleString('en-IN')}
                    </p>
                    {txn.balanceAfter !== undefined && (
                      <p className="text-[11px] text-[#76675D]">
                        CLOSING BALANCE: ₹{(txn.balanceAfter || 0).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}

export default TransactionHistory