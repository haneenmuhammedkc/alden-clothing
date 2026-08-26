Master Documentation & Implementation Plan (plan.md)
Project Name: Alden Clothing — Premium Fashion E-Commerce Platform
Target Codebase: alden-clothing Monorepo (/frontend & /backend)
Phase: Discovery, System Audit & Future Redesign Roadmap
Document Status: Master Architecture & Technical Specification

1. REPOSITORY AUDIT & ARCHITECTURE SUMMARY
Repository Structure
The repository is structured as a MERN stack monorepo containing a React Single Page Application (SPA) frontend and a Node.js Express API server backend.


alden-clothing/
├── backend/
│   ├── config/             → Database, Environment & Firebase Admin configs
│   ├── controllers/        → Admin & User business logic controllers
│   ├── middleware/         → JWT Role-based Auth Middleware
│   ├── models/             → Mongoose schemas (User, Product, Order, Wallet, etc.)
│   ├── routes/             → Express API route definitions
│   ├── utils/              → Email utility (Resend integration)
│   ├── server.js           → Express application entry point
│   └── package.json        → Backend dependencies and npm scripts
│
└── frontend/
    ├── src/
    │   ├── admin-pages/    → Admin Dashboard & management views
    │   ├── assets/         → Images, icons, static assets
    │   ├── component/      → Reusable UI components (Navbar, Footer, Invoice, etc.)
    │   ├── config/         → Client API URL configuration
    │   ├── context/        → React Context state (CartContext, WishlistContext)
    │   ├── pages/          → Customer-facing page views (Home, Checkout, ProductDetails, etc.)
    │   ├── routes/         → Protected route wrappers (UserProtectedRoute, AdminProtectedRoute)
    │   ├── utils/          → Axios instance & SweetAlert2 helpers
    │   ├── firebase.js     → Firebase Client SDK configuration
    │   └── App.jsx         → Application routing & top-level layout
    ├── index.html          → Single page entry template
    └── package.json        → Frontend dependencies and Vite build scripts
