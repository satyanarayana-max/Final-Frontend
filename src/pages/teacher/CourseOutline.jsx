import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { teacherService } from "../../services/teacherService";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

export default function CourseOutline() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <p className="text-gray-700 mb-6">{course.description}</p>

      {/* Lessons */}
      {course.lessons.length === 0 ? (
        <p>No lessons added yet.</p>
      ) : (
        course.lessons.map((lesson) => (
          <div key={lesson.id} className="mb-6 border p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
            {lesson.description && (
              <p className="text-gray-600 mb-2">{lesson.description}</p>
            )}

            {lesson.videos.length === 0 ? (
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
                          {video.title} (YouTube Link)
                        </a>
                      ) : isFile ? (
                        <video
                          src={`http://localhost:8080${video.url}`}
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
        ))
      )}
    </div>
  );
}
