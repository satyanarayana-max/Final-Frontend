import axios from 'axios'
import { store } from './storeProxy'
import { logout } from '../store/slices/authSlice'
import { isTokenExpired } from '../utils/auth'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: true, // enable if backend uses cookies
  timeout: 15000
})

// Request interceptor
http.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth?.token

    if (token) {
      if (isTokenExpired(token)) {
        store.dispatch(logout())
        return Promise.reject(new Error('Session expired. Please login again.'))
      }
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if (status === 401) {
      store.dispatch(logout())
    }

    if (!status) {
      console.error('Network or CORS error:', error)
    } else {
      console.error(`HTTP ${status} error:`, error.response?.data || error.message)
    }

    return Promise.reject(error)
  }
)

export default http
