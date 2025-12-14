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
  
  // Group blocks by type for better layout
  const socialLinks = blocks.find((b: any) => b.type === 'social_links')
  const aiChat = blocks.find((b: any) => b.type === 'ai_chat')
  const otherBlocks = blocks.filter((b: any) => b.type !== 'social_links' && b.type !== 'ai_chat')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          {/* Left Sidebar - Profile Section */}
          <div className="space-y-4">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              {/* Avatar */}
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 shadow-xl overflow-hidden ring-4 ring-white">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    👤
                  </div>
                )}
              </div>

              {/* Name and Title */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {profile.display_name}
                </h1>
                <p className="text-gray-600 text-sm mb-4">
                  → {profile.bio || 'Creator & Designer'}
                </p>
              </div>

              {/* Bio Description */}
              {profile.bio && (
                <p className="text-gray-700 text-sm leading-relaxed mb-6 text-center">
                  {profile.bio}
                </p>
              )}

              {/* Contact */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
                <span>🤝</span>
                <span>business: contact@example.com</span>
              </div>

              {/* AI Chat Widget - Below Profile */}
              {aiChat && (
                <div className="mt-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                        🤖
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {aiChat.content.title || 'Ask anything...'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {aiChat.content.description || 'Chat with AI assistant'}
                      </p>
                      <div className="flex gap-2">
                        <button className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                          <span>🎤</span>
                          <span>Focus</span>
                        </button>
                        <button className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                          <span>📎</span>
                          <span>Attach</span>
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <span>😊</span>
                          <span className="bg-gray-200 rounded px-2 py-0.5">OFF</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🎨</span>
                          <span>Speed</span>
                          <span className="ml-2">✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Weather Widget */}
              <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">☀️</span>
                      <span className="text-sm text-gray-600">Los Angeles</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span>Humidity: 100%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">13°C</div>
                    <div className="text-xs text-gray-500">Now</div>
                  </div>
                </div>
              </div>
            </div>

            {/* My Teams Section */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold text-gray-900">My Teams</span>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-lg">👥</span>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎨</span>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Blocks Grid */}
          <div className="space-y-6">
            {/* Social Networks Section */}
            {socialLinks && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>Mes réseaux</span>
                  <span className="text-sm font-normal text-gray-500">📱</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {socialLinks.content.links?.map((link: any, idx: number) => {
                    // Determine platform-specific styling
                    const getPlatformStyle = (platform: string) => {
                      const styles: any = {
                        twitter: { bg: 'from-blue-400 to-blue-500', icon: '🐦' },
                        instagram: { bg: 'from-pink-400 via-purple-400 to-pink-500', icon: '📷' },
                        linkedin: { bg: 'from-blue-600 to-blue-700', icon: '💼' },
                        github: { bg: 'from-gray-700 to-gray-900', icon: '💻' },
                        youtube: { bg: 'from-red-500 to-red-600', icon: '📺' },
                        behance: { bg: 'from-blue-500 to-indigo-600', icon: '🎨' },
                        tiktok: { bg: 'from-black to-gray-800', icon: '🎵' }
                      }
                      return styles[platform.toLowerCase()] || { bg: 'from-gray-400 to-gray-500', icon: link.icon || '🔗' }
                    }

                    const style = getPlatformStyle(link.platform)
                    const platformName = link.platform.charAt(0).toUpperCase() + link.platform.slice(1)

                    return (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-16 h-16 bg-gradient-to-br ${style.bg} rounded-2xl flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                            {style.icon}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{platformName}</h3>
                          <p className="text-xs text-gray-500">@{profile.username}</p>
                          <button className="mt-3 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium rounded-full hover:shadow-md transition-all">
                            Follow · 12K
                          </button>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Other Blocks Section */}
            {otherBlocks.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>Mon travail</span>
                  <span className="text-sm font-normal text-gray-500">💼</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherBlocks.map((block: any) => {
                    // Text block
                    if (block.type === 'text') {
                      return (
                        <div
                          key={block.id}
                          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                          {block.content.heading && (
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                              {block.content.heading}
                            </h3>
                          )}
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
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
                          className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={block.content.url}
                              alt={block.content.alt || 'Image'}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          {block.content.caption && (
                            <p className="p-4 text-sm text-gray-600">
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
                          className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {block.content.icon && (
                                <span className="text-3xl group-hover:scale-110 transition-transform">
                                  {block.content.icon}
                                </span>
                              )}
                              <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                  {block.content.title || block.content.label}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Click to visit</p>
                              </div>
                            </div>
                            <svg className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </a>
                      )
                    }

                    // Embed block
                    if (block.type === 'embed') {
                      return (
                        <div
                          key={block.id}
                          className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 col-span-1 md:col-span-2"
                        >
                          <div className="aspect-video">
                            <iframe
                              src={block.content.url}
                              className="w-full h-full"
                              allowFullScreen
                              title={block.content.title || 'Embedded content'}
                            />
                          </div>
                          {block.content.title && (
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900">{block.content.title}</h3>
                            </div>
                          )}
                        </div>
                      )
                    }

                    return null
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {blocks.length === 0 && (
              <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No content yet
                </h2>
                <p className="text-gray-600">
                  {profile.display_name} hasn't added any blocks to their page yet.
                </p>
              </div>
            )}
          </div>
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
