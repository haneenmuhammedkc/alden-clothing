import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

const Hero = () => {

  const containerVars = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.4 } }
  }

  const itemVars = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0,  transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
  }

  const bgImage = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#fafafa] font-['Montserrat',sans-serif]">
      {/* 1. Background Layer: Slow zoom-out reveal */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img 
            src={bgImage} 
            alt="New Collection" 
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/40 md:bg-transparent md:bg-linear-to-r md:from-black/70 md:via-transparent md:to-transparent"></div>
      </div>

      {/* 2. Content Layer */}
      <motion.div 
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 h-full flex flex-col justify-center"
      >
        
        {/* Top Tagline */}
        <motion.div variants={itemVars} className="mb-6">
          <span className="text-white md:text-black uppercase tracking-[0.5em] text-[10px] font-semibold border-l-2 border-white md:border-black pl-4 py-1">
            Season Departure — 2026
          </span>
        </motion.div>

        {/* Main Heading */}
        <div className="max-w-4xl overflow-hidden">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl text-white font-semibold leading-[1.05] tracking-tight mb-10"
          >
            <motion.span
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              ESSENTIALS
            </motion.span>

            <motion.span
              initial={{ opacity: 0, x: -120 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="block font-light italic opacity-80"
            >
              FOR THE MODERN
            </motion.span>

            <motion.span
              initial={{ opacity: 0, x: -140 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              INDIVIDUAL.
            </motion.span>
          </motion.h1>
        </div>

        {/* Call to Action Buttons */}
        <motion.div variants={itemVars} className="flex flex-wrap gap-6 items-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-4 bg-black text-white px-10 py-5 text-[11px] font-bold tracking-[0.3em] uppercase transition-all hover:bg-white hover:text-black border border-black shadow-xl"
          >
            Discover Men
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-4 bg-transparent text-white md:text-black px-10 py-5 text-[11px] font-bold tracking-[0.3em] uppercase border border-white md:border-black transition-all hover:bg-black hover:text-white"
          >
            Explore Women
          </motion.button>
        </motion.div>

      </motion.div>

      {/* Decorative Frame */}
      <motion.div 
        initial={{ opacity: 0, inset: "2rem" }}
        animate={{ opacity: 1, inset: "1rem" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute border border-white/20 pointer-events-none z-20"
      ></motion.div>
    </section>
  )
}

export default Hero