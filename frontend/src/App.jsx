import { Route, Routes } from 'react-router-dom'
import { assets } from './assets/assets'

import AdminProtectedRoute from '../routes/AdminProtectedRoute'
import UserProtectedRoute from '../routes/UserProtectedRoute'

import Admin_Login from './admin-pages/Admin_Login'
import Admin_Dashboard from './admin-pages/Admin_Dashboard'
import Admin_Products from './admin-pages/Admin_Products'
import Admin_Orders from './admin-pages/Admin_orders'
import Admin_Customers from './admin-pages/Admin_Customers'
import Admin_Categories from './admin-pages/Admin_Category'
import Admin_Promos from './admin-pages/Admin_Promos'
import Admin_Reports from './admin-pages/Admin_Reports'
import Admin_Sales from './admin-pages/Admin_Sales'

import User_Login from './pages/User_Login'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/CartPage'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import MyOrders from './pages/MyOrders'
import OrderDetails from './pages/OrderDetails'
import Wallet from './pages/Wallet'
import Wishlist from './pages/Wishlist'
import TransactionHistory from './pages/TransactionHistory'
import OrderSuccess from './pages/OrderSuccess'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import OurPolicy from './component/OurPolicy'
import OrderProcessing from './pages/OrderProcessing'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<User_Login/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/' element={<Home />} />
        <Route path='/ourpolicy' element={<OurPolicy /> } />
        <Route path='/men' element={<ProductList category="Men" heroImage={assets.Mencover1} />} />
        <Route path='/women' element={<ProductList category="Women" heroImage={assets.Womencover1} />} />
        <Route path='/kids' element={<ProductList category="Kids" heroImage={assets.Kidscover1} />} />
        <Route path="/product/:slug/:id" element={<ProductDetails />} />
        <Route path='/myorder' element={ <UserProtectedRoute> <MyOrders /> </UserProtectedRoute> } />
        <Route path='/orders/:id' element={ <UserProtectedRoute> <OrderDetails /> </UserProtectedRoute> } />
        <Route path='/wallet' element={ <UserProtectedRoute> <Wallet /> </UserProtectedRoute> } />
        <Route path='/wishlist' element={ <UserProtectedRoute> <Wishlist /> </UserProtectedRoute> } />
        <Route path='/transactions' element={ <UserProtectedRoute> <TransactionHistory /> </UserProtectedRoute> } />
        <Route path="/order-success" element={ <UserProtectedRoute> <OrderSuccess /> </UserProtectedRoute> } />
        <Route path="/order-processing" element={ <UserProtectedRoute> <OrderProcessing /> </UserProtectedRoute> } />
        <Route path='/cart' element={ <UserProtectedRoute> <Cart /> </UserProtectedRoute> } />
        <Route path='/profile' element={ <UserProtectedRoute> <Profile /> </UserProtectedRoute> } />
        <Route path='/checkout' element={ <UserProtectedRoute> <Checkout/> </UserProtectedRoute> } />

        <Route path='/a-login' element={<Admin_Login />} />
        <Route path='/a-orders' element={ <AdminProtectedRoute> <Admin_Orders /> </AdminProtectedRoute> } />
        <Route path="/a-dash" element={ <AdminProtectedRoute> <Admin_Dashboard /> </AdminProtectedRoute> } />
        <Route path='/a-customers' element={ <AdminProtectedRoute> <Admin_Customers /> </AdminProtectedRoute> } />
        <Route path='/a-products' element={ <AdminProtectedRoute> <Admin_Products /> </AdminProtectedRoute> } />
        <Route path='/a-category' element={ <AdminProtectedRoute> <Admin_Categories /> </AdminProtectedRoute> } />
        <Route path='/a-reports' element={ <AdminProtectedRoute> <Admin_Reports /> </AdminProtectedRoute> } />
        <Route path='/a-promos' element={ <AdminProtectedRoute> <Admin_Promos /> </AdminProtectedRoute> } />
        <Route path='/a-sales' element={ <AdminProtectedRoute> <Admin_Sales /> </AdminProtectedRoute> } />
      </Routes>
    </div>
  )
}

export default App