import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export default function TopNav({ items, role }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  return (
    <header className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo + Role + Navigation */}
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold tracking-wide">CLP {role}</span>
          <nav className="flex gap-4">
            {items.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                className={`text-sm font-medium transition ${
                  pathname === it.to
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {it.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: User Info + Logout */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <img
                src="/images/user-avatar.png" // Replace with actual avatar path
                alt="User Avatar"
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <span className="text-sm font-medium truncate max-w-[150px]">
                {user.username || user.email || 'Student'}
              </span>
            </div>
          )}
          <button
            onClick={() => dispatch(logout())}
            className="text-sm bg-white text-red-600 hover:bg-red-100 px-3 py-1 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
