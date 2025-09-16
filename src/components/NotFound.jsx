import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold">404</h1>
        <p className="text-gray-600 mt-2">Page not found</p>
        <Link to="/" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded">Go Home</Link>
      </div>
    </div>
  )
}
