import { useEffect, useState } from 'react'
import { teacherService } from '../../services/teacherService'
import toast from 'react-hot-toast'
import Table from '../../components/Table'
import Loader from '../../components/Loader'

export default function TStudents() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      setLoading(true)
      const data = await teacherService.listStudents()
      console.log('Fetched students:', data)
      setRows(data)
    } catch {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'fullName' },
    { header: 'Email', accessor: 'email' },
  ]

  const actions = [
    {
      label: 'Edit',
      onClick: () => toast('Implement edit UI…'),
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition px-3 py-1 rounded-full text-sm font-medium'
    },
    {
      label: 'Delete',
      variant: 'danger',
      onClick: async (row) => {
        if (!confirm('Delete student?')) return
        try {
          await teacherService.deleteStudent(row.id)
          toast.success('Deleted')
          load()
        } catch {
          toast.error('Delete failed')
        }
      },
      className: 'bg-red-100 text-red-800 hover:bg-red-200 transition px-3 py-1 rounded-full text-sm font-medium'
    }
  ]

  return loading ? (
    <Loader />
  ) : (
    <div className="p-6 space-y-6">
      <div className="bg-white shadow-xl rounded-xl p-6 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">👩‍🎓 Students List</h2>
        <p className="text-gray-600 mb-6">Manage your enrolled students with ease. You can edit or delete records below.</p>

        <Table
          columns={columns}
          data={rows}
          actions={actions}
          rowClassName="hover:bg-gray-50 transition duration-200"
        />
      </div>
    </div>
  )
}
