import React, { useState } from 'react'
import { RefreshCcw, ShieldCheck, Headphones } from 'lucide-react'
import Button from './Button'

const OurPolicy = () => {
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState("")

  const onSubmitHandler = (event) => {
    event.preventDefault()
    if (!email) return
    setSubscribed(true)
    setTimeout(() => {
      setSubscribed(false)
      setEmail("")
    }, 3000)
  }

  const policies = [
    {
      icon: <RefreshCcw className="w-6 h-6 text-[#8B634B]" />,
      title: "EASY EXCHANGE",
      desc: "Hassle-free exchanges designed for your convenience."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#8B634B]" />,
      title: "7 DAYS RETURN",
      desc: "Complimentary return window for complete peace of mind."
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#8B634B]" />,
      title: "ELITE SUPPORT",
      desc: "Dedicated assistance for all your tailoring & order inquiries."
    }
  ]

  return (
    <section className="bg-[#F5EFE8] py-16 md:py-24 px-4 md:px-8 space-y-16 font-sans">
      <div className="max-w-[1320px] mx-auto space-y-16">
        
        {/* Commitment Policy Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {policies.map((policy, index) => (
            <div 
              key={index}
              className="p-6 rounded-[12px] border border-[#DED4CB] bg-[#FBF9F6] text-center flex flex-col items-center space-y-3 shadow-xs"
            >
              <div className="w-12 h-12 rounded-full bg-[#F5EFE8] border border-[#DED4CB] flex items-center justify-center">
                {policy.icon}
              </div>
              <h3 className="text-xs font-bold tracking-wider text-[#30251F] uppercase">
                {policy.title}
              </h3>
              <p className="text-xs text-[#76675D] leading-relaxed max-w-xs">
                {policy.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Newsletter Block (#30251F Dark Espresso) */}
        <div className="rounded-[16px] bg-[#30251F] text-white p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs">
          
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D8C4B4]">
              STAY CONNECTED
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-white">
              BE THE FIRST TO DISCOVER NEW DROPS
            </h2>
            <p className="text-xs sm:text-sm text-[#D8C4B4]/80 leading-relaxed font-sans">
              Join our fashion newsletter for new seasonal collection releases, lookbooks, and private event access.
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 px-4 bg-[#FBF9F6] border border-[#DED4CB] rounded-[4px] text-sm text-[#30251F] placeholder-[#76675D]/60 focus:outline-none focus:ring-2 focus:ring-[#8B634B] w-full sm:w-80 font-sans"
            />
            <Button
              type="submit"
              variant="primary"
              className="h-12 px-7 w-full sm:w-auto shrink-0"
            >
              {subscribed ? "SUBSCRIBED ✓" : "SUBSCRIBE"}
            </Button>
          </form>

        </div>

      </div>
    </section>
  )
}

export default OurPolicy