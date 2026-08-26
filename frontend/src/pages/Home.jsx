import React from 'react'
import Navbar from '../component/Navbar'
import Hero from '../component/Hero'
import Exclusive from '../component/Exclusive'
import Jackets from '../component/Jackets'
import NewArrivals from '../component/NewArrivals'
import EditorialStatement from '../component/EditorialStatement'
import OurPolicy from '../component/OurPolicy'
import Footer from '../component/Footer'

const Home = () => {
  return (
    <div className="bg-[#F5EFE8] min-h-screen font-sans selection:bg-[#8B634B] selection:text-white">
      {/* 1. Editorial Header / Navbar */}
      <Navbar />

      {/* 2. Hero Editorial Campaign */}
      <Hero />

      {/* 3. Shop By Category */}
      <Exclusive />

      {/* 4. Secondary Editorial Campaign */}
      <Jackets />

      {/* 5. New Arrivals */}
      <NewArrivals />

      {/* 6. Editorial Brand Statement */}
      <EditorialStatement />

      {/* 7. Newsletter & Commitment Policies */}
      <OurPolicy />

      {/* 8. Multi-Column Footer */}
      <Footer />
    </div>
  )
}

export default Home