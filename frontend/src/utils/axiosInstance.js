import axios from "axios"
import API from "../config/api"

const axiosInstance = axios.create({
  baseURL: API,
})

export default axiosInstance