import { useEffect, useState } from 'react'
import { studentService } from '../../services/studentService'
import toast from 'react-hot-toast'
import Loader from '../../components/Loader'
import { Link } from 'react-router-dom'

export default function MyCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const allCourses = await studentService.myCourses()

        const enrollmentChecks = await Promise.all(
          allCourses.map(course => studentService.isEnrolled(course.id))
        )

        const enrolledCourses = allCourses.filter((course, idx) => enrollmentChecks[idx].enrolled)

        setCourses(enrolledCourses)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load enrolled courses')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Loader />

  if (!courses.length)
    return (
      <div className="text-center mt-10 text-gray-600">
        You are not enrolled in any courses yet.
      </div>
    )

  return (
    <div className="px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map(course => (
          <div
            key={course.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col"
          >
            {/* Course Thumbnail */}
            <div className="h-40 overflow-hidden rounded-t-2xl">
              <img
                src={course.thumbnailUrl || course.bannerUrl || '/default-course.jpg'}
                alt={course.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Course Info */}
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold mb-2 line-clamp-2">{course.title}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {course.description || 'No description available.'}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <Link
                  to={`/student/home/courses/${course.id}`}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition text-sm font-medium"
                >
                  View Details
                </Link>
                <span className="text-sm font-medium text-green-600">{course.level || 'Beginner'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
