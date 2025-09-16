import { jwtDecode } from 'jwt-decode'

const STORAGE_KEY = 'clp_auth'

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { user: null, token: null, role: null }
    const parsed = JSON.parse(raw)
    return parsed
  } catch {
    return { user: null, token: null, role: null }
  }
}

export function setStoredAuth(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY)
}

export function isTokenExpired(token) {
  try {
    const { exp } = jwtDecode(token)
    if (!exp) return false
    const now = Math.floor(Date.now() / 1000)
    return exp < now
  } catch {
    return true
  }
}