2. PROJECT OVERVIEW
Project Name: Alden Clothing
Purpose: A high-end luxury clothing e-commerce web application with a complete customer shopping portal and an administrative management dashboard.
Target Users:
Customers: Browse fashion catalog, filter by category/price/size, manage wishlist & cart, execute checkout via Razorpay or digital Wallet, track order delivery, and submit product feedback.
Administrators: Manage inventory catalog, monitor real-time sales metrics, view customer profiles, manage promo codes, process customer orders, and moderate reviews.
Main Problem Solved: Provides an end-to-end fashion retail experience combining digital payments, instant wallet credits, promo engines, and administrative order processing.
Technology Stack Matrix
Layer	Technology / Package	Implementation Status	Purpose
Frontend Core	React 19.2, Vite 7.2	🟢 IMPLEMENTED	Client UI Framework & Build Tool
Routing	React Router DOM 7.9	🟢 IMPLEMENTED	SPA Route Navigation
State Management	React Context API	🟢 IMPLEMENTED	Cart, Wishlist & Promo state
Animations / Icons	Framer Motion 12, Lucide React, React Icons	🟢 IMPLEMENTED	UI Animations and iconography
Styling	Tailwind CSS 4.1	🟢 IMPLEMENTED	Utility-first CSS styling
HTTP Client	Axios 1.13	🟢 IMPLEMENTED	REST API Communications
Backend Runtime	Node.js (ES Modules type: "module")	🟢 IMPLEMENTED	Server Runtime
Server Framework	Express.js 5.1	🟢 IMPLEMENTED	Web Application Framework
Database	MongoDB Atlas / Mongoose 8.19	🟢 IMPLEMENTED	Object Data Modeling & Persistence
Authentication	JWT (jsonwebtoken 9.0) + BcryptJS 3.0	🟢 IMPLEMENTED	Session Tokens & Password Hashing
OAuth Auth	Firebase Auth Client SDK 12.8 & Admin SDK 13.6	🟢 IMPLEMENTED	Google Social Login Verification
Payments	Razorpay Node SDK 2.9 & Client Checkout Modal	🟢 IMPLEMENTED	Payment Gateway Processing
Email Utility	Resend SDK 6.12	🟢 IMPLEMENTED	Transactional OTP Email Delivery
Image Storage	Cloudinary SDK 2.8	🟢 IMPLEMENTED	Product & Profile Image Uploads
AI Features	None / Unimplemented	⚪ NOT IMPLEMENTED	Planned AI styling/recommendations
3. CURRENT APPLICATION USER FLOW
Customer Journey Flow
Mermaid diagram
Administrative Flow
Mermaid diagram
4. ROUTE MAP
Frontend Routes (frontend/src/App.jsx)
Route	Page / Component	Protected?	Purpose	Status
/login	User_Login.jsx	Public	User Login / Registration / OTP modal	🟢 Active
/forgot-password	ForgotPassword.jsx	Public	Password reset OTP request	🟢 Active
/reset-password	ResetPassword.jsx	Public	New password submission	🟢 Active
/	Home.jsx	Public	Homepage hero & collections	🟢 Active
/ourpolicy	OurPolicy.jsx	Public	Store policies and guarantees	🟢 Active
/men	ProductList.jsx	Public	Men's category catalog	🟢 Active
/women	ProductList.jsx	Public	Women's category catalog	🟢 Active
/kids	ProductList.jsx	Public	Kids' category catalog	🟢 Active
/product/:slug/:id	ProductDetails.jsx	Public	Single product details & reviews	🟢 Active
/myorder	MyOrders.jsx	User	Customer order history	🟢 Active
/orders/:id	OrderDetails.jsx	User	Single order status & PDF invoice	🟢 Active
/wallet	Wallet.jsx	User	Digital wallet balance & top-up	🟢 Active
/wishlist	Wishlist.jsx	User	Saved products list	🟢 Active
/transactions	TransactionHistory.jsx	User	Transaction ledger history	🟢 Active
/order-success	OrderSuccess.jsx	User	Order confirmation view	🟢 Active
/order-processing	OrderProcessing.jsx	User	Payment processing loader view	🟢 Active
/cart	CartPage.jsx	User	Shopping cart & promo engine	🟢 Active
/profile	Profile.jsx	User	Customer profile & addresses	🟢 Active
/checkout	Checkout.jsx	User	Order checkout & payment selection	🟢 Active
/a-login	Admin_Login.jsx	Public	Admin portal login	🟢 Active
/a-dash	Admin_Dashboard.jsx	Admin	Administrative overview dashboard	🟢 Active
/a-orders	Admin_orders.jsx	Admin	Admin order status management	🟢 Active
/a-customers	Admin_Customers.jsx	Admin	Customer directory & block/unblock	🟢 Active
/a-products	Admin_Products.jsx	Admin	Product CRUD & soft delete	🟢 Active
/a-category	Admin_Category.jsx	Admin	Category creation & editing	🟢 Active
/a-reports	Admin_Reports.jsx	Admin	Feedback moderation & reviews	🟢 Active
/a-promos	Admin_Promos.jsx	Admin	Promo code management	🟢 Active
/a-sales	Admin_Sales.jsx	Admin	Sales analytics & date reporting	🟢 Active
Backend API Routes (backend/server.js)
Method	Endpoint	Router / Controller	Auth Required	Purpose	Status
POST	/api/admin/auth/a-login	adminAuthController.adminLogin	Public	Admin portal authentication	🟢 Active
GET	/api/admin/auth/dashboard-stats	adminAuthController.getDashboardStats	Admin	Dashboard summary counts	🟢 Active
GET	/api/admin/auth/recent-orders	adminAuthController.getRecentOrders	Admin	Recent 10 orders	🟢 Active
POST	/api/admin/products/add	adminProductController.addProduct	Admin*	Add new product	⚠️ Unscoped
GET	/api/admin/products/	adminProductController.getActiveProducts	Admin*	List active products	⚠️ Unscoped
GET	/api/admin/products/deleted	adminProductController.getDeletedProducts	Admin*	List soft-deleted products	⚠️ Unscoped
PUT	/api/admin/products/soft-delete/:id	adminProductController.softDeleteProduct	Admin*	Soft delete product	⚠️ Unscoped
PUT	/api/admin/products/update/:id	adminProductController.updateProduct	Admin*	Update product details	⚠️ Unscoped
PUT	/api/admin/products/restore/:id	adminProductController.restoreProduct	Admin*	Restore soft-deleted product	⚠️ Unscoped
POST	/api/users/register	userAuthController.registerUser	Public	Customer registration & OTP	🟢 Active
POST	/api/users/verify-otp	userAuthController.verifyEmailOtp	Public	Email OTP verification	🟢 Active
POST	/api/users/login	userAuthController.loginUser	Public	Customer password login	🟢 Active
POST	/api/users/google-login	userAuthController.googleUserLogin	Public	Firebase Google login	⚠️ Missing Role
GET	/api/users/me	userController.getMyProfile	User	Fetch logged-in user profile	🟢 Active
PUT	/api/users/me	userController.updateProfile	User	Update user profile details	🟢 Active
PUT	/api/users/change-password	userController.changePassword	User	Update account password	🟢 Active
POST	/api/users/address	userController.addAddress	User	Add customer address	🟢 Active
GET	/api/users/address	userController.getAddresses	User	List customer addresses	🟢 Active
PUT	/api/users/address/:id/default	userController.setDefaultAddress	User	Set default address	🟢 Active
DELETE	/api/users/address/:id	userController.deleteAddress	User	Delete address	🟢 Active
PUT	/api/users/address/:id	userController.updateAddress	User	Edit address details	🟢 Active
POST	/api/users/forgot-password	userController.forgotPassword	Public	Request password reset OTP	🟢 Active
POST	/api/users/reset-password	userController.resetPassword	Public	Verify OTP & set password	🟢 Active
GET	/api/products	productController.getProducts	Public	Fetch product list with filters	🟢 Active
GET	/api/products/:id	productController.getSingleProduct	Public	Fetch product by ID	🟢 Active
POST	/api/orders	orderController.createOrder	User	Place new order	🟢 Active
GET	/api/orders	orderController.getAllOrders	Admin	List all store orders	🟢 Active
GET	/api/orders/sales-report	orderController.getSalesReport	Admin	Generate sales report	🟢 Active
PUT	/api/orders/:id/status	orderController.updateOrderStatus	Admin	Update order status	🟢 Active
GET	/api/orders/my	orderController.getMyOrders	User	List user's orders	🟢 Active
GET	/api/orders/:id	orderController.getOrderById	User/Admin	View single order	⚠️ IDOR Risk
PUT	/api/orders/:id/cancel	orderController.cancelOrder	User	Cancel order	⚠️ No Refund
POST	/api/payment/razorpay/create-order	paymentController.createRazorpayOrder	User	Create Razorpay order	🟢 Active
POST	/api/payment/razorpay/verify	paymentController.verifyRazorpayPayment	User	Verify Razorpay HMAC	🟢 Active
GET	/api/wallet	walletController.getWallet	User	Fetch wallet & ledger	🟢 Active
POST	/api/wallet/credit	walletController.creditWallet	User	Top up wallet balance	⚠️ Unverified
POST	/api/wallet/debit	walletController.debitWallet	User	Deduct wallet balance	🟢 Active
GET	/api/transactions/my	transactionController.getMyTransactions	User	View transaction history	🟢 Active
POST	/api/feedback/add	feedbackUserController.addFeedback	User	Submit product review	⚠️ Schema Bug
GET	/api/feedback/product/:id	feedbackUserController.getProductReviews	Public	View product reviews	⚠️ Schema Bug
5. MODULE / FEATURE INVENTORY
1. Product Catalog & Management Module
Purpose: Manages clothing products, inventory stock, categories, sizes, colors, pricing, and soft deletion.
Location: frontend/src/pages/ProductList.jsx, frontend/src/pages/ProductDetails.jsx, backend/controllers/productController.js, backend/controllers/adminProductController.js.
Database Model: Product (backend/models/Product.js), Category (backend/models/Category.js).
Implemented: Filtering by category/price, sorting by price/name, soft-delete, restoration, slug generation.
Known Issues: getActiveProducts does not filter out isDeleted: true items for admin views. Public store has no unauthenticated endpoint to fetch categories.
2. Shopping Cart & Wishlist Module
Purpose: Manages client and persistent server cart items, promo applications, and wishlist items.
Location: frontend/src/context/CartContext.jsx, frontend/src/context/WishlistContext.jsx, backend/routes/cartRoutes.js, backend/routes/wishlistRoutes.js.
Database Model: Cart (backend/models/Cart.js), Wishlist (backend/models/Wishlist.js).
Implemented: Backend cart/wishlist sync on user login, size selection modal.
Known Issues: Cart context auto-wipes promo codes whenever item quantities change. Wishlist.jsx calls addToCart(item) with a single argument, resulting in size: undefined.
3. Digital Wallet & Payment Module
Purpose: Provides digital wallet balance, ledger transactions, and Razorpay payment gateway integration.
Location: frontend/src/pages/Wallet.jsx, frontend/src/pages/Checkout.jsx, backend/controllers/walletController.js, backend/controllers/paymentController.js.
Database Model: Wallet (backend/models/Wallet.js), Transaction (backend/models/Transaction.js).
Implemented: Razorpay order creation and signature verification for direct checkouts.
Known Issues: CRITICAL: POST /api/wallet/credit credits wallet funds without verifying Razorpay signatures or payment receipts.
4. Order Management & Invoicing Module
Purpose: Processes orders, snapshot customer addresses and items, status transitions, and PDF invoice generation.
Location: frontend/src/pages/Checkout.jsx, frontend/src/pages/MyOrders.jsx, frontend/src/pages/OrderDetails.jsx, backend/controllers/orderController.js.
Database Model: Order (backend/models/Order.js).
Implemented: Multi-step status transitions, address snapshotting, client-side PDF export via html2canvas + jsPDF.
Known Issues: getOrderById endpoint lacks user ownership verification (IDOR). Order cancellation does not refund wallet payments.
6. AUTHENTICATION AND AUTHORIZATION ARCHITECTURE
User Authentication Flow
Mermaid diagram
Authentication Inconsistencies & Flaws
Google Auth JWT Payload Flaw: Google login issues JWTs without role: "user", causing 403 Forbidden errors on user-protected routes.
Hardcoded Admin Credentials: Admin authentication bypasses the Admin database schema and checks hardcoded string literals (admin@gmail.com / admin12).
Un-scoped Admin Routes: adminProductRoutes.js calls authMiddleware() with empty allowedRoles, permitting regular users to access admin product endpoints.
Blocked User Bypass: Neither loginUser nor authMiddleware checks if user.status === "Blocked".
7. DATABASE ARCHITECTURE & SCHEMAS
Mermaid diagram
Schema Inventory
User (User.js): name, email (unique), phone, authProvider, password, status (Active/Blocked), isVerified, addresses subdocument array.
Product (Product.js): name, slug, productId, category (Ref Category), collectionName, color, sizes array, price, stockQty, stockStatus, isDeleted.
Order (Order.js): user (Ref User), customer snapshot, items array (productId, name, price, quantity), subtotal, tax, shipping, total, paymentMethod, paymentStatus, orderStatus.
Wallet (Wallet.js): user (Ref User, unique), balance, transactions embedded array (type, amount, label, reference, createdAt).
Transaction (Transaction.js): user (Ref User), type, method, amount, balanceAfter, orderId (Ref Order), description, status.
Wishlist (Wishlist.js): user (Ref User), items ([Object]).
8. API ARCHITECTURE & INTEGRATION CONTRACTS
Axios Client Setup (frontend/src/utils/axiosInstance.js)
Base URL: import.meta.env.VITE_API_URL
Request Interceptors: None configured globally (headers pass Authorization: Bearer ${token} manually in components).
Key Contract Mismatches
Endpoint	Expected Frontend Payload	Backend Processing	Return Structure	Contract Status
GET /api/feedback/product/:id	Expects rev.user.firstName	Populates .populate("user", "firstName")	firstName is undefined on User schema	🔴 BROKEN
POST /api/feedback/add	Sends { productId, rating, message }	Queries "items.product" in Order	Field in Order is "items.productId"	🔴 BROKEN
POST /api/wallet/credit	Sends { amount, paymentId }	Credits balance without verification	{ success: true, balance }	🔴 UNSECURE
POST /api/users/google-login	Sends { token }	Verifies Firebase ID Token	Issues JWT without role: "user" claim	🔴 BROKEN
9. FRONTEND ARCHITECTURE
Framework: React 19.2 using Vite build tooling.
Routing: Declarative routes in App.jsx using react-router-dom v7.
State Management:
CartContext.jsx: Provides cartItems, addToCart, removeFromCart, updateQty, promo, applyPromo.
WishlistContext.jsx: Provides wishlistItems, addToWishlist, removeFromWishlist.
UI & Styling: Tailwind CSS v4, Framer Motion animations, Lucide React & React Icons.
Alerts: Custom SweetAlert2 wrappers in frontend/src/utils/alerts.js.
10. BACKEND ARCHITECTURE
Framework: Express.js 5.1.0 on Node.js (ES Modules type: "module").
Request Lifecycle:

