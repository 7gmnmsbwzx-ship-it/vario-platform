import { notFound } from 'next/navigation'
import { getUserProfile } from '@/lib/actions/profile'

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const profile = await getUserProfile(username)

  if (!profile) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Profile Container */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            {/* Avatar */}
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white shadow-lg overflow-hidden">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.display_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400">
                  👤
                </div>
              )}
            </div>

            {/* Name and Bio */}
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {profile.display_name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              @{profile.username}
            </p>
            {profile.bio && (
              <p className="text-gray-700 max-w-md mx-auto">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Blocks Section */}
          <div className="space-y-4">
            {/* Placeholder - No blocks yet */}
            <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No content yet
              </h2>
              <p className="text-gray-600">
                {profile.display_name} hasn't added any blocks to their page yet.
              </p>
            </div>

            {/* Sample Blocks (will be replaced with actual blocks from database) */}
            {/* Uncomment when blocks are implemented
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
              <a 
                href="https://example.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center"
              >
                <h3 className="text-lg font-semibold text-gray-900">Sample Link</h3>
              </a>
            </div>
            */}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Powered by{' '}
              <a 
                href="/" 
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Vario
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const profile = await getUserProfile(username)

  if (!profile) {
    return {
      title: 'Profile Not Found',
    }
  }

  return {
    title: `${profile.display_name} (@${profile.username}) - Vario`,
    description: profile.bio || `Check out ${profile.display_name}'s link in bio page`,
  }
}
