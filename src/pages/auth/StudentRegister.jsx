import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import registerIllustration from '../../Images/student-login-illustration.avif'; // Replace with your image

export default function StudentRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();
  const nav = useNavigate();

  const onSubmit = async (data) => {
    try {
      await authService.studentRegister(data);
      toast.success('Registered! Please login.');
      nav('/student/login');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4">
      <div className="flex flex-col lg:flex-row items-center gap-12 bg-white p-8 rounded-2xl shadow-2xl max-w-4xl w-full animate-fade-in">
        {/* Illustration */}
        <div className="hidden lg:block w-full lg:w-1/2">
          <img
            src={registerIllustration}
            alt="Student Registration Illustration"
            className="w-full h-auto rounded-xl"
          />
        </div>

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-1/2 space-y-6"
        >
          <h1 className="text-3xl font-bold text-center text-blue-700">Student Registration</h1>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              {...register('fullName', { required: 'Full name is required' })}
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
          </div>

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
              className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 rounded hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            {isSubmitting ? 'Submitting...' : 'Register'}
          </button>

          <div className="text-sm text-center text-gray-600 pt-2">
            Already registered?{' '}
            <Link to="/student/login" className="text-blue-600 font-medium hover:underline">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
