import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Profile Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The username you're looking for doesn't exist or has been removed.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Go Home
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
          >
            Create Your Page
          </Link>
        </div>
      </div>
    </div>
  )
}
