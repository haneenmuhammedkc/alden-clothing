import React from 'react'
import Navbar from '../component/Navbar'
import Hero from '../component/Hero'
import Exclusive from '../component/Exclusive'
import Jackets from '../component/Jackets'
import Footer from '../component/Footer'
import OurPolicy from '../component/OurPolicy'

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Exclusive />
      <Jackets />
      <OurPolicy />
      <Footer />
    </div>
  )
}

export default Home