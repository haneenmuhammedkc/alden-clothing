// Static mock data for Alden Clothing Visual Design Prototype matching DESIGN.md (Timeless Editorial Luxury)

export const TOKENS = {
  colors: {
    primaryBg: "#F5EFE8",    // Primary Cream Canvas
    surface: "#FBF9F6",      // Secondary Cream Surface
    warmBeige: "#D8C4B4",    // Warm Beige Editorial Surfaces
    taupe: "#B7A08D",        // Taupe Accents & Borders
    primary: "#8B634B",      // Cocoa Brown Interactive Accent
    textPrimary: "#30251F",  // Deep Espresso Primary Headings & Text
    textMuted: "#76675D",    // Muted Brown Metadata & Secondary Text
    border: "#DED4CB"        // Structural Dividers
  },
  fonts: {
    ui: "Montserrat, sans-serif",
    serif: "'Cormorant Garamond', serif"
  }
};

export const MOCK_HERO_SLIDES = [
  {
    id: "slide-1",
    subtitle: "NEW SEASON",
    headlineLine1: "TIMELESS PIECES FOR",
    headlineLine2: "MODERN LIVING",
    description: "Discover refined everyday essentials designed with understated elegance and architectural proportion.",
    ctaText: "SHOP COLLECTION",
    ctaLink: "listing",
    imageMain: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=80",
    imageSecondary: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
  }
];

export const MOCK_CATEGORIES_8 = [
  {
    id: "cat-1",
    name: "JACKETS",
    description: "Structured wool & utility coats",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-2",
    name: "T-SHIRTS",
    description: "280 GSM organic combed cotton",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-3",
    name: "HOODIES",
    description: "Heavyweight French terry knits",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-4",
    name: "SHIRTS",
    description: "Unlined linen & poplin tailoring",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-5",
    name: "ACCESSORIES",
    description: "Woven totes & handcrafted leather",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-6",
    name: "PANTS",
    description: "Pleated tapered minimalist trousers",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-7",
    name: "BAGGY",
    description: "Relaxed drop-crotch cargo pants",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-8",
    name: "JEANS",
    description: "13.5 oz Raw Japanese denim",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80"
  }
];

export const MOCK_PROMO_CAMPAIGN = {
  subtitle: "AUTUMN EDITORIAL",
  title: "THE ART OF EVERYDAY DRESS",
  description: "Explore unstructured tailoring and warm merino knits designed for effortless transitional layering.",
  ctaText: "EXPLORE COLLECTION",
  image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=80"
};

export const MOCK_NEW_ARRIVALS = [
  {
    id: "arr-1",
    productId: "ALD-001",
    name: "Essential Polo",
    fit: "Classic Fit • 100% Pima Cotton",
    category: "Shirts",
    price: 3499,
    priceFormatted: "₹3,499",
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "arr-2",
    productId: "ALD-002",
    name: "Oversized Hoodie",
    fit: "Comfort Fit • Heavyweight 450 GSM",
    category: "Hoodies",
    price: 5999,
    priceFormatted: "₹5,999",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "arr-3",
    productId: "ALD-003",
    name: "Straight Denim",
    fit: "Regular Fit • 13.5 oz Japanese Denim",
    category: "Jeans",
    price: 7499,
    priceFormatted: "₹7,499",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "arr-4",
    productId: "ALD-004",
    name: "Linen Utility Jacket",
    fit: "Relaxed Fit • Unlined Linen",
    category: "Jackets",
    price: 8999,
    priceFormatted: "₹8,999",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"
  }
];

export const MOCK_USER_PROFILE = {
  name: "Alex Alden",
  email: "alex.alden@fashion.com",
  phone: "+91 98765 43210",
  tier: "VVIP Patron",
  walletBalance: 8500.00,
  addresses: [
    {
      id: "addr-1",
      isDefault: true,
      title: "Primary Residence",
      fullName: "Alex Alden",
      street: "742 Evergreen Terrace, Suite 400",
      city: "Mumbai",
      state: "MH",
      zip: "400001",
      country: "India",
      phone: "+91 98765 43210"
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
        name: "Linen Utility Jacket",
        size: "L",
        color: "Warm Beige",
        qty: 1,
        price: 8999,
        priceFormatted: "₹8,999",
        image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80"
      }
    ],
    subtotal: 8999,
    total: 8999,
    totalFormatted: "₹8,999",
    paymentMethod: "Razorpay Online (UPI)",
    shippingAddress: {
      fullName: "Alex Alden",
      street: "742 Evergreen Terrace, Suite 400",
      city: "Mumbai",
      state: "MH",
      zip: "400001"
    }
  },
  {
    id: "ORD-2026-7450",
    date: "14 Aug 2026",
    status: "Processing",
    statusType: "processing",
    items: [
      {
        name: "Essential Polo",
        size: "M",
        color: "Soft Sage",
        qty: 1,
        price: 3499,
        priceFormatted: "₹3,499",
        image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=300&q=80"
      }
    ],
    subtotal: 3499,
    total: 3499,
    totalFormatted: "₹3,499",
    paymentMethod: "Alden Wallet Balance",
    shippingAddress: {
      fullName: "Alex Alden",
      street: "742 Evergreen Terrace, Suite 400",
      city: "Mumbai",
      state: "MH",
      zip: "400001"
    }
  }
];

export const MOCK_ADMIN_STATS = {
  kpis: [
    { title: "Total Revenue", value: "₹12,48,500", change: "+14.2%", subtitle: "vs previous 30 days" },
    { title: "Total Orders", value: "1,420", change: "+8.6%", subtitle: "vs previous 30 days" },
    { title: "Active Catalog", value: "184 Items", change: "+12", subtitle: "Live in store" },
    { title: "Registered Customers", value: "3,890", change: "+22.4%", subtitle: "Active profiles" }
  ],
  recentOrders: [
    { id: "ORD-9981", customer: "Sophia Martinez", date: "Today, 14:20", total: "₹12,499", status: "Delivered", statusType: "delivered" },
    { id: "ORD-9980", customer: "Liam Vance", date: "Today, 12:05", total: "₹5,999", status: "Processing", statusType: "processing" },
    { id: "ORD-9979", customer: "Elena Rostova", date: "Yesterday, 19:40", total: "₹7,499", status: "Shipped", statusType: "delivered" }
  ]
};
