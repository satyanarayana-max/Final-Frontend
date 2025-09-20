// src/components/TopNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import loginIllustration from '../Images/T-Logo.png';

export default function TopNav({ items = [], role = '' }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth?.user);

  return (
    <header className="bg-white text-gray-800 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo + Role + Navigation */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-25 h-20 flex-shrink-0">
              <img
                src={loginIllustration}
                alt="Logo"
                className="w-full h-full object-contain"
                width={64}
                height={48}
                loading="eager"
              />
            </div>
            <span className="text-lg font-bold tracking-wide truncate max-w-xs">
              {role}
            </span>
          </div>

          <nav className="flex gap-2 items-center">
            {items.map((it) => {
              const isActive = pathname === it.to;
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative text-sm font-medium transition rounded-full px-3 py-1
                    ${isActive
                      ? 'text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-indigo-100 hover:via-purple-100 hover:to-pink-100'}
                    focus:outline-none focus:ring-2 focus:ring-indigo-200`}
                >
                  <span className="whitespace-nowrap">{it.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: User Info + Logout */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <img
                src={user.avatar || '/images/user-avatar.png'}
                alt="User Avatar"
                className="w-8 h-8 rounded-full border-2 border-gray-200 object-cover"
              />
              <span className="text-sm font-medium truncate max-w-[150px]">
                {user.username || user.email || 'Student'}
              </span>
            </div>
          )}

          <button
            onClick={() => dispatch(logout())}
            className="text-sm bg-gray-100 text-red-600 hover:bg-gray-200 px-3 py-1 rounded transition"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
