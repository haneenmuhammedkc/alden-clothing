Alden Clothing — Master Phased Implementation Plan (IMPLEMENTATION_PLAN.md)
Target Application: Alden Clothing MERN Stack E-Commerce Platform
Document Type: Master Phased Technical Implementation & Execution Plan
Authoritative References: plan.md (System Architecture & Discovery Audit) & DESIGN_SYSTEM.md (UI/UX Specification)
Execution Mode: PLANNING PHASE ONLY (Zero application code modified during plan creation)

1. AUTHORITATIVE CONFLICT RESOLUTION & AUDIT ACKNOWLEDGEMENT
The architecture specifications in 
plan.md
 and 
DESIGN_SYSTEM.md
 have been cross-evaluated.

Document Conflict Analysis & Resolution Status
Subsystem / Topic	plan.md Finding	DESIGN_SYSTEM.md Spec	Conflict & Resolution Strategy
Primary Brand Color	Identifies #00412E as primary green accent.	Specifies #00412E for primary CTAs & active tabs, #FFFFFF for 90% surfaces.	🟢 ALIGNED. Green is restricted to interactive controls; page background is pure white.
Admin Route Middleware	Identifies adminProductRoutes.js uses authMiddleware() with empty allowedRoles.	Admin pages require strict admin visual language.	⚠️ WORKSTREAM ISOLATION. UI workstream (Workstream A) updates UI layout only; security fix is isolated to Workstream C.
Category API Endpoint	Identifies public store lacks /api/categories endpoint.	Spec requires category navigation bar.	⚠️ WORKSTREAM ISOLATION. Frontend navbar uses static fallback/prop mapping until Workstream B exposes the public API.
Wishlist Add to Cart	Identifies Wishlist.jsx calls addToCart(item) with 1 parameter instead of 2.	Spec defines Wishlist card with inline size selector modal.	🟢 ALIGNED. Workstream B fixes the function call signature while Workstream A implements the modal.
2. PURPOSE OF THIS DOCUMENT
This IMPLEMENTATION_PLAN.md document translates the baseline architecture (plan.md), visual design specifications (DESIGN_SYSTEM.md), and discovered bugs/vulnerabilities into a phased, deterministic, risk-managed execution roadmap.

Future AI coding agents and frontend engineers MUST execute the implementation sequence strictly phase-by-phase, validating acceptance criteria and running automated/manual verification routines after every single phase before committing code or advancing.

3. THREE ISOLATED WORKSTREAMS
To eliminate regression risks and prevent security logic from accidentally mixing with visual refactoring, all execution is strictly separated into three independent workstreams:


