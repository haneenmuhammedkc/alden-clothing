import axios from "axios"
import API from "../config/api"

const axiosInstance = axios.create({
  baseURL: API,
  withCredentials: true, // if using cookies/auth
})

export default axiosInstance