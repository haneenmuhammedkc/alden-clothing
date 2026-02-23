import { Navigate, useLocation } from "react-router-dom"

const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("userToken")
  const location = useLocation()

  if (!token || token === "undefined" || token === "null"){
    return ( <Navigate to="/login" state={{ from: location }} replace/> )
  }

  return children
}

export default UserProtectedRoute