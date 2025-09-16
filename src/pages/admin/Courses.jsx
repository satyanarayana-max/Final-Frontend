import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'
import Table from '../../components/Table'
import Loader from '../../components/Loader'

export default function Courses() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      setLoading(true)
      const data = await adminService.listCourses()
      setRows(data)
    } catch {
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Title', accessor: 'title' },
    { header: 'Teacher', accessor: 'teacherName' },
  ]

  if (loading) return <Loader />

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Courses</h2>
      <Table columns={columns} data={rows} actions={[
        { label: 'Update', onClick: () => toast('Implement update UI…') },
        { label: 'Delete', variant: 'danger', onClick: async (row) => {
          if (!confirm('Delete course?')) return
          try { await adminService.deleteCourse(row.id); toast.success('Deleted'); load() } catch { toast.error('Delete failed') }
        } }
      ]} />
    </div>
  )
}