HTTP Request 
   │
   ▼
express.json() Middleware 
   │
   ▼
CORS Middleware (Origin validation)
   │
   ▼
authMiddleware(allowedRoles) [JWT Verification]
   │
   ▼
Route Handler / Controller
   │
   ▼
Mongoose Model Query / External API
   │
   ▼
HTTP Response (JSON)
11. EXTERNAL SERVICES & INTEGRATIONS
Firebase Authentication:
Client Config: 
frontend/src/firebase.js
 (API Key, AuthDomain, ProjectID).
Admin Config: 
backend/config/firebaseAdmin.js
 (Service Account Cert via env vars).
Cloudinary Asset Storage:
Unsigned Upload Preset: products_images used in 
Profile.jsx
.
Razorpay Payment Gateway:
Backend SDK: razorpay npm package used in paymentController.js.
Client SDK: window.Razorpay script used in Checkout.jsx.
Resend Email Service:
Backend SDK: resend npm package in 
sendEmail.js
 sending via onboarding@resend.dev.
12. EMAIL SYSTEM
Provider: Resend (process.env.RESEND_API_KEY).
Utility: 
backend/utils/sendEmail.js
.
Triggers:
Registration Email Verification OTP (
userAuthController.js:L45
).
Password Reset OTP (
userController.js:L227
).
Constraint: Default sender onboarding@resend.dev restricts email delivery to verified account holder during testing.
13. AI FEATURES
Status: ⚪ NOT IMPLEMENTED / UNKNOWN. No AI models, Gemini APIs, or recommendation services are present in the current codebase.
14. FILE UPLOADS AND STORAGE
Accepted Types: Image files (.jpg, .png, .webp).
Frontend Storage: Direct unsigned uploads to Cloudinary endpoint (api.cloudinary.com/v1_1/:cloud_name/image/upload).
Backend Storage: Static uploads directory mounted at /uploads via express.static("uploads").
15. CURRENT UI / UX AUDIT
Aesthetic & Design Evaluation
Visual Theme: High-contrast luxury fashion aesthetic, monochrome palette #000000 / #FFFFFF, sleek typography.
Micro-Interactions: Smooth Framer Motion layout transitions and page entry animations.
UX Observations / Friction Points:
Wishlist heart icon on ProductDetails.jsx silently fails if no size is selected (no alert or feedback).
Promo codes auto-wipe when altering item quantities in Cart view.
Size selection modal in Wishlist uses minimal styling.
16. RESPONSIVE BEHAVIOR
Desktop (1920x1080): Multi-column grid layouts, fixed left admin sidebar, sticky order summary cards.
Tablet (768x1024): Sidebar collapses to mobile toggle drawer; product catalog grid adjusts to 2 columns.
Mobile (390x844): Responsive stacked views, but modals lack touch scroll boundaries, causing background page scrolling.
17. DESIGN SYSTEM INVENTORY
Color Palette:
Background Dark: #000000, #050505, #0b0b0b
Background Light: #ffffff, #f9fafb
Accent / Borders: #18181b (Zinc-900), rgba(255,255,255,0.1)
Typography:
Primary Font: Montserrat (public/fonts/montserrat)
Accent Font: Monospace uppercase tracking labels (tracking-[0.4em])
UI Components: Dark mode glassmorphic cards, pill buttons, border-b text inputs.
18. CURRENT IMPLEMENTATION STATUS
Feature Module	Frontend	Backend	Integration	Status
User Register & OTP	Complete	Complete	Complete	🟡 PARTIAL
User Password Login	Complete	Complete	Complete	🟡 PARTIAL
Google Social Login	Complete	Complete	Broken	🔴 BROKEN
Admin Authentication	Complete	Hardcoded	Complete	🔴 BROKEN
Product Browsing	Complete	Complete	Complete	🟢 COMPLETE
Cart & Promo Engine	Complete	Complete	Complete	🟡 PARTIAL
Wishlist Management	Complete	Complete	Complete	🟡 PARTIAL
Razorpay Checkout	Complete	Complete	Complete	🟢 COMPLETE
Wallet Top-Up	Complete	Unsafe	Complete	⚠️ UNSECURE
Order Cancellation	Complete	Complete	Broken	🔴 BROKEN
Product Reviews	Complete	Complete	Broken	🔴 BROKEN
Admin Sales Analytics	Complete	Complete	Complete	🟡 PARTIAL
19. KNOWN ISSUES
Free Money Wallet Credit Exploit: 
walletController.js:L37
 credits balance without Razorpay signature verification.
