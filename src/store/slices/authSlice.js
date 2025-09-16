import { createSlice } from '@reduxjs/toolkit'
import { getStoredAuth, setStoredAuth, clearStoredAuth, isTokenExpired } from '../../utils/auth'

const initial = getStoredAuth()

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initial.user,
    token: initial.token,
    role: initial.role,
    status: 'idle'
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, role } = action.payload
      state.user = user; state.token = token; state.role = role
      setStoredAuth({ user, token, role })
    },
    logout: (state) => {
      state.user = null; state.token = null; state.role = null
      clearStoredAuth()
    },
    checkExpiryAndLogout: (state) => {
      if (!state.token || isTokenExpired(state.token)) {
        state.user = null; state.token = null; state.role = null
        clearStoredAuth()
      }
    }
  }
})

export const { setCredentials, logout, checkExpiryAndLogout } = authSlice.actions
export default authSlice.reducer
