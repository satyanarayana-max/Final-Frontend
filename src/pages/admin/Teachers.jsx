import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';
import Table from '../../components/Table';
import Loader from '../../components/Loader';
import { useForm } from 'react-hook-form';

export default function Teachers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminService.listTeachers();
      setRows(data);
    } catch {
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'fullName' },
    { header: 'Email', accessor: 'email' },
  ];

  const onCreate = async (data) => {
    try {
      await adminService.createTeacher(data);
      toast.success('Teacher created');
      reset();
      load();
    } catch {
      toast.error('Create failed');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Teachers</h2>

      {/* Register Teacher Form */}
      <form onSubmit={handleSubmit(onCreate)} className="bg-white p-4 rounded shadow space-y-2 max-w-lg">
        <div className="font-medium">Register Teacher</div>

        <div>
          <input
            {...register('fullName', { required: 'Name is required' })}
            placeholder="Name"
            className="w-full border rounded px-3 py-2"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address'
              }
            })}
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <input
            {...register('password', {
              required: 'Temporary password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            placeholder="Temp Password"
            type="password"
            className="w-full border rounded px-3 py-2"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button disabled={isSubmitting} className="bg-blue-600 text-white rounded px-4 py-2">
          {isSubmitting ? 'Saving…' : 'Add Teacher'}
        </button>
      </form>

      {/* Teachers List */}
      {loading ? (
        <Loader />
      ) : (
        <Table
          columns={columns}
          data={rows}
          actions={[
            {
              label: 'Update',
              onClick: (row) => toast('Implement update UI…')
            },
            {
              label: 'Delete',
              variant: 'danger',
              onClick: async (row) => {
                if (!confirm('Delete teacher?')) return;
                try {
                  await adminService.deleteTeacher(row.id);
                  toast.success('Deleted');
                  load();
                } catch {
                  toast.error('Delete failed');
                }
              }
            }
          ]}
        />
      )}
    </div>
  );
}
