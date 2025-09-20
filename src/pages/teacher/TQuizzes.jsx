import { useEffect, useState } from 'react'
import { teacherService } from '../../services/teacherService'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import Table from '../../components/Table'
import Loader from '../../components/Loader'

export default function TQuizzes() {
  const [rows, setRows] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  const load = async () => {
    try {
      setLoading(true)
      const quizzes = await teacherService.listQuizzes()
      const formattedQuizzes = quizzes.map(q => ({
        ...q,
        publishedText: q.published ? '✅ Published' : '❌ Unpublished',
        courseText: q.courseTitle || '—'
      }))
      setRows(formattedQuizzes)

      const courseData = await teacherService.listCourses()
      setCourses(courseData)
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onCreate = async (data) => {
    try {
      const payload = {
        title: data.title,
        courseId: parseInt(data.courseId),
        published: false,
        questions: data.questionsJson ? JSON.parse(data.questionsJson) : []
      }
      await teacherService.createQuiz(payload)
      toast.success('Quiz created')
      reset()
      load()
    } catch (err) {
      toast.error('Create failed')
    }
  }

  const onUpdate = async (row) => {
    try {
      const newTitle = prompt('Enter new title', row.title)
      if (!newTitle) return
      const newQuestions = prompt('Enter updated questions JSON', JSON.stringify(row.questions || []))
      if (!newQuestions) return
      const payload = {
        title: newTitle,
        published: row.published,
        questions: JSON.parse(newQuestions)
      }
      await teacherService.updateQuiz(row.id, payload)
      toast.success('Quiz updated')
      load()
    } catch (err) {
      toast.error('Update failed')
    }
  }

  const onDelete = async (row) => {
    if (!confirm('Delete quiz?')) return
    try {
      await teacherService.deleteQuiz(row.id)
      toast.success('Deleted')
      load()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white shadow-xl rounded-xl p-6 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Manage Quizzes</h2>
        <p className="text-gray-600 mb-6">Create, update, and delete quizzes for your courses.</p>

        {/* Create form */}
        <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
          <div className="grid gap-4">
            <input
              {...register('title', { required: true })}
              placeholder="Quiz Title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              {...register('courseId', { required: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>

            <textarea
              {...register('questionsJson', { required: true })}
              placeholder='[{"question":"...", "optionA":"...", "optionB":"...", "optionC":"...", "optionD":"...", "correctOption":"A"}]'
              className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            disabled={isSubmitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Saving…' : 'Add Quiz'}
          </button>
        </form>
      </div>

      {/* Quizzes table */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Quiz List</h3>
        {loading ? (
          <Loader />
        ) : (
          <Table
            columns={[
              { header: 'ID', accessor: 'id' },
              { header: 'Title', accessor: 'title' },
              { header: 'Course', accessor: 'courseText' },
              { header: 'Status', accessor: 'publishedText' },
            ]}
            data={rows}
            actions={[
              {
                label: 'Update',
                onClick: (row) => onUpdate(row),
                className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition px-3 py-1 rounded-full text-sm font-medium'
              },
              {
                label: 'Delete',
                variant: 'danger',
                onClick: (row) => onDelete(row),
                className: 'bg-red-100 text-red-800 hover:bg-red-200 transition px-3 py-1 rounded-full text-sm font-medium'
              }
            ]}
            rowClassName="hover:bg-gray-50 transition duration-200"
          />
        )}
      </div>
    </div>
  )
}
