import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import SectionHeading from './SectionHeading'
import axiosInstance from '../utils/axiosInstance'

const defaultArrivals = [
  {
    _id: "arr-1",
    name: "Essential Polo",
    category: { name: "Shirts" },
    price: 3499,
    images: ["https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80"],
    slug: "essential-polo"
  },
  {
    _id: "arr-2",
    name: "Oversized Hoodie",
    category: { name: "Hoodies" },
    price: 5999,
    images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"],
    slug: "oversized-hoodie"
  },
  {
    _id: "arr-3",
    name: "Straight Denim",
    category: { name: "Jeans" },
    price: 7499,
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"],
    slug: "straight-denim"
  },
  {
    _id: "arr-4",
    name: "Linen Utility Jacket",
    category: { name: "Jackets" },
    price: 8999,
    images: ["https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"],
    slug: "linen-utility-jacket"
  }
]

const NewArrivals = () => {
  const [products, setProducts] = useState(defaultArrivals)

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await axiosInstance.get('/api/products?limit=4')
        if (res.data?.data && res.data.data.length > 0) {
          setProducts(res.data.data.slice(0, 4))
        }
      } catch (err) {
        // Fallback to defaultArrivals
      }
    }
    fetchLatest()
  }, [])

  return (
    <section className="py-16 md:py-24 bg-[#F5EFE8] text-[#30251F] font-sans px-4 md:px-8">
      <div className="max-w-[1320px] mx-auto space-y-12">
        
        {/* Section Heading */}
        <SectionHeading
          eyebrow="SEASONAL DROPS"
          title="NEW ARRIVALS"
          description="Fresh pieces for the season. Limited stock available."
          align="center"
          useSerif={true}
        />

        {/* 4-Column Product Grid Reusing Phase 4 ProductCard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((item) => (
            <ProductCard key={item._id || item.id} product={item} />
          ))}
        </div>

      </div>
    </section>
  )
}

export default NewArrivals
