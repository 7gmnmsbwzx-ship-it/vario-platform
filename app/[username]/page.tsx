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
                // Text block
                if (block.type === 'text') {
                  return (
                    <div
                      key={block.id}
                      className="bg-white rounded-xl p-6 shadow-lg"
                    >
                      {block.content.heading && (
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {block.content.heading}
                        </h3>
                      )}
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {block.content.text || block.content.content}
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

                // Button/Link block
                if (block.type === 'button' || block.type === 'link') {
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
                            <span className="text-2xl">{block.content.icon}</span>
                          )}
                          <span className="text-lg font-semibold text-gray-900">
                            {block.content.title || block.content.label}
                          </span>
                        </div>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </a>
                  )
                }

                // Social Links block
                if (block.type === 'social_links') {
                  return (
                    <div
                      key={block.id}
                      className="bg-white rounded-xl p-6 shadow-lg"
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                        Connect with me
                      </h3>
                      <div className="flex flex-wrap justify-center gap-4">
                        {block.content.links?.map((link: any, idx: number) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                          >
                            <span className="text-xl">{link.icon || '🔗'}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )
                }

                // Embed block
                if (block.type === 'embed') {
                  return (
                    <div
                      key={block.id}
                      className="bg-white rounded-xl overflow-hidden shadow-lg"
                    >
                      <div className="aspect-video">
                        <iframe
                          src={block.content.url}
                          className="w-full h-full"
                          allowFullScreen
                          title={block.content.title || 'Embedded content'}
                        />
                      </div>
                      {block.content.caption && (
                        <p className="p-4 text-center text-gray-600">
                          {block.content.caption}
                        </p>
                      )}
                    </div>
                  )
                }

                // AI Chat block (placeholder - would need actual implementation)
                if (block.type === 'ai_chat') {
                  return (
                    <div
                      key={block.id}
                      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-lg border-2 border-indigo-200"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">🤖</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {block.content.title || 'AI Chat'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {block.content.description || 'Chat with AI assistant'}
                        </p>
                        <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                          Start Chat
                        </button>
                      </div>
                    </div>
                  )
                }

                // Default fallback for unknown types
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
