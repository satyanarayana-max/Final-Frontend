import http from './http'

export const adminService = {
  // Teachers
  listTeachers: () => http.get('/admin/teachers').then(r => r.data),
  createTeacher: (data) => http.post('/admin/teachers', data).then(r => r.data),
  updateTeacher: (id, data) => http.put(`/admin/teachers/${id}`, data).then(r => r.data),
  deleteTeacher: (id) => http.delete(`/admin/teachers/${id}`).then(r => r.data),
  // Students
  listStudents: () => http.get('/admin/students').then(r => r.data),
  createStudent: (data) => http.post('/admin/students', data).then(r => r.data),
  updateStudent: (id, data) => http.put(`/admin/students/${id}`, data).then(r => r.data),
  deleteStudent: (id) => http.delete(`/admin/students/${id}`).then(r => r.data),
  // Courses
  listCourses: () => http.get('/courses').then(r => r.data),
  updateCourse: (id, data) => http.put(`courses/${id}`, data).then(r => r.data),
  deleteCourse: (id) => http.delete(`courses/${id}`).then(r => r.data),
}
