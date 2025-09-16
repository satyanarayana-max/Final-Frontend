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

  // Load quizzes and courses
  const load = async () => {
    try {
      setLoading(true)

      const quizzes = await teacherService.listQuizzes()
      console.log('📘 Quizzes loaded:', quizzes)

      // Format quizzes to include readable published status
      const formattedQuizzes = quizzes.map(q => ({
        ...q,
        publishedText: q.published ? 'Yes' : 'No',
        courseText: q.courseTitle || '—'
      }))
      setRows(formattedQuizzes)

      const courseData = await teacherService.listCourses()
      console.log('📚 Courses loaded:', courseData)
      setCourses(courseData)

    } catch (err) {
      console.error('❌ Error loading data:', err)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // Create quiz
  const onCreate = async (data) => {
  try {
    const payload = {
      title: data.title,
      courseId: parseInt(data.courseId),
      published: false,
      questions: data.questionsJson ? JSON.parse(data.questionsJson) : []
    }
    console.log('Sending payload:', payload)

    const res = await teacherService.createQuiz(payload)
    console.log('✅ Quiz created:', res)

    toast.success('Quiz created')
    reset()
    load()
  } catch (err) {
    console.error(err.response?.data || err)
    toast.error('Create failed')
  }
}


  // Update quiz
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
      console.error(err.response?.data || err)
      toast.error('Update failed')
    }
  }

  // Delete quiz
  const onDelete = async (row) => {
    if (!confirm('Delete quiz?')) return
    try {
      await teacherService.deleteQuiz(row.id)
      toast.success('Deleted')
      load()
    } catch (err) {
      console.error(err)
      toast.error('Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Quizzes</h2>

      {/* Create form */}
      <form onSubmit={handleSubmit(onCreate)} className="bg-white p-4 rounded shadow space-y-2 max-w-lg">
        <div className="font-medium">Add Quiz</div>
        <input
          {...register('title', { required: true })}
          placeholder="Title"
          className="w-full border rounded px-3 py-2"
        />

        {/* Course dropdown */}
        <select {...register('courseId', { required: true })} className="w-full border rounded px-3 py-2">
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>

        {/* Questions JSON */}
        <textarea
          {...register('questionsJson', { required: true })}
          placeholder='[{"question":"...", "optionA":"...", "optionB":"...", "optionC":"...", "optionD":"...", "correctOption":"A"}]'
          className="w-full border rounded px-3 py-2"
        />

        <button disabled={isSubmitting} className="bg-blue-600 text-white rounded px-4 py-2">
          {isSubmitting ? 'Saving…' : 'Add Quiz'}
        </button>
      </form>

      {/* Quizzes table */}
      {loading ? <Loader /> :
        <Table
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Title', accessor: 'title' },
            { header: 'Course', accessor: 'courseText' },
            { header: 'Published', accessor: 'publishedText' },
          ]}
          data={rows}
          actions={[
            { label: 'Update', onClick: (row) => onUpdate(row) },
            { label: 'Delete', variant: 'danger', onClick: (row) => onDelete(row) }
          ]}
        />
      }
    </div>
  )
}
