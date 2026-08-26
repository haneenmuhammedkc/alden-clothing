// Static mock data for Alden Clothing Visual Design Prototype matching exact mockup reference

export const MOCK_MOCKUP_DATA = {
  palette: {
    heroCanvas: "#D3DCD0",
    heroCardBg: "#C6D2C3",
    darkForest: "#2C3D29",
    forestHover: "#3C5238",
    mutedText: "#586854",
    sectionCanvas: "#FAFBF8",
    promoBg: "#C3CEBE",
    cardBg: "#EAEFE7",
    newsletterBg: "#2C3D29",
    footerBg: "#CBD5C6"
  },
  categories: [
    {
      id: "cat-jackets",
      name: "JACKETS",
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat-tshirts",
      name: "T-SHIRTS",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat-hoodies",
      name: "HOODIES",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat-shirts",
      name: "SHIRTS",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat-accessories",
      name: "ACCESSORIES",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat-pants",
      name: "PANTS",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat-baggy",
      name: "BAGGY",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "cat-jeans",
      name: "JEANS",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80"
    }
  ],
  newArrivals: [
    {
      id: "arr-1",
      name: "Essential Polo",
      fit: "Classic Fit",
      price: "₹3,499",
      image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "arr-2",
      name: "Oversized Hoodie",
      fit: "Comfort Fit",
      price: "₹5,999",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "arr-3",
      name: "Straight Denim",
      fit: "Regular Fit",
      price: "₹7,499",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "arr-4",
      name: "Linen Utility Jacket",
      fit: "Relaxed Fit",
      price: "₹8,999",
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"
    }
  ]
};

export const PALETTE = {
  deepForest: "#2C3D29",
  forestGreen: "#3C5238",
  mutedForest: "#586854",
  sage: "#758F6B",
  softSage: "#A5B49A",
  paleSage: "#D1DAC8",
  warmWhite: "#FAFBF8",
  pureWhite: "#FFFFFF",
  softGray: "#E6E9E2",
  mutedText: "#586854",
  primaryText: "#2C3D29"
};

export const MOCK_HERO_SLIDES = [
  {
    id: "slide-1",
    subtitle: "NEW SEASON",
    titleLine1: "FLAT 70%",
    titleLine2: "SALE",
    description: "Limited drop. Maximum impact.",
    ctaText: "SHOP NOW",
    ctaLink: "listing",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=80"
  }
];

export const MOCK_PROMO_BANNER = {
  title: "FLAT 70% SALE",
  subtitle: "Limited drop. Maximum impact.",
  ctaText: "SHOP NOW",
  image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
};

export const MOCK_CATEGORIES_8 = MOCK_MOCKUP_DATA.categories;
export const MOCK_NEW_ARRIVALS_4 = MOCK_MOCKUP_DATA.newArrivals;

export const MOCK_PRODUCTS = [
  {
    id: "prod-1",
    productId: "ALD-001",
    name: "Essential Polo",
    slug: "essential-polo",
    category: "Men",
    collectionName: "Classic Fit",
    price: 180,
    originalPrice: 220,
    discountPercentage: 18,
    isNew: true,
    isSale: true,
    rating: 4.8,
    reviewsCount: 34,
    color: "Deep Forest",
    colorsAvailable: ["#2C3D29", "#586854", "#E6E9E2"],
    sizes: ["S", "M", "L", "XL"],
    stockStatus: "In Stock",
    stockQty: 42,
    images: [
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Classic fit polo crafted from premium pima cotton."
  }
];

export const MOCK_USER_PROFILE = {
  name: "Alex Alden",
  email: "alex.alden@fashion.com",
  phone: "+1 (555) 382-9011",
  memberSince: "January 2024",
  tier: "VVIP Patron",
  walletBalance: 240.00,
  addresses: [
    {
      id: "addr-1",
      isDefault: true,
      title: "Primary Residence",
      fullName: "Alex Alden",
      street: "742 Evergreen Terrace, Suite 400",
      city: "San Francisco",
      state: "CA",
      zip: "94107",
      country: "United States",
      phone: "+1 (555) 382-9011"
    }
  ]
};

export const MOCK_ORDERS = [
  {
    id: "ORD-2026-8912",
    date: "18 Aug 2026",
    status: "Delivered",
    statusType: "delivered",
    items: [
      {
        name: "Essential Polo",
        size: "L",
        color: "Deep Forest",
        qty: 1,
        price: 180,
        image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=300&q=80"
      }
    ],
    subtotal: 180,
    shipping: 0,
    tax: 9.00,
    total: 189.00,
    paymentMethod: "Razorpay Online (UPI)",
    shippingAddress: {
      fullName: "Alex Alden",
      street: "742 Evergreen Terrace, Suite 400",
      city: "San Francisco",
      state: "CA",
      zip: "94107",
      country: "United States"
    },
    timeline: [
      { title: "Order Placed", date: "18 Aug, 09:30 AM", completed: true },
      { title: "Delivered", date: "20 Aug, 11:20 AM", completed: true }
    ]
  }
];

export const MOCK_ADMIN_STATS = {
  kpis: [
    { title: "Total Sales", value: "$124,850.00", change: "+14.2%", trend: "up", subtitle: "vs previous 30 days" },
    { title: "Total Orders", value: "1,420", change: "+8.6%", trend: "up", subtitle: "vs previous 30 days" },
    { title: "Active Products", value: "184", change: "+12", trend: "up", subtitle: "Catalog items live" },
    { title: "Total Customers", value: "3,890", change: "+22.4%", trend: "up", subtitle: "Registered profiles" }
  ],
  recentOrders: [
    { id: "ORD-9981", customer: "Sophia Martinez", date: "Today, 14:20", itemsCount: 3, total: "$420.00", status: "Delivered", statusType: "delivered" }
  ],
  categoryBreakdown: [
    { category: "Women's Collection", percentage: 42, revenue: "$52,437.00" },
    { category: "Men's Tailoring", percentage: 38, revenue: "$47,443.00" }
  ]
};

export const DESIGN_TOKENS = {
  colors: [
    { name: "Deep Forest", hex: "#2C3D29", role: "Primary text, dark buttons, dark section background" },
    { name: "Hero Canvas", hex: "#D3DCD0", role: "Hero and header background canvas" },
    { name: "Card Bg", hex: "#EAEFE7", role: "Product card background surface" },
    { name: "Promo Bg", hex: "#C3CEBE", role: "Secondary promotional banner background" },
    { name: "Footer Bg", hex: "#CBD5C6", role: "Multi-column footer background" }
  ],
  radii: [
    { name: "radius-sm", value: "4px", usage: "Inputs, focus rings" },
    { name: "radius-md", value: "8px", usage: "Buttons, product cards" },
    { name: "radius-lg", value: "16px", usage: "Large promotional banner & newsletter containers" }
  ]
};
