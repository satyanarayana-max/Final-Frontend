import { useEffect, useState } from 'react'
import { teacherService } from '../../services/teacherService'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loader from '../../components/Loader'

export default function TeacherMyCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const data = await teacherService.myCourses()
      setCourses(data)
    } catch (err) {
      console.error("Error loading teacher courses:", err)
      toast.error('Failed to load your courses')
    } finally {
      setLoading(false)
    }
  }

  // ✅ delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return
    try {
      await teacherService.deleteCourse(id)
      toast.success("Course deleted successfully")
      setCourses((prev) => prev.filter((c) => c.id !== id)) // remove from UI
    } catch (err) {
      console.error("Delete failed:", err)
      toast.error("Failed to delete course")
    }
  }

  // ✅ update handler (navigate to update page)
  const handleUpdate = (id) => {
    navigate(`/teacher/home/courses/${id}/edit`) 
  }

  if (loading) return <Loader />

  return (
    <div className="p-4">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">My Created Courses</h2>

  {courses.length === 0 ? (
    <p className="text-gray-600 italic">You haven’t created any courses yet.</p>
  ) : (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <li
          key={course.id}
          className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-200"
        >
          {/* Thumbnail / Banner */}
          {course.thumbnailUrl && (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
          )}

          {/* Course Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {course.description}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() =>
                navigate(`/teacher/home/courses/${course.id}/outline`)
              }
              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm"
            >
              View Outline
            </button>

            <button
              onClick={() => handleUpdate(course.id)}
              className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 text-sm"
            >
              Update
            </button>

            <button
              onClick={() => handleDelete(course.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>
  )
}
