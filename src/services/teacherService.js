import CreateAptitudeQuestion from '../pages/teacher/CreateAptitudeQuestion';
import http from './http';

export const teacherService = {
  // ----------------- COURSES -----------------
  listCourses: () =>
    http.get('/courses', { withCredentials: true }).then(res => res.data),

  getCourseById: (id) =>
    http.get(`/courses/${id}`, { withCredentials: true }).then(res => res.data),

  getCourseOutline: async (id) => {
    const data = await http.get(`/courses/${id}/outline`, { withCredentials: true }).then(res => res.data);

    // Add `type` field to each video
    if (data.lessons && data.lessons.length > 0) {
      data.lessons.forEach((lesson) => {
        if (lesson.videos && lesson.videos.length > 0) {
          lesson.videos = lesson.videos.map((video) => ({
            ...video,
            type: video.url?.includes("youtube") ? "youtube" : "file"
          }));
        }
      });
    }

    return data;
  },

  createCourse: (formData) =>
    http.post('/courses', formData, { withCredentials: true }).then(res => res.data),

  updateCourse: (id, formData) =>
    http.put(`/courses/${id}`, formData, { withCredentials: true }).then(res => res.data),

  deleteCourse: (id) =>
    http.delete(`/courses/${id}`, { withCredentials: true }).then(res => res.data),

  myCourses: () =>
    http.get('/courses/teacher', { withCredentials: true }).then(res => res.data),

  // ----------------- LESSONS -----------------
  addLesson: (courseId, data) =>
    http.post(`/courses/${courseId}/lessons`, data, { withCredentials: true }).then(res => res.data),

  updateLesson: (lessonId, data) =>
    http.put(`/lessons/${lessonId}`, data, { withCredentials: true }).then(res => res.data),

  deleteLesson: (lessonId) =>
    http.delete(`/lessons/${lessonId}`, { withCredentials: true }).then(res => res.data),

  // ----------------- VIDEOS -----------------
  uploadLessonVideo: (lessonId, formData) =>
    http.post(`/lessons/${lessonId}/videos/upload`, formData, { withCredentials: true }).then(res => res.data),

  addYoutubeVideo: (lessonId, data) =>
    http.post(`/lessons/${lessonId}/videos/youtube`, data, { withCredentials: true }).then(res => res.data),

  listVideos: (lessonId) =>
    http.get(`/lessons/${lessonId}/videos`, { withCredentials: true }).then(res => {
      const videos = res.data.map(video => ({
        ...video,
        type: video.url?.includes("youtube") ? "youtube" : "file"
      }));
      return videos;
    }),

  updateVideo: (videoId, data) =>
    http.put(`/videos/${videoId}`, data, { withCredentials: true }).then(res => res.data),

  deleteVideo: (videoId) =>
    http.delete(`/videos/${videoId}`, { withCredentials: true }).then(res => res.data),

  // ----------------- STUDENTS -----------------
  listStudents: () =>
    http.get('/teacher/students', { withCredentials: true }).then(res => res.data),

  updateStudent: (id, data) =>
    http.put(`/teacher/students/${id}`, data, { withCredentials: true }).then(res => res.data),

  deleteStudent: (id) =>
    http.delete(`/teacher/students/${id}`, { withCredentials: true }).then(res => res.data),

  // ----------------- QUIZZES -----------------
  listQuizzes: () =>
    http.get('/quiz', { withCredentials: true }).then(res => res.data),

  createQuiz: (data) =>
    http.post('/quiz', data, { withCredentials: true }).then(res => res.data),

  updateQuiz: (id, data) =>
    http.put(`/quiz/${id}`, data, { withCredentials: true }).then(res => res.data),

  deleteQuiz: (id) =>
    http.delete(`/quiz/${id}`, { withCredentials: true }).then(res => res.data),

  // ----------------- MONITOR -----------------
  monitorStudent: (studentId) =>
    http.get(`/teacher/monitor/${studentId}`, { withCredentials: true }).then(res => res.data),

  //---------Pratice Questions ------------

  createAptitudeQuestion: (payload) =>
  http.post("aptitude/questions", payload, { withCredentials: true }).then(res => res.data),

  getAptitudeQuestionsBySection: (section) =>
    http.get(`/aptitude/questions?section=${section}`).then(res => res.data),

  deleteAptitudeQuestion: (id) =>
  http.delete(`/aptitude/questions/${id}`).then(res => res.data),


createCodingQuestion: (payload) =>
  http.post("coding/questions", payload, { withCredentials: true }).then(res => res.data),

getAllCodingQuestions: () =>
  http.get("coding/questions").then(res => res.data),

deleteCodingQuestion: (id) =>
  http.delete(`/coding/questions/${id}`).then(res => res.data),



};
