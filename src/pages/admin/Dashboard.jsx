import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const cards = [
    { label: 'Teachers', to: '/admin/home/teachers' },
    { label: 'Students', to: '/admin/home/students' },
    { label: 'Courses', to: '/admin/home/courses' },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Overview</h1>
      <p className="text-gray-600">Use the sidebar to manage teachers, students, and courses.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            onClick={() => navigate(card.to)}
            className="bg-white rounded shadow p-4 cursor-pointer hover:shadow-lg transition"
          >
            <div className="text-gray-500 text-sm">{card.label}</div>
            <div className="text-3xl font-bold">→</div>
          </div>
        ))}
      </div>
    </div>
  )
}
