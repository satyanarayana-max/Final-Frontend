# College Learning Platform — React Frontend

React 18 + Vite + Tailwind + Redux Toolkit + Axios (JWT) + React Router v6 + react-hook-form + react-hot-toast.

## Quick Start

```bash
# 1) Install deps
npm i

# 2) Configure API URL
cp .env.example .env
# edit .env with your backend base url

# 3) Run
npm run dev
```

## Environment

Create `.env` and set:

```
VITE_API_URL=http://localhost:8080/api
```

## Notes

- JWT is stored in `localStorage` and attached via Axios interceptor.
- Routes are protected with `ProtectedRoute` and `RoleGuard` (ADMIN/TEACHER/STUDENT).
- Sidebar is collapsible and role-based per dashboard.
- Add/Update forms use `react-hook-form`.
- Success/error notifications via `react-hot-toast`.
- Loading states use a simple spinner component.
- API endpoints are in `src/services/*.js`; tweak them to match your backend.
