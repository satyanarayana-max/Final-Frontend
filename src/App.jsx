import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminHome from './pages/admin/AdminHome'
import TeacherHome from './pages/teacher/TeacherHome'
import StudentHome from './pages/student/StudentHome'
import AdminLogin from './pages/auth/AdminLogin'
import TeacherLogin from './pages/auth/TeacherLogin'
import StudentLogin from './pages/auth/StudentLogin'
import StudentRegister from './pages/auth/StudentRegister'
import ProtectedRoute from './components/ProtectedRoute'
import RoleGuard from './components/RoleGuard'
import NotFound from './components/NotFound'

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Navigate to="/student/login" />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/teacher/login" element={<TeacherLogin />} />
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/register" element={<StudentRegister />} />

      {/* Admin */}
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard role="ADMIN" />}>
          <Route path="/admin/home/*" element={<AdminHome />} />
        </Route>
        <Route element={<RoleGuard role="TEACHER" />}>
          <Route path="/teacher/home/*" element={<TeacherHome />} />
        </Route>
        <Route element={<RoleGuard role="STUDENT" />}>
          <Route path="/student/home/*" element={<StudentHome />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
