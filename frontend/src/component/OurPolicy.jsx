import React, { useEffect, useState } from 'react'
import { RefreshCcw, ShieldCheck, Headphones, Send } from 'lucide-react'

const OurPolicy = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const onSubmitHandler = (event) => {
    event.preventDefault()
  }

  const policies = [
    {
      icon: <RefreshCcw className="w-8 h-8 md:w-10 md:h-10 text-white" />,
      title: "EASY EXCHANGE",
      desc: "Hassle-free exchanges designed for your convenience.",
      delay: "0s"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-white" />,
      title: "7 DAYS RETURN",
      desc: "Complimentary return window for peace of mind.",
      delay: "0.2s"
    },
    {
      icon: <Headphones className="w-8 h-8 md:w-10 md:h-10 text-white" />,
      title: "ELITE SUPPORT",
      desc: "Dedicated 24/7 assistance for all your inquiries.",
      delay: "0.4s"
    }
  ]

  return (
    <section className="bg-black pt-24 pb-10 px-6 md:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Policy Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-white text-3xl md:text-4xl font-black tracking-tighter mb-2"> OUR COMMITMENT </h2>
          <div className="w-20 h-1 bg-white mx-auto"></div>
        </div>

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-32">
          {policies.map((policy, index) => (
            <div key={index} style={{ transitionDelay: policy.delay }}
              className={`group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10
                transition-all duration-700 transform${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="absolute -inset-1 bg-linear-to-r from-white/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              
              {/* Content Box */}
              <div className="relative flex flex-col items-center text-center">

                {/* Icon */}
                <div className="mb-6 p-4 rounded-full border border-white/20 bg-black group-hover:scale-110
                  group-hover:border-white transition-all duration-500">
                  {policy.icon}
                </div>

                {/* Title */}
                <h3 className="text-white text-lg font-bold tracking-widest uppercase mb-3 group-hover:tracking-[0.2em] transition-all duration-500">
                  {policy.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed max-w-62.5"> {policy.desc} </p>

                <div className="mt-6 w-0 h-px bg-white group-hover:w-full transition-all duration-700"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 delay-500 transform
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-block px-4 py-1 mb-6 border border-white/20 rounded-full bg-white/5">
            <p className="text-white text-[10px] tracking-[0.3em] uppercase font-bold">Member Exclusive</p>
          </div>
          
          <h2 className="text-3xl md:text-5xl text-white font-black tracking-tighter uppercase mb-4">
            Subscribe & Save 25%
          </h2>
          
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Join our fashion community and be the first to explore new arrivals, exclusive drops, and seasonal trends.
          </p>

          <form onSubmit={onSubmitHandler} className="relative max-w-lg mx-auto flex items-center group transition-all duration-500">
            <div className="absolute -inset-0.5 bg-white/20 rounded-lg blur opacity-30 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative w-full flex bg-black border border-white/30 rounded-lg overflow-hidden focus-within:border-white transition-colors duration-500">
              <div className="flex items-center pl-4 text-gray-500">
                <Send className="w-4 h-4" />
              </div>

              {/* Email Input */}
              <input className="w-full bg-transparent text-white py-4 px-4 outline-none placeholder:text-gray-600
                placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest" type="email" required
                placeholder="Enter your email address"/>

              {/* Submit Button */}
              <button className="bg-white text-black font-black text-[10px] tracking-[0.2em] px-8 hover:bg-gray-200
                transition-colors duration-300 uppercase shrink-0 cursor-pointer" type="submit">
                Subscribe
              </button>
            </div>
          </form>
          
          <p className="mt-6 text-[10px] text-gray-600 uppercase tracking-widest font-medium">
            No spam. Just style. Unsubscribe anytime.
          </p>
        </div>

        {/* Vertical Divider */}
        <div className="flex justify-center mt-24 opacity-20">
          <div className="w-px h-24 bg-linear-to-b from-white to-transparent"></div>
        </div>
      </div>
    </section>
  )
}

export default OurPolicy