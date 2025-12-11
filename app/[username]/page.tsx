import { notFound } from 'next/navigation'
import { getUserProfile } from '@/lib/actions/profile'
import { getUserBlocks } from '@/lib/actions/blocks'
import type { UserProfile } from '@/types/database.types'

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const profile = await getUserProfile(username) as UserProfile | null

  if (!profile) {
    notFound()
  }

  // Fetch user's blocks
  const blocks = await getUserBlocks(profile.id)

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
            {blocks.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No content yet
                </h2>
                <p className="text-gray-600">
                  {profile.display_name} hasn't added any blocks to their page yet.
                </p>
              </div>
            ) : (
              blocks.map((block: any) => {
                // Link block
                if (block.type === 'link') {
                  return (
                    <a
                      key={block.id}
                      href={block.content.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {block.content.icon && (
                            <i className={`${block.content.icon} text-2xl text-indigo-600`}></i>
                          )}
                          <span className="text-lg font-semibold text-gray-900">
                            {block.content.title}
                          </span>
                        </div>
                        <i className="fas fa-arrow-right text-gray-400"></i>
                      </div>
                    </a>
                  )
                }

                // Text block
                if (block.type === 'text') {
                  return (
                    <div
                      key={block.id}
                      className="bg-white rounded-xl p-6 shadow-lg"
                    >
                      <p className="text-gray-700 text-center whitespace-pre-wrap">
                        {block.content.content || block.content.text}
                      </p>
                    </div>
                  )
                }

                // Image block
                if (block.type === 'image') {
                  return (
                    <div
                      key={block.id}
                      className="bg-white rounded-xl overflow-hidden shadow-lg"
                    >
                      <img
                        src={block.content.url}
                        alt={block.content.alt || 'Image'}
                        className="w-full h-auto"
                      />
                      {block.content.caption && (
                        <p className="p-4 text-center text-gray-600">
                          {block.content.caption}
                        </p>
                      )}
                    </div>
                  )
                }

                // Default fallback for other types
                return null
              })
            )}
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
  const profile = await getUserProfile(username) as UserProfile | null

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
