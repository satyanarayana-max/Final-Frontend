import { useForm } from 'react-hook-form'
import { adminService } from '../../services/adminService'
import toast from 'react-hot-toast'

export default function RegisterTeacher() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await adminService.createTeacher(data)
      toast.success('Teacher registered')
      reset()
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to register')
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-semibold mb-4">Register Teacher</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 bg-white p-4 rounded shadow">
        <input {...register('fullName', { required: true })} placeholder="Name" className="w-full border rounded px-3 py-2" />
        <input {...register('email', { required: true })} placeholder="Email" className="w-full border rounded px-3 py-2" />
        <input {...register('password', { required: true })} placeholder="Temp Password" className="w-full border rounded px-3 py-2" />
        <button disabled={isSubmitting} className="bg-blue-600 text-white rounded px-4 py-2">{isSubmitting ? 'Saving...' : 'Register'}</button>
      </form>
    </div>
  )
}
