import React from 'react'
import { useNavigate } from 'react-router'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-7xl font-extrabold text-gray-900 tracking-tight">404</h1>

        <p className="mt-4 text-xl font-semibold text-gray-800">Page not found</p>

        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          The page you are trying to access does not exist or may have been moved. Please verify the
          URL or return to a safe location.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Go Back
          </button>

          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            Go to Home
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-400">Error code: 404</div>
      </div>
    </div>
  )
}

export default NotFound