┌────────────────────────────────────────────────────────────────────────┐
│                   WORKSTREAM A — UI/UX REDESIGN                        │
│ (Purely visual refactoring; zero API, schema, or security logic edits)  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────┼────────────────────────────────────┐
│                                   │                                    │
▼                                   ▼                                    ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│ WORKSTREAM A: UI REDESIGN│ │ WORKSTREAM B: BUG FIXES │ │ WORKSTREAM C: SECURITY  │
│ (Phases A0 to A18)      │ │ (Phases B1 to B4)       │ │ (Phases C1 to C5)       │
└─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘
WORKSTREAM A (UI/UX Redesign): Focuses exclusively on visual components, Tailwind CSS styling, layout structure, Framer Motion transitions, responsive adjustments, and accessibility. Must NOT alter API routes, backend controllers, database schemas, or payment verification logic.
WORKSTREAM B (Functional & Bug Fixes): Focuses on non-security functional defects (e.g. Wishlist function parameters, Cart Context promo auto-wipe, review author population queries).
WORKSTREAM C (Security Hardening): Focuses strictly on critical vulnerabilities (e.g. Wallet top-up HMAC signature verification, Admin middleware role protection, IDOR checks in order routes, Google OAuth JWT payload claims).
4. WORKSTREAM A — UI/UX REDESIGN PHASE SEQUENCE
Execution Dependencies Flow
Mermaid diagram
5. DETAILED PHASE SPECIFICATION FOR WORKSTREAM A
PHASE A0 — Baseline Setup, Safety & Verification Harness
Purpose: Establish a clean, verified git baseline and automated build/test verification runner before modifying any UI code.
Goal: Ensure npm run build compiles cleanly without errors and document all initial bundle metrics.
Dependencies: None (Prerequisite for all work).
Files to Inspect: frontend/package.json, frontend/vite.config.js, frontend/src/App.jsx.
Files Expected to Change: None (Baseline snapshot phase).
Files That MUST NOT Change: All backend files, database models, environment files.
Components Affected: None.
Routes Affected: None.
API Dependencies: Existing GET /api/products for verification.
Database Dependencies: Active MongoDB Atlas connection.
Design-System Requirements: Verify Montserrat font loading in index.html.
Functional Behavior That Must Remain Unchanged: All existing customer and admin routes.
Implementation Steps:
Execute npm run build inside frontend/ and log build output.
Verify backend startup on port 4001 via node server.js.
Perform sanity HTTP GET to http://localhost:4001/api/products.
Validation Steps: Confirm zero build failures, zero TypeScript/syntax errors.
Acceptance Criteria: Frontend builds in <40s, backend returns HTTP 200 OK.
Rollback Considerations: Git tag baseline-pre-redesign.
Risk Level: Low.
Estimated Complexity: Low.
PHASE A1 — Design Tokens & Tailwind Theme Configuration
Purpose: Configure Tailwind CSS v4 / theme tokens matching 
DESIGN_SYSTEM.md
.
Goal: Register brand colors (#00412E, #96BF8A, #E8EAE5, #FFFFFF), neutral slates, Montserrat font family, and radius tokens (4px, 6px, 8px).
Dependencies: Phase A0.
Files to Inspect: frontend/src/index.css, frontend/vite.config.js, frontend/package.json.
Files Expected to Change: frontend/src/index.css (or tailwind.config.js if present).
Files That MUST NOT Change: App.jsx, main.jsx, all component files.
Components Affected: Global styling layer.
Routes Affected: None.
API Dependencies: None.
Database Dependencies: None.
Design-System Requirements: Define @theme color mappings for brand-primary, brand-dark, brand-secondary, brand-surface, neutral-bg.
Functional Behavior That Must Remain Unchanged: App layout and functionality.
Implementation Steps:
Update frontend/src/index.css with CSS custom properties and Tailwind theme tokens.
Ensure Montserrat font is imported and assigned to font-sans.
Validation Steps: Run npm run build and inspect generated CSS variables.
Acceptance Criteria: Utility classes like bg-brand-primary (#00412E) and text-neutral-900 compile cleanly.
Rollback Considerations: Revert index.css edit.
Risk Level: Low.
Estimated Complexity: Low.
PHASE A3 — Foundation & Shared Customer Components
Purpose: Refactor reusable UI primitives (Buttons, Inputs, Modals, Cards, Badges) according to DESIGN_SYSTEM.md.
Goal: Create crisp, white-first foundation components with 4px/6px border radius, subtle borders, and accessible focus states.
Dependencies: Phase A1.
Files to Inspect: frontend/src/component/ProductCard.jsx, frontend/src/utils/alerts.js.
Files Expected to Change: frontend/src/component/ProductCard.jsx, frontend/src/utils/alerts.js, frontend/src/component/Button.jsx (New), frontend/src/component/Input.jsx (New), frontend/src/component/Modal.jsx (New).
Files That MUST NOT Change: Backend controllers, context logic in CartContext.jsx.
Components Affected: Shared buttons, form inputs, modal overlays, product cards.
Routes Affected: None directly (Affects all consumer pages).
API Dependencies: Product schema fields (name, price, images, category, stockStatus).
Database Dependencies: None.
Design-System Requirements:
Buttons: Primary (#00412E), Secondary (#F1F5F9), Outline (1px solid #0F172A).
Radius: rounded-md (6px).
Product Card: 3:4 portrait image ratio, scale 1.03 hover transition, clean left-aligned typography stack.
Functional Behavior That Must Remain Unchanged: Click handlers, navigation event propagation, prop interface definitions (addToCart, toggleWishlist).
Implementation Steps:
Create modular Button.jsx and Input.jsx primitive wrappers.
Refactor ProductCard.jsx to render 3:4 aspect ratio photography, overlay wishlist toggle button, and clean left-aligned pricing text stack.
Validation Steps: Verify product card rendering on Product Catalog and Homepage.
Acceptance Criteria: Product cards render without glowing drop shadows or pill buttons; image aspect ratio strictly 3:4.
Rollback Considerations: Restore previous ProductCard.jsx.
Risk Level: Medium.
Estimated Complexity: Medium.
PHASE A2 — Customer Application Shell (Navbar & Footer)
Purpose: Redesign top navigation bar, mobile menu drawer, and footer.
Goal: Deliver a crisp 72px sticky white navbar with a 1px subtle bottom border, minimalist brand typography, and structured 4-column footer.
Dependencies: Phase A3.
Files to Inspect: frontend/src/component/Navbar.jsx, frontend/src/component/Footer.jsx.
Files Expected to Change: frontend/src/component/Navbar.jsx, frontend/src/component/Footer.jsx.
Files That MUST NOT Change: CartContext.jsx, WishlistContext.jsx, route definitions in App.jsx.
Components Affected: Navbar.jsx, Footer.jsx.
Routes Affected: All customer routes.
API Dependencies: None.
Database Dependencies: None.
Design-System Requirements: Pure white background (#FFFFFF), Slate-200 bottom border (border-b border-slate-200), Montserrat logo with #00412E accent, 320px slide-over mobile drawer.
Functional Behavior That Must Remain Unchanged: Cart item badge counter, wishlist item badge counter, user profile dropdown toggle, logout action handler.
Implementation Steps:
Refactor Navbar.jsx to use a sticky h-[72px] flex container with left logo, center links, and right utility icons.
Implement right slide-over mobile drawer with clean vertical stack.
Refactor Footer.jsx to use 4-column dark slate (#0F172A) container with newsletter input and copyright sub-bar.
Validation Steps: Test responsive viewport switching between desktop (1280px), tablet (768px), and mobile (390px).
Acceptance Criteria: Navbar stays fixed at top with zero layout jitter; badge counters display accurate live Context counts.
Rollback Considerations: Restore original Navbar.jsx & Footer.jsx.
Risk Level: Medium.
Estimated Complexity: Medium.
PHASE A4 — Customer Homepage Redesign
Purpose: Redesign Home.jsx, Hero.jsx, Jackets.jsx, Exclusive.jsx, and OurPolicy.jsx.
Goal: Create an editorial fashion homepage with whitespace (py-16 to py-24), high-impact photography hero, and clean collection grids.
Dependencies: Phase A2, Phase A3.
Files to Inspect: frontend/src/pages/Home.jsx, frontend/src/component/Hero.jsx, frontend/src/component/Jackets.jsx, frontend/src/component/Exclusive.jsx, frontend/src/component/OurPolicy.jsx.
Files Expected to Change: Above 5 component files.
Files That MUST NOT Change: Product API controllers, context providers.
Components Affected: Homepage sections.
Routes Affected: /, /ourpolicy.
API Dependencies: GET /api/products.
Database Dependencies: Product collection.
Design-System Requirements: Minimal hero banner with high-contrast text overlay, 4-column feature product grids, clean 3-card policy bar with subtle line icons.
Functional Behavior That Must Remain Unchanged: Product card navigation to /product/:slug/:id, category collection link navigation.
Implementation Steps:
Refactor Hero.jsx layout using flex/grid containers and Montserrat Display Typography.
Update Jackets.jsx and Exclusive.jsx to use new ProductCard component grid.
Update OurPolicy.jsx to use 3-column slate card containers.
Validation Steps: Open http://localhost:5173/ in browser and test product card clicks.
Acceptance Criteria: Zero layout overflow, clean image scaling, interactive policy cards.
Rollback Considerations: Revert homepage component files.
Risk Level: Medium.
Estimated Complexity: Medium.
PHASE A5 — Product Catalog & Filters (ProductList.jsx)
Purpose: Redesign catalog page for Men, Women, and Kids categories.
Goal: Deliver a 4-column product grid with a collapsible filter sidebar, toolbar (count & sort selector), and empty filter states.
Dependencies: Phase A4.
Files to Inspect: frontend/src/pages/ProductList.jsx.
Files Expected to Change: frontend/src/pages/ProductList.jsx.
Files That MUST NOT Change: productController.js, productRoutes.js.
Components Affected: ProductList.jsx.
Routes Affected: /men, /women, /kids.
API Dependencies: GET /api/products?category=....
Database Dependencies: Product collection (category, price, sizes, color).
Design-System Requirements: 4-column grid (gap-6), 240px desktop filter panel, custom dropdown select for sorting, clean checkbox and price range inputs.
Functional Behavior That Must Remain Unchanged: Category routing based on URL path, client-side/server-side price filtering, sort by price (Low-High / High-Low).
Implementation Steps:
Refactor catalog toolbar header with category title and item count indicator.
Implement desktop collapsible filter sidebar and mobile filter slide-over drawer.
Connect product array mapping to new ProductCard component.
Validation Steps: Test category switching between /men, /women, /kids and verify filter reset actions.
Acceptance Criteria: Product count updates dynamically when applying price/size filters.
Rollback Considerations: Restore previous ProductList.jsx.
Risk Level: Medium.
Estimated Complexity: High.
PHASE A6 — Product Details Page (ProductDetails.jsx)
Purpose: Redesign single product details view, image gallery, size selector, and customer reviews list.
Goal: Create a 2-column editorial workspace with a vertical thumbnail gallery, large portrait preview, clean size selector buttons, and accordion reviews list.
Dependencies: Phase A5.
Files to Inspect: frontend/src/pages/ProductDetails.jsx.
Files Expected to Change: frontend/src/pages/ProductDetails.jsx.
Files That MUST NOT Change: feedbackUserController.js, cartRoutes.js.
Components Affected: ProductDetails.jsx.
Routes Affected: /product/:slug/:id.
API Dependencies: GET /api/products/:id, GET /api/feedback/product/:id, POST /api/feedback/add.
Database Dependencies: Product, Feedback collections.
Design-System Requirements: 12-column grid (7 Cols Gallery, 5 Cols Details), vertical thumbnail stack, size selection buttons with #00412E active border, full-width Add to Cart primary button.
Functional Behavior That Must Remain Unchanged: Image thumbnail active selection, size state validation prior to cart submission, feedback submission form.
Implementation Steps:
Implement thumbnail gallery stack with main image preview container.
Rebuild product option controls (color indicators, square size selector grid).
Add primary Add to Cart and outline Add to Wishlist action buttons.
Redesign reviews list and review submission form.
Validation Steps: Test adding product with size 'M' to cart and verify SweetAlert success notification.
Acceptance Criteria: Unselected size triggers alert warning on cart submission; reviews accordion expands/collapses cleanly.
Rollback Considerations: Restore previous ProductDetails.jsx.
Risk Level: Medium.
Estimated Complexity: High.
PHASE A7 — Shopping Cart & Wishlist Pages (CartPage.jsx & Wishlist.jsx)
Purpose: Redesign Shopping Cart view, Promo Code engine UI, and Wishlist grid.
Goal: Deliver a 2-column cart layout (Items Table + Sticky Order Summary Card) and a 4-column Wishlist grid with size selection modal triggers.
Dependencies: Phase A6.
Files to Inspect: frontend/src/pages/CartPage.jsx, frontend/src/pages/Wishlist.jsx, frontend/src/context/CartContext.jsx, frontend/src/context/WishlistContext.jsx.
Files Expected to Change: frontend/src/pages/CartPage.jsx, frontend/src/pages/Wishlist.jsx.
Files That MUST NOT Change: CartContext.jsx & WishlistContext.jsx state management functions (Visual refactoring only).
Components Affected: CartPage.jsx, Wishlist.jsx.
Routes Affected: /cart, /wishlist.
API Dependencies: /api/cart, /api/wishlist, /api/promos/apply.
Database Dependencies: Cart, Wishlist, PromoCode collections.
Design-System Requirements: Item rows with 80x100px thumbnails, inline quantity adjusters (- qty +), promo input with Apply secondary button, sticky #F8FAFC summary card.
Functional Behavior That Must Remain Unchanged: Quantity increment/decrement, item removal, promo code submission, move-to-cart trigger.
Implementation Steps:
Rebuild Cart items table with clean slate dividers and trash icon triggers.
Implement sticky Order Summary sidebar containing Subtotal, Shipping, Discount Tag, Total, and Checkout CTA button.
Refactor Wishlist grid to use new ProductCard components with inline size modal popup.
Validation Steps: Modify item quantities in Cart and verify total price recalculation.
Acceptance Criteria: Subtotal and total updates synchronously; empty cart view renders clean empty state container.
Rollback Considerations: Restore previous CartPage.jsx & Wishlist.jsx.
Risk Level: Medium.
Estimated Complexity: Medium.
PHASE A8 — Checkout & Payment Selection UI (Checkout.jsx)
Purpose: Redesign multi-step Checkout view, Address selector cards, and Payment method choices.
Goal: Deliver a clean 2-column checkout workspace (Address/Payment Selection + Sticky Order Items Summary) with trustworthy financial styling.
Dependencies: Phase A7.
Files to Inspect: frontend/src/pages/Checkout.jsx, frontend/src/component/AddressSection.jsx.
Files Expected to Change: frontend/src/pages/Checkout.jsx, frontend/src/component/AddressSection.jsx.
Files That MUST NOT Change: paymentController.js (Razorpay HMAC signature verification), orderController.js (createOrder endpoint).
Components Affected: Checkout.jsx, AddressSection.jsx.
Routes Affected: /checkout.
API Dependencies: POST /api/orders, POST /api/payment/razorpay/create-order, POST /api/payment/razorpay/verify, GET /api/users/address.
Database Dependencies: User, Order, Wallet collections.
Design-System Requirements: Radio cards for addresses with #00412E active border, payment choice tabs (Razorpay Online / Alden Wallet), clear summary price list.
Functional Behavior That Must Remain Unchanged: Address selection/adding/editing, Razorpay checkout modal trigger, Wallet deduction check, order payload submission.
Implementation Steps:
Refactor AddressSection.jsx to render crisp selectable radio cards with Add New Address button trigger.
Implement Payment Choice cards with Razorpay branding badge and Wallet balance display.
Rebuild Order Review summary list.
Validation Steps: Test address selection and payment choice toggle.
Acceptance Criteria: Address radio selection updates active state; payment selection toggles payment gateway payload correctly.
Rollback Considerations: Restore previous Checkout.jsx & AddressSection.jsx.
Risk Level: High.
Estimated Complexity: High.
PHASE A9 — Order Processing, Success & Orders History (MyOrders.jsx & OrderDetails.jsx)
Purpose: Redesign Order Processing overlay, Order Success confirmation screen, My Orders list, and Printable Order Invoice view.
Goal: Deliver a clean horizontal order status timeline (Placed ➔ Processing ➔ Shipped ➔ Delivered) and a high-contrast PDF exportable invoice.
Dependencies: Phase A8.
Files to Inspect: frontend/src/pages/OrderProcessing.jsx, frontend/src/pages/OrderSuccess.jsx, frontend/src/pages/MyOrders.jsx, frontend/src/pages/OrderDetails.jsx, frontend/src/component/Invoice.jsx.
Files Expected to Change: Above 5 files.
Files That MUST NOT Change: orderController.js, PDF generator dependencies (jspdf, html2canvas).
Components Affected: Order confirmation and management components.
Routes Affected: /order-processing, /order-success, /myorder, /orders/:id.
API Dependencies: GET /api/orders/my, GET /api/orders/:id, PUT /api/orders/:id/cancel.
Database Dependencies: Order collection.
Design-System Requirements: Status timeline with green active dots and slate lines, tabbed order filter (All, Active, Completed, Cancelled), clean invoice DOM layout.
Functional Behavior That Must Remain Unchanged: Order cancellation request trigger, PDF invoice export button trigger.
Implementation Steps:
Refactor MyOrders.jsx to display tabbed category list and order summary cards.
Update OrderDetails.jsx status tracker to render step-by-step progress timeline.
Refactor Invoice.jsx DOM container for crisp high-resolution HTML5 canvas rendering.
Validation Steps: Click Download PDF Invoice on an order details page and verify PDF file creation.
Acceptance Criteria: PDF exports cleanly without layout clipping or text overlap; status timeline reflects DB status.
Rollback Considerations: Restore original order view files.
Risk Level: Medium.
Estimated Complexity: Medium.
PHASE A10 — Digital Wallet & Transaction History (Wallet.jsx & TransactionHistory.jsx)
Purpose: Redesign Digital Wallet balance overview card, Top-Up modal UI, and Transaction Ledger table.
Goal: Deliver a dark slate hero card (#0F172A) for wallet balance display and a high-density transaction activity table.
Dependencies: Phase A9.
Files to Inspect: frontend/src/pages/Wallet.jsx, frontend/src/pages/TransactionHistory.jsx.
Files Expected to Change: frontend/src/pages/Wallet.jsx, frontend/src/pages/TransactionHistory.jsx.
Files That MUST NOT Change: walletController.js, transactionController.js.
Components Affected: Wallet.jsx, TransactionHistory.jsx.
Routes Affected: /wallet, /transactions.
API Dependencies: GET /api/wallet, POST /api/wallet/credit, GET /api/transactions/my.
Database Dependencies: Wallet, Transaction collections.
Design-System Requirements: Dark slate hero container, $0.00 balance display, preset top-up buttons (+$50, +$100, +$250), transaction table with Credit (green) and Debit (slate) badges.
Functional Behavior That Must Remain Unchanged: Top-up form input submission, transaction history pagination/list rendering.
Implementation Steps:
Refactor Wallet.jsx balance header card and quick top-up action modal.
Rebuild transaction ledger list with clean status badges and date timestamps.
Validation Steps: Open /wallet and verify balance display matches backend ledger.
Acceptance Criteria: Balance renders with 2 decimal precision; transaction rows display correct credit/debit indicators.
Rollback Considerations: Restore previous wallet pages.
Risk Level: Medium.
Estimated Complexity: Medium.
PHASE A11 — Customer Profile & Address Book (Profile.jsx)
Purpose: Redesign customer Profile workspace, avatar uploader, password update form, and Address Manager.
Goal: Deliver a clean 2-column tabbed account setting layout (Personal Info, Address Book, Security).
Dependencies: Phase A10.
Files to Inspect: frontend/src/pages/Profile.jsx.
Files Expected to Change: frontend/src/pages/Profile.jsx.
Files That MUST NOT Change: userController.js, Cloudinary upload unsigned preset.
Components Affected: Profile.jsx.
Routes Affected: /profile.
API Dependencies: GET /api/users/me, PUT /api/users/me, POST /api/users/address, PUT /api/users/address/:id/default.
Database Dependencies: User collection.
Design-System Requirements: Left vertical tab navigation (Slate-100 active indicator), clean 2-column input grid, circular avatar uploader container (rounded-full w-24 h-24).
Functional Behavior That Must Remain Unchanged: Cloudinary image upload trigger, profile update submission, default address toggle.
Implementation Steps:
Implement account settings tab bar (Personal, Address, Security).
Refactor Personal Information form inputs and avatar upload overlay.
Rebuild Address Manager grid with Set as Default toggle buttons.
Validation Steps: Update user phone number and click save; verify success toast notification.
Acceptance Criteria: Profile fields update synchronously; address cards highlight active default address correctly.
Rollback Considerations: Restore previous Profile.jsx.
Risk Level: Medium.
Estimated Complexity: Medium.
PHASE A12 — Customer Authentication UI (User_Login.jsx, ForgotPassword.jsx, ResetPassword.jsx)
Purpose: Redesign Customer Login, Registration modal, OTP Verification modal, and Password Reset screens.
Goal: Deliver a centered, white-first auth container (max-w-md) with crisp form inputs, primary login CTA, and Google social login button.
Dependencies: Phase A11.
Files to Inspect: frontend/src/pages/User_Login.jsx, frontend/src/pages/ForgotPassword.jsx, frontend/src/pages/ResetPassword.jsx.
Files Expected to Change: Above 3 files.
Files That MUST NOT Change: userAuthController.js, firebase.js (Firebase OAuth SDK initialization).
Components Affected: Auth pages and verification modals.
Routes Affected: /login, /forgot-password, /reset-password.
API Dependencies: /api/users/login, /api/users/register, /api/users/verify-otp, /api/users/google-login.
Database Dependencies: User collection.
Design-System Requirements: Centered white card (bg-white border border-slate-200 shadow-sm p-8 rounded-md), 6-digit numerical OTP input boxes, Google branding button.
Functional Behavior That Must Remain Unchanged: Tab toggle between Login & Register, OTP countdown timer, Firebase Google popup trigger.
Implementation Steps:
Refactor User_Login.jsx modal container and tab triggers.
Implement 6-digit OTP input pin boxes with auto-advance focus logic.
Refactor ForgotPassword.jsx and ResetPassword.jsx layout.
Validation Steps: Test tab switching between Login and Register views.
Acceptance Criteria: Auth forms render cleanly on mobile viewports; OTP timer counts down without layout glitch.
Rollback Considerations: Restore original auth page files.
Risk Level: Medium.
Estimated Complexity: Medium.
PHASE A13 — Admin Portal Design System & Layout Shell
Purpose: Create Admin portal layout shell, fixed dark sidebar, top action header, and responsive navigation drawer.
Goal: Deliver a high-productivity administrative layout (w-64 dark slate sidebar #0F172A + top h-16 header + #F8FAFC main canvas).
Dependencies: Phase A12.
Files to Inspect: frontend/src/component/Admin_Sidebar.jsx, frontend/src/admin-pages/Admin_Dashboard.jsx.
Files Expected to Change: frontend/src/component/Admin_Sidebar.jsx, frontend/src/component/Admin_Header.jsx (New).
Files That MUST NOT Change: Admin auth middleware, route definitions in App.jsx.
Components Affected: Admin layout wrappers.
Routes Affected: All /a-* admin routes.
API Dependencies: None.
Database Dependencies: None.
Design-System Requirements: Dark slate sidebar (bg-slate-900), active route indicator (bg-slate-800 text-emerald-400), top breadcrumbs and admin user dropdown.
Functional Behavior That Must Remain Unchanged: Route navigation between admin modules, admin logout action.
Implementation Steps:
Refactor Admin_Sidebar.jsx with structured navigation category groupings (Analytics, Management, Settings).
Create Admin_Header.jsx displaying active page title and quick profile/logout menu.
Validation Steps: Click through admin navigation items and verify active sidebar highlight.
Acceptance Criteria: Sidebar stays fixed during workspace scrolling; collapse toggle works cleanly on tablet viewports.
Rollback Considerations: Restore original Admin_Sidebar.jsx.
Risk Level: Medium.
Estimated Complexity: Medium.
PHASE A14 — Admin Dashboard & Analytics (Admin_Dashboard.jsx & Admin_Sales.jsx)
Purpose: Redesign Admin Dashboard overview, KPI summary widgets, recent orders table, and Sales Analytics reporting views.
Goal: Deliver a 4-column KPI metric card grid (Total Sales, Total Orders, Active Products, Total Customers) and high-density analytics reporting tables.
Dependencies: Phase A13.
Files to Inspect: frontend/src/admin-pages/Admin_Dashboard.jsx, frontend/src/admin-pages/Admin_Sales.jsx.
Files Expected to Change: frontend/src/admin-pages/Admin_Dashboard.jsx, frontend/src/admin-pages/Admin_Sales.jsx.
Files That MUST NOT Change: adminAuthController.js, orderController.getSalesReport.
Components Affected: Admin analytics dashboards.
Routes Affected: /a-dash, /a-sales.
API Dependencies: GET /api/admin/auth/dashboard-stats, GET /api/admin/auth/recent-orders, GET /api/orders/sales-report.
Database Dependencies: Order, Product, User collections.
Design-System Requirements: KPI cards with bold metric values (28px Bold) and trend indicators, date range filter bar (fromDate to toDate), summary revenue tables.
Functional Behavior That Must Remain Unchanged: Date range filtering form submission, sales report data calculation.
Implementation Steps:
Refactor Admin_Dashboard.jsx top metric cards and recent 10 orders table.
Rebuild Admin_Sales.jsx analytics toolbar and report export view.
Validation Steps: Select custom date range on Sales Analytics view and verify table update.
Acceptance Criteria: Metric cards render without text truncation; date filter triggers API request correctly.
Rollback Considerations: Restore previous dashboard views.
Risk Level: Medium.
Estimated Complexity: High.
PHASE A15 — Admin Management Views (Products, Orders, Customers, Categories, Promos, Reports)
Purpose: Redesign Admin Product CRUD, Order Status Manager, Customer Directory, Category Editor, Promo Code Engine, and Feedback Reports.
Goal: Deliver high-density data tables (h-14 row height, alternating row shading, status badges) and clean slide-over editor drawers.
Dependencies: Phase A14.
Files to Inspect: frontend/src/admin-pages/Admin_Products.jsx, Admin_orders.jsx, Admin_Customers.jsx, Admin_Category.jsx, Admin_Promos.jsx, Admin_Reports.jsx.
Files Expected to Change: Above 6 admin view files.
Files That MUST NOT Change: Corresponding admin backend controllers.
Components Affected: Admin module pages.
Routes Affected: /a-products, /a-orders, /a-customers, /a-category, /a-promos, /a-reports.
API Dependencies: All /api/admin/* management routes.
Database Dependencies: All database models.
Design-System Requirements: High-density data tables, status badges (Active: Green, Soft-Deleted: Red, Blocked: Red), Add/Edit modal dialogs (max-w-lg).
Functional Behavior That Must Remain Unchanged: Product creation/editing/soft-deletion, order status dropdown update, customer block/unblock toggle, promo creation.
Implementation Steps:
Rebuild Admin_Products.jsx table and Add Product modal dialog.
Rebuild Admin_orders.jsx table with inline status dropdown selector.
Rebuild Admin_Customers.jsx, Admin_Category.jsx, Admin_Promos.jsx, Admin_Reports.jsx.
Validation Steps: Test soft-deleting a product in admin table and verify soft-deleted badge indicator.
Acceptance Criteria: Table rows transform to stacked cards on mobile screen widths; modal forms validate required inputs.
Rollback Considerations: Restore original admin page files.
Risk Level: High.
Estimated Complexity: High.
PHASE A16 — Responsive Layout Optimization
Purpose: Audit and optimize responsive behavior across Mobile (390px), Tablet (768px), Desktop (1024px), and Large Desktop (1280px+).
Goal: Eliminate horizontal page scrolling, fix modal touch scroll bleeding, and optimize touch targets (≥44px).
Dependencies: Phase A15.
Files to Inspect: All customer and admin page views.
Files Expected to Change: Selected component files requiring responsive class adjustments.
Files That MUST NOT Change: Backend code.
Components Affected: Global layouts, Modals, Tables, Navigation drawers.
Routes Affected: All routes.
API Dependencies: None.
Database Dependencies: None.
Design-System Requirements: Mobile horizontal padding 16px (px-4), table-to-card transformations below 768px.
Functional Behavior That Must Remain Unchanged: All functionality across viewports.
Implementation Steps:
Add overflow-y-auto and fixed body scroll locks for modal overlays.
Ensure touch button padding meets minimum 44px hit box.
Verify card grid transformations (grid-cols-2 ➔ grid-cols-3 ➔ grid-cols-4).
Validation Steps: Test full customer purchase flow using Chrome DevTools Mobile Device Simulator (iPhone 14 / iPad Pro).
Acceptance Criteria: Zero horizontal scrollbars (overflow-x-hidden); modal scroll stays isolated inside dialog container.
Rollback Considerations: Revert responsive CSS adjustments.
Risk Level: Medium.
Estimated Complexity: Medium.
PHASE A17 — Accessibility & Keyboard Navigation Polishing
Purpose: Enforce WCAG AA accessibility standards across customer and admin views.
Goal: Ensure all interactive elements feature visible focus rings (ring-2 ring-[#00412E]), valid ARIA labels, and keyboard tabbing support.
Dependencies: Phase A16.
Files to Inspect: frontend/src/component/Navbar.jsx, ProductCard.jsx, Button.jsx, Input.jsx, Modal components.
Files Expected to Change: Selected frontend components.
Files That MUST NOT Change: Backend files.
Components Affected: Interactive components.
Routes Affected: All routes.
API Dependencies: None.
Database Dependencies: None.
Design-System Requirements: Minimum text contrast ratio 4.5:1, visible focus ring ring-offset-2.
Functional Behavior That Must Remain Unchanged: Mouse and touch interactions.
Implementation Steps:
Add aria-label attributes to icon-only buttons (Wishlist heart, Cart trash icon, Modal close X).
Add tabIndex={0} and keyboard Enter/Space listeners for custom card triggers.
Verify color contrast ratios for secondary slate text against white backgrounds.
Validation Steps: Navigate customer storefront using keyboard Tab and Enter keys exclusively.
Acceptance Criteria: All interactive elements highlight with a crisp focus ring when tabbed; modal closes on Escape key press.
Rollback Considerations: Revert accessibility attribute edits.
Risk Level: Low.
Estimated Complexity: Low.
PHASE A18 — Final UI Visual Consistency Audit & Build Verification
Purpose: Perform end-to-end visual QA audit and production build compilation test.
Goal: Verify 100% alignment with DESIGN_SYSTEM.md specs and confirm zero regressions across customer/admin user flows.
Dependencies: Phase A0 through A17.
Files to Inspect: Complete frontend/src/ repository.
Files Expected to Change: Minor visual polish edits if required during final audit.
Files That MUST NOT Change: Backend code.
Components Affected: All components.
Routes Affected: All routes.
API Dependencies: All endpoints.
Database Dependencies: Active MongoDB Atlas connection.
Design-System Requirements: 100% compliance with DESIGN_SYSTEM.md color, font, spacing, and radius specs.
Functional Behavior That Must Remain Unchanged: All application features.
Implementation Steps:
Execute npm run build in frontend/ and log final bundle metrics.
Execute manual visual verification of Homepage, Catalog, Cart, Checkout, Orders, Wallet, and Admin Dashboard.
Validation Steps: Verify bundle output compiles cleanly and app runs without console errors.
Acceptance Criteria: npm run build succeeds; zero console errors during customer checkout journey.
Rollback Considerations: Git tag redesign-completed.
Risk Level: Low.
Estimated Complexity: Medium.
6. FILE-LEVEL IMPLEMENTATION MAP
Target Component / File	Current Path	Planned UI Refactoring Scope	Preserved Interfaces & Behaviors
Button.jsx	frontend/src/component/Button.jsx	Create modular button primitive matching 4 variants (#00412E primary).	Props: variant, size, onClick, disabled, children.
ProductCard.jsx	frontend/src/component/ProductCard.jsx	Rebuild with 3:4 portrait image, left-aligned text, scale hover.	Props: product, onWishlistToggle, category.
Navbar.jsx	frontend/src/component/Navbar.jsx	Redesign sticky 72px navbar, logo styling, slide-over mobile drawer.	Context counters (cartItems.length, wishlistItems.length).
Footer.jsx	frontend/src/component/Footer.jsx	Rebuild 4-column dark slate footer with newsletter input box.	Links: Category routes, Policies, Social handles.
ProductList.jsx	frontend/src/pages/ProductList.jsx	4-column catalog grid, desktop filter panel, custom sort select.	Category filtering logic, price range slider state.
ProductDetails.jsx	frontend/src/pages/ProductDetails.jsx	2-column workspace, vertical thumbnail gallery, square size grid.	Size selection validation, addToCart(product, size) payload.
CartPage.jsx	frontend/src/pages/CartPage.jsx	Cart items list + sticky Order Summary sidebar card.	updateQty, removeFromCart, applyPromo Context calls.
Checkout.jsx	frontend/src/pages/Checkout.jsx	Selectable address radio cards, Payment method choices cards.	Address selection state, Razorpay modal trigger, Wallet payload.
Wallet.jsx	frontend/src/pages/Wallet.jsx	Dark slate hero balance card, quick top-up action buttons.	Top-up submission handler, ledger API fetch.
Admin_Sidebar.jsx	frontend/src/component/Admin_Sidebar.jsx	Fixed 264px dark slate sidebar (#0F172A) with grouping labels.	Active route matching logic, logout trigger handler.
Admin_Dashboard.jsx	frontend/src/admin-pages/Admin_Dashboard.jsx	4-column KPI stat widgets + high-density recent orders table.	Dashboard stats API fetch, date calculation utilities.
7. SHARED COMPONENT MIGRATION MATRIX
Category	Component Name	File Location	Migration Strategy	Risk
FOUNDATION	Button	frontend/src/component/Button.jsx	NEW COMPONENT REQUIRED. Create primitive wrapper with 4 visual variants.	Low
FOUNDATION	Input	frontend/src/component/Input.jsx	NEW COMPONENT REQUIRED. Create 44px text/password input wrapper with focus ring.	Low
FOUNDATION	Modal	frontend/src/component/Modal.jsx	NEW COMPONENT REQUIRED. Create accessible dialog wrapper with backdrop blur.	Low
LAYOUT	Navbar	frontend/src/component/Navbar.jsx	Refactor visual JSX/CSS while preserving Context badge subscriptions.	Medium
LAYOUT	Footer	frontend/src/component/Footer.jsx	Refactor JSX layout to 4-column dark slate structure.	Low
LAYOUT	AdminSidebar	frontend/src/component/Admin_Sidebar.jsx	Refactor sidebar styling to #0F172A with active emerald indicators.	Low
COMMERCE	ProductCard	frontend/src/component/ProductCard.jsx	Rebuild image container to 3:4 portrait ratio and update price typography.	Medium
COMMERCE	AddressSection	frontend/src/component/AddressSection.jsx	Refactor address items into selectable radio cards with #00412E active border.	Medium
COMMERCE	Invoice	frontend/src/component/Invoice.jsx	Refactor printable HTML container for high-resolution canvas PDF exporting.	Medium
8. PAGE-BY-PAGE MIGRATION PLAN
Page	Current File	Target Visual Design	Shared Components	Priority	Risk
Home	Home.jsx	High-impact hero, 4-col showcase grids, 3-card policy.	ProductCard, Navbar, Footer	P1	Medium
Product Catalog	ProductList.jsx	4-col catalog, 240px filter sidebar, sort toolbar.	ProductCard, Button, Input	P1	High
Product Details	ProductDetails.jsx	2-col workspace, thumbnail stack, square size selector.	Button, Modal, Navbar	P1	High
Cart	CartPage.jsx	Split view items table + sticky order summary sidebar.	Button, Input, Navbar	P1	Medium
Wishlist	Wishlist.jsx	4-col saved grid + inline size selection modal.	ProductCard, Modal, Button	P1	Medium
Checkout	Checkout.jsx	Selectable address radio cards + Payment method choices.	AddressSection, Button, Input	P1	High
My Orders	MyOrders.jsx	Tabbed order list + step-by-step progress timeline.	Badge, Button, Navbar	P2	Medium
Wallet	Wallet.jsx	Dark slate hero balance card + transaction ledger table.	Button, Input, Modal	P2	Medium
Profile	Profile.jsx	2-col tabbed workspace (Personal, Address, Security).	AddressSection, Input, Button	P2	Medium
Admin Dashboard	Admin_Dashboard.jsx	4-col KPI stat widgets + high-density recent orders table.	AdminSidebar, AdminHeader, Table	P3	Medium
Admin Products	Admin_Products.jsx	High-density product table + Add Product modal drawer.	AdminSidebar, Table, Modal	P3	High
9. WORKSTREAM B — FUNCTIONAL BUG FIX PLAN
All functional defects identified during the audit in 
plan.md
 are scheduled in Workstream B.


┌────────────────────────────────────────────────────────────────────────┐
│               WORKSTREAM B — FUNCTIONAL BUG FIX SEQUENCE               │
└────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│ PHASE B1: WISHLIST    │ │ PHASE B2: PROMO CARTS │ │ PHASE B3: REVIEWS BUG │
│ MOVE-TO-CART PARAM    │ │ AUTO-WIPE BUG FIX     │ │ & VERIFIED BUYER FIX  │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘
                                                                    │
                                                                    ▼
                                                  ┌─────────────────────────┐
                                                  │ PHASE B4: CANCELLED     │
                                                  │ ORDER WALLET REFUND FIX │
                                                  └─────────────────────────┘
[PHASE B1] Fix Wishlist Move-to-Cart Parameter Mismatch
ID: BUG-01 | Priority: P1 | Severity: 🟠 HIGH
Affected File: 
frontend/src/pages/Wishlist.jsx:L23
Current Behavior: Wishlist.jsx calls addToCart(item) with 1 parameter. CartContext.jsx expects addToCart(product, selectedSize). Items added to cart from wishlist have size: undefined.
Expected Behavior: handleAddToCart in Wishlist.jsx passes both product object and selected size string (addToCart(item, selectedSize)).
Proposed Fix: Update Wishlist card trigger to prompt size selection modal if product requires size before invoking addToCart.
Validation: Add item from Wishlist to Cart, verify item in Cart displays selected size 'L'.
[PHASE B2] Fix Cart Context Promo Code Auto-Wipe Bug
ID: BUG-02 | Priority: P1 | Severity: 🟠 HIGH
Affected File: 
frontend/src/context/CartContext.jsx:L40-43
Current Behavior: useEffect in CartContext.jsx runs setPromo(null) every time cartItems state changes, auto-wiping applied promo discounts whenever item quantity is updated.
Expected Behavior: Applied promo discount persists during item quantity changes unless cart total falls below promo minimum purchase requirement.
Proposed Fix: Remove unconditional setPromo(null) from useEffect and replace with conditional check against promo.minOrderValue.
Validation: Apply promo code SAVE10, increase item quantity from 1 to 2, verify promo discount remains active.
[PHASE B3] Fix Product Reviews Author Population & Verified Buyer Check
ID: BUG-03 | Priority: P1 | Severity: 🟠 HIGH
Affected File: 
backend/controllers/feedbackUserController.js:L32,L58
 & 
frontend/src/pages/ProductDetails.jsx:L375
Current Behavior: Backend populates "firstName" (which is undefined on User schema), causing UI to render rev.user.firstName as undefined. Line 32 queries "items.product" in Order when the actual schema field is "items.productId".
Expected Behavior: Backend populates "name", UI renders rev.user.name, and buyer verification checks "items.productId".
Proposed Fix: In feedbackUserController.js, change .populate("user", "firstName") to .populate("user", "name") and update purchase query to Order.findOne({ user: userId, "items.productId": productId }).
Validation: Submit product review as verified buyer; verify review renders author name and verified buyer badge.
[PHASE B4] Fix Cancelled Order Wallet Refund Logic
ID: BUG-04 | Priority: P1 | Severity: 🟠 HIGH
Affected File: 
backend/controllers/orderController.js:L213-256
Current Behavior: Cancelling a wallet-paid order updates orderStatus to "cancelled" but does not credit money back to the user's Wallet balance.
Expected Behavior: Cancelling a wallet-paid order credits the order total back to user's Wallet balance and logs a WALLET_CREDIT transaction.
Proposed Fix: In cancelOrder, if order.paymentMethod === "wallet" and order.paymentStatus === "paid", execute wallet.balance += order.total, create Transaction log, and set order.paymentStatus = "refunded".
Validation: Cancel a wallet-paid order, verify wallet balance increases by order total amount.
10. WORKSTREAM C — SECURITY HARDENING PLAN
All security vulnerabilities discovered during the audit in 
plan.md
 are scheduled in Workstream C.


┌────────────────────────────────────────────────────────────────────────┐
│              WORKSTREAM C — SECURITY HARDENING SEQUENCE                │
└────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│ PHASE C1: VERIFIED    │ │ PHASE C2: ADMIN ROUTE │ │ PHASE C3: DB-BACKED   │
│ WALLET TOP-UP API     │ │ MIDDLEWARE PROTECTION │ │ ADMIN AUTH & BCRYPT   │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘
                                                                    │
                                    ┌───────────────────────────────┴───────────────────────────────┐
                                    ▼                                                               ▼
                        ┌───────────────────────┐                       ┌───────────────────────┐
                        │ PHASE C4: ORDER IDOR  │                       │ PHASE C5: GOOGLE OAUTH│
                        │ OWNERSHIP CHECK FIX   │                       │ JWT ROLE CLAIM FIX    │
                        └───────────────────────┘                       └───────────────────────┘
[PHASE C1] Secure Wallet Top-Up API with Razorpay HMAC Verification
Security Issue: Arbitrary wallet crediting without payment gateway verification.
Affected File: 
backend/controllers/walletController.js:L37-82
Attack Scenario: Attacker sends POST /api/wallet/credit with { "amount": 100000, "paymentId": "DUMMY" } and receives 100,000 wallet credits for free.
Required Change: Refactor creditWallet to require razorpay_order_id, razorpay_payment_id, and razorpay_signature. Verify signature using crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) before crediting wallet balance.
Priority: 🔴 P0 CRITICAL
Validation Test: Send POST /api/wallet/credit with invalid HMAC signature; verify server rejects request with HTTP 400 Bad Request.
[PHASE C2] Restrict Admin Product Routes to Admin Role
Security Issue: Admin product routes accessible by standard users.
Affected File: 
backend/routes/adminProductRoutes.js:L7
Attack Scenario: Logged-in customer sends PUT /api/admin/products/soft-delete/:id and deletes products from catalog.
Required Change: Change router.use(authMiddleware()) to router.use(authMiddleware(["admin"])).
Priority: 🔴 P0 CRITICAL
Validation Test: Send GET /api/admin/products using a regular User JWT (role: "user"); verify server rejects request with HTTP 403 Forbidden.
[PHASE C3] Migrate Admin Auth from Hardcoded Objects to DB Model
Security Issue: Hardcoded admin credentials (admin@gmail.com / admin12) in source code.
Affected File: 
backend/controllers/adminAuthController.js:L6-21
 & 
backend/models/Admin.js
Attack Scenario: Source code leak exposes plain-text admin credentials to public.
Required Change: Update adminLogin to query Admin.findOne({ email }) and verify password using bcrypt.compare().
Priority: 🔴 P0 CRITICAL
Validation Test: Attempt login with invalid password; verify rejection. Test login with seeded bcrypt admin record; verify JWT creation.
[PHASE C4] Add Order Ownership Authorization Check (IDOR Fix)
Security Issue: Insecure Direct Object Reference on order details route.
Affected File: 
backend/controllers/orderController.js:L190-211
Attack Scenario: User B fetches GET /api/orders/:id for an order owned by User A and views User A's home address and phone number.
Required Change: In getOrderById, add:
javascript

if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
  return res.status(403).json({ success: false, message: "Unauthorized access to order" })
}
Priority: 🔴 P0 CRITICAL
Validation Test: User B attempts to access User A's order ID; verify server returns HTTP 403 Forbidden.
[PHASE C5] Include Role Claim in Google OAuth JWT Payload
Security Issue: Google Auth users issued JWTs without role: "user", causing downstream 403 Forbidden errors.
Affected File: 
backend/controllers/userAuthController.js:L180-182
Attack Scenario: Google login users cannot access /api/cart or /api/orders/my.
Required Change: Update googleUserLogin token generation to jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "7d" }).
Priority: 🔴 P0 CRITICAL
Validation Test: Log in via Google Auth and make GET request to /api/cart; verify server returns HTTP 200 OK.
11. UI / BACKEND / SECURITY BOUNDARY DIRECTIVE
To prevent execution ambiguity, every project file is assigned a strict architectural category:


┌────────────────────────────────────────────────────────────────────────┐
│                        CATEGORY DIRECTIVES                             │
└────────────────────────────────────────────────────────────────────────┘
  [UI-ONLY]       ➔ Edit ONLY Tailwind, layout, & presentation JSX.
  [FUNCTIONAL]    ➔ Edit ONLY bug-fix logic (Workstream B).
  [SECURITY]      ➔ Edit ONLY security & authorization logic (Workstream C).
  [SHARED-HYBRID] ➔ Requires multi-workstream approval before editing.
frontend/src/pages/Wallet.jsx: Marked [UI-ONLY] for Workstream A (layout refactoring) AND [SECURITY] for Workstream C (Razorpay Modal checkout integration).
backend/controllers/walletController.js: Marked strictly [SECURITY]. UI developers MUST NOT touch this file during Workstream A.
backend/routes/adminProductRoutes.js: Marked strictly [SECURITY]. UI developers MUST NOT touch this file during Workstream A.
backend/controllers/orderController.js: Marked [SECURITY] (IDOR fix in getOrderById) AND [FUNCTIONAL] (Refund logic in cancelOrder).
12. PRESERVATION MATRICES
API Preservation Matrix
Default Rule: MUST NOT CHANGE API ROUTE PATHS OR RESPONSE JSON SCHEMAS.

Endpoint	Used By	Workstream	Schema Change Required?	Reason
GET /api/products	Catalog & Home	Workstream A	NO	UI refactors visual card layout only.
POST /api/orders	Checkout	Workstream A	NO	UI passes existing order payload.
GET /api/orders/my	My Orders	Workstream A	NO	UI updates timeline presentation only.
POST /api/wallet/credit	Wallet Top-Up	Workstream C	YES (Payload)	Requires razorpay_signature verification payload.
Database Preservation Matrix
Default Rule: NO DATABASE SCHEMA CHANGES PERMITTED FOR UI REFACTORING.

Mongoose Model	Used By	UI Workstream Dependency	Schema Change Required?
User.js	Auth, Profile	Workstream A	NO
Product.js	Catalog, Admin	Workstream A	NO
Order.js	Checkout, My Orders	Workstream A	NO
Wallet.js	Wallet UI	Workstream A	NO
13. REGRESSION PROTECTION — "DO NOT BREAK" CHECKLIST
Before declaring any workstream phase complete, the developer MUST execute manual verification of the following 15 core functions:

 1. User Email Registration & OTP Delivery: OTP email sends and verifies successfully.
 2. Password Login: User login issues valid JWT token stored in localStorage.
 3. Google Social Login: Google login issues JWT with role: "user" claim.
 4. Product Catalog Navigation: Filtering by category and sorting by price updates product list.
 5. Single Product View: Selecting size 'M' enables Add to Cart button.
 6. Shopping Cart Operations: Item quantity increment/decrement updates cart subtotal synchronously.
 7. Wishlist Operations: Adding item to wishlist updates navbar badge counter.
 8. Checkout Address Selection: Selecting an address radio card highlights active border.
 9. Razorpay Payment Gateway: Razorpay modal opens and processes payment signature.
 10. Digital Wallet Deductions: Placing order via Wallet deducts exact total from balance.
 11. Order Details PDF Invoice: Clicking Download PDF Invoice generates printable PDF.
 12. Order Cancellation: Cancelling order updates status badge to Cancelled.
 13. Admin Login Portal: Admin login accepts database credentials.
 14. Admin Product Soft-Delete: Soft-deleting product updates product status tag.
 15. Admin Sales Analytics: Selecting custom date range recalculates revenue totals.
14. MERMAID DEPENDENCY GRAPH FOR IMPLEMENTATION
Mermaid diagram
15. MASTER EXECUTION ROADMAP

[ PHASE 0: SYSTEM AUDIT & ARCHITECTURE DISCOVERY (plan.md) ]
                           │
                           ▼
[ PHASE 1: DESIGN SYSTEM & VISUAL SPECIFICATION (DESIGN_SYSTEM.md) ]
                           │
                           ▼
[ PHASE 2: MASTER PHASED IMPLEMENTATION PLAN (IMPLEMENTATION_PLAN.md) ]
                           │
      ┌────────────────────┼────────────────────┐
      ▼                    ▼                    ▼
[ WORKSTREAM A ]     [ WORKSTREAM B ]     [ WORKSTREAM C ]
 UI/UX Redesign       Bug Fixes Backlog    Security Hardening
(Phases A0 - A18)    (Phases B1 - B4)     (Phases C1 - C5)
      │                    │                    │
      └────────────────────┼────────────────────┘
                           │
                           ▼
[ END-TO-END SYSTEM REGRESSION & QA AUDIT ]
                           │
                           ▼
[ PRODUCTION DEPLOYMENT READINESS GATE ]
16. FINAL PROJECT-WIDE ACCEPTANCE CRITERIA
UI Compliance: Customer storefront and Admin portal match 100% of visual, spatial, and color token specifications in 
DESIGN_SYSTEM.md
 without glowing drop shadows or pill buttons.
Build Success: npm run build inside frontend/ compiles cleanly with zero warnings or errors.
Security Clearance: All 5 P0 security vulnerabilities documented in Workstream C pass automated and manual penetration testing.
Functional Integrity: All 15 items on the "DO NOT BREAK" regression checklist pass manual end-to-end verification.
Zero Data Corruption: Database models and existing customer order records remain unchanged and uncorrupted.