Un-scoped Admin Product Routes: 
adminProductRoutes.js:L7
 accepts regular user tokens.
Hardcoded Admin Credentials: 
adminAuthController.js:L6
 checks plaintext strings; Admin model is unused.
Order IDOR Vulnerability: 
orderController.js:L190
 exposes order details across users.
Google OAuth Token Role Missing: 
userAuthController.js:L180
 issues JWTs missing role: "user".
Server Crash on Missing Env Var: 
firebaseAdmin.js:L7
 executes .replace() on undefined env var.
20. TECHNICAL DEBT
Duplicate Controllers: adminPromoController.js and promoController.js contain identical promo logic.
Un-typed Schemas: Wishlist.js uses items: [Object].
Large Bundle Size: Frontend Vite build generates a single 1.38MB JS chunk and includes a 5.01MB image asset (Razorpay.png).
Hardcoded Secret Keys: Firebase client credentials hardcoded in frontend/src/firebase.js.
21. FUTURE UI REDESIGN FOUNDATION
Future Design Direction
Style: MINIMALISTIC, PROFESSIONAL, PREMIUM, SPACIOUS, WHITE-FIRST, MODERN SAAS.
Key Principles:
Ample whitespace and generous padding (p-8, p-12).
Strong typography hierarchy (Montserrat + crisp sans-serif).
Subtly refined borders (border-neutral-200), minimal drop shadows.
Primary Color: #00412E (Forest Green)
Secondary Color: #96BF8A (Sage Green)
Surface Background: #E8EAE5
Base Background: #FFFFFF
22. FUTURE REDESIGN STRATEGY
Phase 1 — Design Tokens & Tokens Definition
Phase 2 — Global App Shell & Layout Structure
Phase 3 — Shared UI Component Library (Buttons, Modals, Inputs)
Phase 4 — Navigation Bar & Footer Redesign
Phase 5 — Customer Storefront Pages (Home, Product Catalog, Details)
Phase 6 — Shopping Cart, Wishlist & Checkout Redesign
Phase 7 — Account Dashboard, Orders & Wallet Redesign
Phase 8 — Administrative Portal & Analytics Redesign
Phase 9 — Responsive Refinement & Accessibility Polishing
23. SAFE CHANGE STRATEGY
To protect existing application stability during future UI redesign work:

