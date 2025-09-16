import { useState } from 'react'
import { teacherService } from '../../services/teacherService'
import toast from 'react-hot-toast'

export default function Monitor() {
  const [studentId, setStudentId] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSearch = async () => {
    if (!studentId) return
    try {
      setLoading(true)
      const res = await teacherService.monitorStudent(studentId)
      setData(res)
    } catch {
      toast.error('Failed to fetch data')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Monitor Student</h2>
      <div className="flex gap-2">
        <input value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="Enter Student ID" className="border rounded px-3 py-2" />
        <button onClick={onSearch} className="bg-blue-600 text-white rounded px-4">Search</button>
      </div>

      {loading && <div className="loader" />}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded shadow p-4">
            <div className="font-medium mb-2">Enrolled Courses</div>
            <ul className="list-disc list-inside text-sm">
              {data.courses?.map(c => <li key={c.id}>{c.title}</li>)}
            </ul>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="font-medium mb-2">Quizzes</div>
            <ul className="list-disc list-inside text-sm">
              {data.quizzes?.map(q => <li key={q.id}>{q.title} — {q.score ?? '—'}%</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
