import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teacherService } from '../../services/teacherService';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

export default function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openLessonId, setOpenLessonId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (courseId) loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getCourseOutline(courseId);

      // ✅ Debug: print course data to console
      console.log('Fetched course details:', data);

      setCourse(data);
    } catch (err) {
      console.error('Error loading course details:', err);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!course) return <p className="text-center text-red-500">Course not found.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Banner / Thumbnail */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 mb-6 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={course.bannerUrl || course.thumbnailUrl || '/default-course.jpg'}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {/* Overlay title */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
            {course.title}
          </h1>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-6">{course.description}</p>

      {/* Instructor */}
      {course.instructor && (
        <div className="flex items-center mb-8">
          <img
            src={course.instructor.avatarUrl || '/default-avatar.png'}
            alt={course.instructor.name}
            className="w-14 h-14 rounded-full mr-4 object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg">{course.instructor.name}</h3>
            <p className="text-gray-500 text-sm">Instructor</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => toast.success('Enrolled successfully!')} // Replace with API
          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
        >
          Enroll Now
        </button>
        <button
          onClick={() => navigate('/teacher/home/allcourses')}
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 transition"
        >
          Back to Courses
        </button>
      </div>

      {/* Course Outline */}
      <h3 className="text-2xl font-semibold mb-4">Course Outline</h3>
      {course.lessons.length === 0 ? (
        <p className="text-gray-500">No lessons added yet.</p>
      ) : (
        <div className="space-y-4">
          {course.lessons.map(lesson => (
            <div
              key={lesson.id}
              className="border rounded-xl shadow-sm bg-white overflow-hidden"
            >
              {/* Lesson Header */}
              <button
                onClick={() =>
                  setOpenLessonId(openLessonId === lesson.id ? null : lesson.id)
                }
                className="w-full text-left px-4 py-3 flex justify-between items-center bg-gray-100 hover:bg-gray-200"
              >
                <h3 className="text-lg font-semibold">{lesson.title}</h3>
                <span className="text-sm text-gray-500">
                  {openLessonId === lesson.id ? '▲' : '▼'}
                </span>
              </button>

              {/* Lesson Content */}
              {openLessonId === lesson.id && (
                <div className="p-4 space-y-3">
                  {lesson.description && (
                    <p className="text-gray-600">{lesson.description}</p>
                  )}

                  {lesson.videos.length === 0 ? (
                    <p className="text-gray-500">No videos in this lesson.</p>
                  ) : (
                    <ul className="space-y-3">
                      {lesson.videos.map(video => (
                        <li
                          key={video.id}
                          className="flex items-center gap-4 p-2 border rounded-lg hover:bg-gray-50"
                        >
                          {video.thumbnailUrl && (
                            <img
                              src={`http://localhost:8080/uploads/${video.thumbnailUrl}`}
                              alt={video.title}
                              className="w-28 h-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{video.title}</p>
                            {video.preview && (
                              <span className="text-sm text-blue-500">
                                Preview Available
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