Preserve all existing API contracts and JSON response structures.
Maintain route paths in App.jsx.
Retain database models and validation rules.
Keep core authentication and Razorpay verification functions intact.
Focus changes strictly on UI component presentation layers.
24. FILE-BY-FILE MAP
Frontend Directory Structure (frontend/src/)

frontend/src/
├── admin-pages/
│   ├── Admin_Category.jsx
│   ├── Admin_Customers.jsx
│   ├── Admin_Dashboard.jsx
│   ├── Admin_Login.jsx
│   ├── Admin_orders.jsx
│   ├── Admin_Products.jsx
│   ├── Admin_Promos.jsx
│   ├── Admin_Reports.jsx
│   └── Admin_Sales.jsx
├── component/
│   ├── AddressSection.jsx
│   ├── Admin_Sidebar.jsx
│   ├── Exclusive.jsx
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── Invoice.jsx
│   ├── Jackets.jsx
│   ├── Navbar.jsx
│   ├── OurPolicy.jsx
│   └── ProductCard.jsx
├── config/
│   └── api.js
├── context/
│   ├── CartContext.jsx
│   └── WishlistContext.jsx
├── pages/
│   ├── CartPage.jsx
│   ├── Checkout.jsx
│   ├── ForgotPassword.jsx
│   ├── Home.jsx
│   ├── MyOrders.jsx
│   ├── OrderDetails.jsx
│   ├── OrderProcessing.jsx
│   ├── OrderSuccess.jsx
│   ├── ProductDetails.jsx
│   ├── ProductList.jsx
│   ├── Profile.jsx
│   ├── ResetPassword.jsx
│   ├── TransactionHistory.jsx
│   ├── User_Login.jsx
│   ├── Wallet.jsx
│   └── Wishlist.jsx
├── utils/
│   ├── alerts.js
│   └── axiosInstance.js
├── App.jsx
├── firebase.js
└── main.jsx
Backend Directory Structure (backend/)

