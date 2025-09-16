import http from './http'

export const videoService = {
  addVideo: (lessonId, data) => http.post(`/lessons/${lessonId}/videos`, data).then(r => r.data),
  updateVideo: (id, data) => http.put(`/videos/${id}`, data).then(r => r.data),
  deleteVideo: (id) => http.delete(`/videos/${id}`).then(r => r.data),
  listByLesson: (lessonId) => http.get(`/lessons/${lessonId}/videos`).then(r => r.data),
}
export default videoService
