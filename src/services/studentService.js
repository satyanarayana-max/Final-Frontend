import http from './http'

export const studentService = {
  getCourseDetails: (courseId) =>
    http.get(`/courses/${courseId}`, { withCredentials: true }).then(r => r.data),

  enroll: (courseId) =>
    http.post(`${courseId}/enroll`, {}, { withCredentials: true }).then(r => r.data),

  isEnrolled: (courseId) =>
    http.get(`${courseId}/isEnrolled`, { withCredentials: true }).then(r => r.data),

  myCourses: () =>
    http.get('/courses', { withCredentials: true }).then(r => r.data),

  myQuizzes: () =>
    http.get('/quiz', { withCredentials: true }).then(r => r.data),

  performance: () =>
    http.get('/performance', { withCredentials: true }).then(r => r.data),

  listCourses: () =>
    http.get('/courses', { withCredentials: true }).then(res => res.data),

  getCourseById: (id) =>
    http.get(`/courses/${id}`, { withCredentials: true }).then(res => res.data),

  getCourseOutline: async (id) => {
    const data = await http.get(`/courses/${id}/outline`, { withCredentials: true }).then(res => res.data);

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

  uploadLessonVideo: (lessonId, formData) =>
    http.post(`/lessons/${lessonId}/videos/upload`, formData, { withCredentials: true }).then(res => res.data),

  addYoutubeVideo: (lessonId, data) =>
    http.post(`/lessons/${lessonId}/videos/youtube`, data, { withCredentials: true }).then(res => res.data),

  listVideos: (lessonId) =>
    http.get(`/lessons/${lessonId}/videos`, { withCredentials: true }).then(res => {
      return res.data.map(video => ({
        ...video,
        type: video.url?.includes("youtube") ? "youtube" : "file"
      }));
    }),

  updateVideo: (videoId, data) =>
    http.put(`/videos/${videoId}`, data, { withCredentials: true }).then(res => res.data),

  deleteVideo: (videoId) =>
    http.delete(`/videos/${videoId}`, { withCredentials: true }).then(res => res.data),

  // ---------------- Quiz Methods ----------------
   getQuizzesByCourse(courseId) {
    return http
      .get(`/quiz/courses/${courseId}`, { withCredentials: true })
      .then(res => res.data)
      .catch(err => {
        console.error(`Error fetching quizzes for course ${courseId}:`, err);
        throw err;
      });
  },

  takeQuiz(quizId) {
    return http
      .get(`/quiz/${quizId}/attempt`, { withCredentials: true })
      .then(res => res.data)
      .catch(err => {
        console.error(`Error attempting quiz ${quizId}:`, err);
        throw err;
      });
  },

  submitQuiz(payload) {
    return http
      .post('/quiz/submit', payload, { withCredentials: true })
      .then(res => res.data)
      .catch(err => {
        console.error('Error submitting quiz:', err);
        if (err.response) {
          console.error('Server response:', err.response.data);
          console.error('Status:', err.response.status);
        }
        throw err;
      });
  },

  getQuizSubmission(quizId) {
    return http
      .get(`/quiz/${quizId}/submission`, { withCredentials: true })
      .then(res => res.data)
      .catch(err => {
        console.error(`Error fetching submission for quiz ${quizId}:`, err);
        throw err;
      });
  },
    // ----------------- Coding Challenges -----------------

    getCodingTopics: () =>
    http.get("/coding/topics").then(res => res.data),

  getQuestionsByTopic: (topic) =>
    http.get(`/coding/questions/by-topic?topic=${topic}`).then(res => res.data),

  getQuestionDetails: (id) =>
    http.get(`/coding/questions/${id}`).then(res => res.data),

  submitCode: (payload) =>
    http.post(`/coding/submit`, payload).then(res => res.data),


  // ----------------- Aptitude Questions -----------------
  
  getAptitudeQuestionsBySection: (section) =>
    http.get(`/aptitude/questions?section=${section}`).then(res => res.data),
submitAptitudeAnswer: (payload) =>
  http.post(`/aptitude/submit`, payload, { withCredentials: true }).then(res => res.data),
getSubmissionStatus: (questionId) =>
  http.get(`/aptitude/submission-status?questionId=${questionId}`, { withCredentials: true }).then(res => res.data),

// ----------------- Leaderboard -----------------
getLeaderboard: () =>
  http.get('/leaderboard', { withCredentials: true })
    .then(res => res.data)
    .catch(err => {
      console.error('Error fetching leaderboard:', err);
      throw err;
    }),

getMyLeaderboard: () =>
  http.get('/leaderboard/me', { withCredentials: true })
    .then(res => res.data)
    .catch(err => {
      console.error('Error fetching leaderboard for current user:', err);
      throw err;
    }),



}
