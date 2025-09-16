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
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
  ]

  return loading ? <Loader /> : (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Students</h2>
      <Table columns={columns} data={rows} actions={[
        { label: 'Edit', onClick: () => toast('Implement edit UI…') },
        { label: 'Delete', variant: 'danger', onClick: async (row) => {
          if (!confirm('Delete student?')) return
          try { await teacherService.deleteStudent(row.id); toast.success('Deleted'); load() } catch { toast.error('Delete failed') }
        } }
      ]} />
    </div>
  )
}
