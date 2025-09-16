import { Routes, Route, Navigate } from 'react-router-dom'
import TopNav from '../../components/TopNav'
import Layout from '../../components/Layout'
import AdminDashboard from './Dashboard'
import Teachers from './Teachers'
import Students from './Students'
import Courses from './Courses'
import RegisterTeacher from './RegisterTeacher'

export default function AdminHome() {
  const items = [
    { label: 'Dashboard', to: '/admin/home' },
    { label: 'Register Teacher', to: '/admin/home/register-teacher' },
    { label: 'Courses', to: '/admin/home/courses' },
    { label: 'Teachers', to: '/admin/home/teachers' },
    { label: 'Students', to: '/admin/home/students' },
  ]
  return (
    <Layout TopNav={<TopNav items={items} role="ADMIN" />}>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="register-teacher" element={<RegisterTeacher />} />
        <Route path="courses" element={<Courses />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="students" element={<Students />} />
        <Route path="*" element={<Navigate to="/admin/home" />} />
      </Routes>
    </Layout>
  )
}