backend/
├── config/
│   ├── database.js
│   ├── env.js
│   └── firebaseAdmin.js
├── controllers/
│   ├── adminAuthController.js
│   ├── adminCustomerController.js
│   ├── adminFeedbackController.js
│   ├── adminProductController.js
│   ├── adminPromoController.js
│   ├── categoryController.js
│   ├── feedbackUserController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── productController.js
│   ├── promoController.js
│   ├── transactionController.js
│   ├── userAuthController.js
│   ├── userController.js
│   └── walletController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Admin.js
│   ├── Cart.js
│   ├── Category.js
│   ├── Feedback.js
│   ├── Order.js
│   ├── Product.js
│   ├── PromoCode.js
│   ├── Transaction.js
│   ├── User.js
│   ├── Wallet.js
│   └── Wishlist.js
├── routes/
│   ├── adminAuthRoutes.js
│   ├── adminCustomerRoutes.js
│   ├── adminFeedbackRoutes.js
│   ├── adminProductRoutes.js
│   ├── adminPromoRoutes.js
│   ├── cartRoutes.js
│   ├── categoryRoutes.js
│   ├── feedbackUserRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   ├── productRoutes.js
│   ├── promoRoutes.js
│   ├── transactionRoutes.js
│   ├── userAuthRoutes.js
│   ├── userRoutes.js
│   └── walletRoutes.js
├── utils/
│   └── sendEmail.js
└── server.js
25. DEPENDENCY INVENTORY
Frontend Dependencies (frontend/package.json)
Core: react ^19.2.0, react-dom ^19.2.0, react-router-dom ^7.9.6
Build: vite ^7.2.2, @vitejs/plugin-react ^5.1.0
Styling: tailwindcss ^4.1.18, @tailwindcss/vite ^4.1.17, framer-motion ^12.34.0
HTTP & Services: axios ^1.13.2, firebase ^12.8.0
Utilities: sweetalert2 ^11.26.17, react-icons ^5.5.0, lucide-react ^0.562.0, jspdf ^4.0.0, html2canvas ^1.4.1
Backend Dependencies (backend/package.json)
Framework: express ^5.1.0, cors ^2.8.5, dotenv ^17.2.3
Database & Auth: mongoose ^8.19.4, jsonwebtoken ^9.0.3, bcryptjs ^3.0.3
Integrations: razorpay ^2.9.6, firebase-admin ^13.6.0, cloudinary ^2.8.0, resend ^6.12.4, multer ^2.0.2
26. ENVIRONMENT VARIABLES SPECIFICATION
Backend Environment Variables (backend/.env)
MONGO_URL: MongoDB Atlas connection URI string.
PORT: Server HTTP port number (e.g. 4001).
JWT_SECRET: Secret key used for signing JWT tokens.
CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET: Cloudinary API configuration.
EMAIL_USER, EMAIL_PASS: SMTP email credentials (legacy/fallback).
RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET: Razorpay gateway API credentials.
FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_CLIENT_ID: Firebase Service Account credentials.
RESEND_API_KEY: Resend API key for transactional emails.
Frontend Environment Variables (frontend/.env)
VITE_CLOUDINARY_CLOUD_NAME: Cloudinary cloud account name.
VITE_CLOUDINARY_PRESET: Unsigned upload preset name.
VITE_API_URL: Backend API base URL (https://alden-backend-uige.onrender.com).
VITE_RAZORPAY_KEY_ID: Razorpay public Key ID.
27. DEPLOYMENT CONFIGURATION
Backend Hosting: Deployed on Render (https://alden-backend-uige.onrender.com).
Frontend Hosting: Deployed on Vercel (https://alden-clothing.vercel.app).
Database Hosting: MongoDB Atlas Cloud Cluster (cluster0.fgvvgsr.mongodb.net).
28. TESTING & VALIDATION
Current Automated Coverage: 0% (No Jest, Vitest, Cypress, or Playwright setup).
Manual Verification Status: API endpoints verified via Node.js script tests during runtime audit.
29. FUTURE WORK BACKLOG
P0 — Critical Security Fixes:
Secure /api/wallet/credit with Razorpay HMAC signature checks.
Scope adminProductRoutes.js middleware with authMiddleware(["admin"]).
Add IDOR checks in getOrderById.
Add role: "user" in Google Auth JWT generation.
P1 — High Priority Functional Fixes:
DB-backed Admin authentication (Admin model + bcrypt).
Wallet refunds for cancelled orders in cancelOrder.
Expose public GET /api/categories endpoint.
P2 — Medium Priority Improvements:
Fix Cart Context promo auto-wipe on quantity update.
Add <Route path="*" element={<NotFound />} /> wildcard route.
P3 — Code Cleanup & Optimization:
Remove duplicate promo controllers.
Add MongoDB schema indexes.
30. FINAL PROJECT ROADMAP

[ CURRENT AUDIT COMPLETE ]
           │
           ▼
[ PLAN REVIEW & APPROVAL ]
           │
           ▼
[ SECURITY & CRITICAL FIXES (P0) ]
           │
           ▼
[ DESIGN SYSTEM & TOKENS DEFINITION ]
           │
           ▼
[ UI/UX REDESIGN IMPLEMENTATION ]
           │
           ▼
[ RESPONSIVE & ACCESSIBILITY AUDIT ]
           │
           ▼
[ PRODUCTION DEPLOYMENT ]