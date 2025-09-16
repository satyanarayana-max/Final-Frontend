import http from './http'

export const courseService = {
  getOutline: (courseId) => http.get(`/courses/${courseId}/outline`).then(r => r.data),
  getCourse: (courseId) => http.get(`/courses/${courseId}`).then(r => r.data),
}
export default courseService
