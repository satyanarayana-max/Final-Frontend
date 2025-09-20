import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { studentService } from "../../services/studentService";
import { marked } from "marked";
import createDOMPurify from "dompurify";

const DOMPurify = typeof window !== "undefined" ? createDOMPurify(window) : { sanitize: (v) => v };
marked.setOptions({ gfm: true, breaks: true });

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [quizzesAvailable, setQuizzesAvailable] = useState(false);

  useEffect(() => {
    if (courseId) loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const sanitizeHtml = (md) => {
    if (!md) return "";
    const html = marked(md);
    return DOMPurify.sanitize(html);
  };

  const loadCourse = async () => {
    try {
      setLoading(true);
      const data = await studentService.getCourseOutline(courseId);
      setCourse(data);
      console.log("Fetched course outline:", data);

      const enrolledRes = await studentService.isEnrolled(courseId);
      setIsEnrolled(enrolledRes.enrolled);

      if (!enrolledRes.enrolled && data.lessons.length > 0) {
        setExpandedLesson(data.lessons[0].id);
      }

      if (enrolledRes.enrolled) {
        try {
          const quizzes = await studentService.getQuizzesByCourse(courseId);
          if (quizzes && quizzes.length > 0) setQuizzesAvailable(true);
        } catch (err) {
          console.error("Failed to load quizzes for course:", err);
        }
      }
    } catch (err) {
      console.error("Error loading course outline:", err);
      toast.error("Failed to load course outline");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (isEnrolled) return;
    try {
      await studentService.enroll(courseId);
      setIsEnrolled(true);
      toast.success("Enrolled successfully!");
      setExpandedLesson(null);

      try {
        const quizzes = await studentService.getQuizzesByCourse(courseId);
        if (quizzes && quizzes.length > 0) setQuizzesAvailable(true);
      } catch (err) {
        console.error("Failed to load quizzes after enrollment:", err);
      }
    } catch (err) {
      console.error("Enroll failed:", err);
      toast.error("Failed to enroll");
    }
  };

  const handleTakeQuiz = () => {
    if (!isEnrolled) {
      toast("Enroll to access the quiz");
    } else if (!quizzesAvailable) {
      toast("No quizzes available for this course");
    } else {
      navigate(`/student/home/quizzes/${courseId}`);
    }
  };

  if (loading) return <Loader />;
  if (!course) return <p className="text-center mt-6">Course not found.</p>;

  return (
    <div className="p-6">
      {/* Hero Banner */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 mb-8 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={course.bannerUrl || "/default-course.jpg"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-center">
            {course.title}
          </h1>
          <div className="flex flex-wrap justify-center space-x-4 text-sm md:text-base">
            <span>⭐ {course.rating || "4.5"}</span>
            <span>{course.totalHours || "20"} hours</span>
            <span>{course.totalLectures || "50"} lectures</span>
            <span>Updated {course.updatedAt || "2/2025"}</span>
          </div>
        </div>
      </div>

      {/* What you'll learn */}
      {course.learningOutcomes?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What you'll learn</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
            {course.learningOutcomes.map((point, idx) => (
              <li
                key={idx}
                className="flex items-start space-x-2 bg-gray-50 p-2 rounded"
              >
                <span className="text-green-600">✔</span>
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(point) }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Course Outline */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Course Outline</h2>
        {course.lessons.map((lesson, index) => {
          const isExpanded = expandedLesson === lesson.id || (!isEnrolled && index === 0);
          const isLocked = !isEnrolled && index > 0;

          return (
            <div key={lesson.id} className="mb-4 border rounded overflow-hidden">
              <button
                className={`w-full flex justify-between items-center px-4 py-3 text-left font-semibold transition ${
                  isLocked
                    ? "bg-gray-100 cursor-not-allowed text-gray-400"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => {
                  if (isLocked) {
                    toast("Enroll to access this lesson");
                    return;
                  }
                  setExpandedLesson(isExpanded ? null : lesson.id);
                }}
              >
                <span>{lesson.title}</span>
                <span>{isExpanded ? "▲" : "▼"}</span>
              </button>

              {isExpanded && (
                <div className="p-4 bg-gray-50 text-gray-700">
                  {lesson.description && (
                    <div
                      className="mb-2"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(lesson.description) }}
                    />
                  )}
                  <ul className="list-disc list-inside">
                    {lesson.videos.map((video) => {
                      const isYouTube = video.type === "youtube";
                      const isFile = video.type === "file" && video.url;

                      return (
                        <li key={video.id} className="mb-4">
                          <p className="font-semibold">{video.title}</p>
                          {isYouTube ? (
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              Watch on YouTube
                            </a>
                          ) : isFile ? (
                            <video
                              src={video.url.startsWith("http") ? video.url : `http://localhost:8080${video.url}`}
                              controls
                              className="w-full max-w-md rounded"
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <span className="text-gray-500">Video not available</span>
                          )}
                          {video.preview && (
                            <span className="text-blue-500 ml-2">(Preview)</span>
                          )}
                        </li>
                      );
                    })}
                    {lesson.videos.length === 0 && <li>No videos added yet.</li>}
                  </ul>
                </div>
              )}
            </div>
          );
        })}

        {/* Take Quiz Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleTakeQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Take Quiz
          </button>
        </div>
      </div>

      {/* Sticky Enroll Button */}
      {!isEnrolled && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleEnroll}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Enroll to Access All Lessons
          </button>
        </div>
      )}
    </div>
  );
}
