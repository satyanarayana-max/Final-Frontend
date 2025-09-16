import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function RoleGuard({ role }) {
  const r = useSelector(s => s.auth.role)
  const loc = useLocation()
  if (r !== role) {
    // Redirect to their own home if roles mismatch
    if (r === 'ADMIN') return <Navigate to="/admin/home" replace />
    if (r === 'TEACHER') return <Navigate to="/teacher/home" replace />
    if (r === 'STUDENT') return <Navigate to="/student/home" replace />
    // Not logged in fallback
    const base = loc.pathname.split('/')[1]
    const redirect = base === 'admin' ? '/admin/login' : base === 'teacher' ? '/teacher/login' : '/student/login'
    return <Navigate to={redirect} replace />
  }
  return <Outlet />
}
