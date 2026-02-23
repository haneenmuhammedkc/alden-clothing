import { Navigate, useLocation } from "react-router-dom"

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken")
  const location = useLocation()

  if (!token){
    return ( <Navigate to="/a-login" state={{ from: location }} replace/> )
  }

  return children
}

export default AdminProtectedRoute