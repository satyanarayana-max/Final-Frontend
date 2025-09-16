import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'
import Table from '../../components/Table'
import Loader from '../../components/Loader'
import { useForm } from 'react-hook-form'

export default function Students() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  const load = async () => {
    try {
      setLoading(true)
      const data = await adminService.listStudents()
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

  const onCreate = async (data) => {
    try {
      await adminService.createStudent(data)
      toast.success('Student created')
      reset(); load()
    } catch {
      toast.error('Create failed')
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Students</h2>
      <form onSubmit={handleSubmit(onCreate)} className="bg-white p-4 rounded shadow space-y-2 max-w-lg">
        <div className="font-medium">Register Student</div>
        <input {...register('fullName', { required: true })} placeholder="Name" className="w-full border rounded px-3 py-2" />
        <input {...register('email', { required: true })} placeholder="Email" className="w-full border rounded px-3 py-2" />
        <input {...register('password', { required: true })} placeholder="Temp Password" className="w-full border rounded px-3 py-2" />
        <button disabled={isSubmitting} className="bg-blue-600 text-white rounded px-4 py-2">{isSubmitting ? 'Saving…' : 'Add Student'}</button>
      </form>

      {loading ? <Loader /> : <Table columns={columns} data={rows} actions={[
        { label: 'Update', onClick: (row) => toast('Implement update UI…') },
        { label: 'Delete', variant: 'danger', onClick: async (row) => {
          if (!confirm('Delete student?')) return
          try { await adminService.deleteStudent(row.id); toast.success('Deleted'); load() } catch { toast.error('Delete failed') }
        } }
      ]} />}
    </div>
  )
}
