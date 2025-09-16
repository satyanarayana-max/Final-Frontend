import http from './http';

export const authService = {
  adminLogin: (data) => http.post('/auth/admin/login', data).then(r => r.data),
  teacherLogin: (data) => http.post('/auth/teacher/login', data).then(r => r.data),
  studentLogin: (data) => http.post('/auth/student/login', data).then(r => r.data),
  studentRegister: (data) => http.post('/auth/student/register', data).then(r => r.data),
};
