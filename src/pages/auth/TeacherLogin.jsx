import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function TeacherLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      const res = await authService.teacherLogin(data);
      dispatch(setCredentials({ user: res.user, token: res.token, role: 'TEACHER' }));
      toast.success('Welcome, Teacher!');
      nav('/teacher/home');
    } catch (e) {
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-3">
        {errorMessage && (
          <div className="text-red-500 text-center font-medium">
            {errorMessage}
          </div>
        )}
        <h1 className="text-xl font-semibold text-center">Teacher Login</h1>

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
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            placeholder="Password"
            type="password"
            className="w-full border rounded px-3 py-2"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button disabled={isSubmitting} className="w-full bg-blue-600 text-white rounded py-2">
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
