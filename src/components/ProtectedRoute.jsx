import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { checkExpiryAndLogout } from '../store/slices/authSlice'

export default function ProtectedRoute() {
  const { token } = useSelector(s => s.auth)
  const dispatch = useDispatch()
  const loc = useLocation()
  dispatch(checkExpiryAndLogout())

  if (!token) {
    const base = loc.pathname.split('/')[1]
    const redirect = base === 'admin' ? '/admin/login' : base === 'teacher' ? '/teacher/login' : '/student/login'
    return <Navigate to={redirect} replace />
  }
  return <Outlet />
}
