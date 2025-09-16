import http from './http'

export const lessonService = {
  addLesson: (courseId, data) => http.post(`/courses/${courseId}/lessons`, data).then(r => r.data),
  updateLesson: (id, data) => http.put(`/lessons/${id}`, data).then(r => r.data),
  deleteLesson: (id) => http.delete(`/lessons/${id}`).then(r => r.data),
  listByCourse: (courseId) => http.get(`/courses/${courseId}/lessons`).then(r => r.data),
}
export default lessonService
