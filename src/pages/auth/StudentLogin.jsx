import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import loginIllustration from '../../Images/student-login-illustration.avif'; // Add your image here

export default function StudentLogin() {
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
      const res = await authService.studentLogin(data);
      dispatch(setCredentials({ user: res.user, token: res.token, role: 'STUDENT' }));
      toast.success('Welcome!');
      nav('/student/home');
    } catch (e) {
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4">
      <div className="flex flex-col lg:flex-row items-center gap-12 bg-white p-8 rounded-2xl shadow-2xl max-w-4xl w-full animate-fade-in">
        {/* Illustration */}
        <div className="hidden lg:block w-full lg:w-1/2">
          <img
            src={loginIllustration}
            alt="Student Login Illustration"
            className="w-full h-auto rounded-xl"
          />
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-1/2 space-y-6"
        >
          <h1 className="text-3xl font-bold text-center text-blue-700">Student Login</h1>

          {errorMessage && (
            <div className="text-red-600 text-center font-medium bg-red-100 p-2 rounded">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address'
                }
              })}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              placeholder="••••••••"
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 rounded hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-sm text-center text-gray-600">
            No account?{' '}
            <Link to="/student/register" className="text-blue-600 font-medium hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
