import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { teacherService } from "../../services/teacherService";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";
import { marked } from "marked";
import createDOMPurify from "dompurify";

const DOMPurify = typeof window !== "undefined" ? createDOMPurify(window) : { sanitize: (v) => v };

marked.setOptions({ gfm: true, breaks: true });

export default function CourseOutline() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // NEW: which lesson is expanded (null = none)
  const [expandedLesson, setExpandedLesson] = useState(null);

  useEffect(() => {
    if (courseId) loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    if (!courseId) {
      toast.error("Invalid course ID");
      return;
    }

    try {
      setLoading(true);
      const data = await teacherService.getCourseOutline(courseId);
      setCourse(data);
    } catch (err) {
      console.error("Error loading course outline:", err);
      toast.error("Failed to load course outline");
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (mdText) => {
    if (!mdText) return "";
    const html = marked(mdText);
    return DOMPurify.sanitize(html);
  };

  if (loading) return <Loader />;
  if (!course) return <p>Course not found.</p>;

  return (
    <div className="p-4">
      {/* Banner */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 mb-6 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={course.bannerUrl || "/default-course.jpg"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
            {course.title}
          </h1>
        </div>
      </div>

      {/* Description */}
      <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
      <div
        className="text-gray-700 mb-6"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(course.description) }}
      />

      {/* Lessons */}
      {course.lessons.length === 0 ? (
        <p>No lessons added yet.</p>
      ) : (
        course.lessons.map((lesson, index) => {
          const isExpanded = expandedLesson === lesson.id;
          return (
            <div key={lesson.id} className="mb-6 border rounded shadow overflow-hidden">
              {/* Header: clickable to toggle */}
              <button
                type="button"
                onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}
                className={`w-full flex justify-between items-center px-4 py-3 text-left font-semibold transition ${
                  isExpanded ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                }`}
              >
                <div>
                  <span className="text-lg">{lesson.title}</span>
                  <div className="text-sm text-gray-500">{lesson.order ? `Order ${lesson.order}` : null}</div>
                </div>
                <div className="text-gray-600">{isExpanded ? "▲" : "▼"}</div>
              </button>

              {/* Content: description + videos */}
              {isExpanded && (
                <div className="p-4 bg-gray-50 text-gray-700">
                  {lesson.description && (
                    <div
                      className="text-sm mb-3"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.description) }}
                    />
                  )}

                  {(!lesson.videos || lesson.videos.length === 0) ? (
                    <p className="text-gray-500">No videos in this lesson.</p>
                  ) : (
                    <ul className="list-disc list-inside">
                      {lesson.videos.map((video) => {
                        const isYouTube = video.type === "youtube";
                        const isFile = video.type === "file" && video.url;

                        return (
                          <li key={video.id} className="mb-4">
                            {isYouTube ? (
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                              >
                                {video.title || video.url} (YouTube Link)
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
                              <span>{video.title}</span>
                            )}

                            {video.preview && (
                              <span className="text-blue-500 ml-2">(Preview)</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
