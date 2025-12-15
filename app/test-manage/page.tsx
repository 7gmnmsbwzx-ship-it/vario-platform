'use client'

import { useState } from 'react'
import Link from 'next/link'

type BlockType = 'text' | 'image' | 'button' | 'social_links' | 'embed' | 'ai_chat'

interface Block {
  id: string
  type: BlockType
  content: any
  order_index: number
}

// Mock data for testing
const mockProfile = {
  username: 'justinbuisson',
  display_name: 'JUSTIN BUISSON',
  bio: 'Je parle de design, de graphisme, de motion design, d\'art, tous ces termes qui désignent la création quoi... 🤙',
  avatar_url: null
}

const mockBlocks: Block[] = [
  {
    id: '1',
    type: 'social_links',
    content: {
      links: [
        { platform: 'youtube', url: 'https://youtube.com', handle: '@justinbuisson' },
        { platform: 'twitter', url: 'https://twitter.com', handle: '@justinbuisson' },
        { platform: 'instagram', url: 'https://instagram.com', handle: '@justinbuisson' },
        { platform: 'linkedin', url: 'https://linkedin.com', handle: '@justinbuisson' }
      ]
    },
    order_index: 0
  },
  {
    id: '2',
    type: 'text',
    content: {
      heading: 'Welcome',
      text: 'This is a demo of the Bento.me-style block management interface.'
    },
    order_index: 1
  },
  {
    id: '3',
    type: 'image',
    content: {
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      alt: 'Design work',
      caption: 'My latest project'
    },
    order_index: 2
  },
  {
    id: '4',
    type: 'button',
    content: {
      label: 'Visit My Website',
      url: 'https://example.com',
      icon: '🔗'
    },
    order_index: 3
  }
]

export default function TestManagePage() {
  const [blocks] = useState<Block[]>(mockBlocks)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [selectedType, setSelectedType] = useState<BlockType | null>(null)

  const blockTypes = [
    { type: 'text' as BlockType, icon: '📝', name: 'Text Block', color: 'bg-blue-100 text-blue-600' },
    { type: 'image' as BlockType, icon: '🖼️', name: 'Image', color: 'bg-purple-100 text-purple-600' },
    { type: 'button' as BlockType, icon: '🔗', name: 'Button Link', color: 'bg-cyan-100 text-cyan-600' },
    { type: 'social_links' as BlockType, icon: '📱', name: 'Social Links', color: 'bg-pink-100 text-pink-600' },
    { type: 'embed' as BlockType, icon: '🎬', name: 'Embed', color: 'bg-green-100 text-green-600' },
    { type: 'ai_chat' as BlockType, icon: '🤖', name: 'AI Chat', color: 'bg-orange-100 text-orange-600' },
  ]

  const getBlockIcon = (type: BlockType) => {
    const icons = {
      text: '📝',
      image: '🖼️',
      button: '🔗',
      social_links: '📱',
      embed: '🎬',
      ai_chat: '🤖',
    }
    return icons[type] || '📄'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar - Apple Style */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              ← Home
            </Link>
            <div className="w-px h-5 bg-gray-300"></div>
            <h1 className="font-semibold text-gray-900">Manage Blocks</h1>
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
              DEMO - No Auth Required
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Block
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
          {/* Left Sidebar - Profile Preview */}
          <div className="space-y-4">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">Here is Profile Picture</div>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg">
                  {mockProfile.display_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">{mockProfile.display_name}</h2>
                  <p className="text-sm text-gray-600 mb-2">→ DESIGN + YOUTUBE</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {mockProfile.bio}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>🤝</span>
                <span>business: contact@{mockProfile.username}.com</span>
              </div>
            </div>

            {/* AI Chat Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">AI CHAT Block</div>
              
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-xl">
                    🤖
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900">Ask anything...</div>
                    <div className="text-xs text-gray-600">AI Chat</div>
                  </div>
                </div>

                <textarea
                  placeholder="Ask anything..."
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm resize-none outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={2}
                  disabled
                />

                <div className="flex items-center gap-2 mt-3">
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50">
                    <span>😊</span>
                    <span>Focus</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-50">
                    <span>📎</span>
                    <span>Attach</span>
                  </button>
                  <div className="flex-1"></div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>🔊 OFF</span>
                    <span>⚡ Speed</span>
                  </div>
                </div>
              </div>

              {/* Weather Widget */}
              <div className="mt-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">☀️</span>
                      <span className="text-sm text-gray-600">Los Angeles</span>
                    </div>
                    <div className="text-xs text-gray-500">Humidity: 100%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">13°C</div>
                    <div className="text-xs text-gray-500">Now</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Views */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">Here to see page views & setting</div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Clicks</div>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-medium transition-colors">
                No Views Yesterday
              </button>
            </div>
          </div>

          {/* Right Content - Blocks Management */}
          <div className="space-y-4">
            {/* Mes réseaux Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Mes réseaux 📱</h3>
                <button
                  onClick={() => alert('In demo mode. Sign in to add social links!')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Social
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {blocks.filter(b => b.type === 'social_links').map(block => (
                  block.content.links?.map((link: any, idx: number) => (
                    <div key={idx} className="group relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-100 hover:shadow-lg transition-all">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-2xl mb-2">
                          {link.platform === 'youtube' && '▶️'}
                          {link.platform === 'twitter' && '🐦'}
                          {link.platform === 'instagram' && '📷'}
                          {link.platform === 'linkedin' && '💼'}
                        </div>
                        <div className="text-sm font-semibold text-gray-900 truncate w-full">
                          {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))
                ))}
              </div>
            </div>

            {/* Mon travail Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Mon travail 💼</h3>
                <div className="text-sm text-gray-500">Blocks can drag and adapt accordingly</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blocks.filter(b => b.type !== 'social_links').map(block => (
                  <div
                    key={block.id}
                    className="group relative bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all"
                  >
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
                        title="Drag to reorder (demo)"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                      </button>
                      <button
                        onClick={() => alert('In demo mode. Sign in to delete blocks!')}
                        className="p-1.5 hover:bg-red-100 rounded-lg text-red-600"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{getBlockIcon(block.type)}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate mb-1">
                          {block.content.heading || block.content.title || block.content.label || 'Untitled'}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {block.content.text || block.content.description || block.content.url || 'No description'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Pro Tip</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    This is a demo preview of the Bento.me-style interface. Sign in to create, edit, and reorder your blocks with full functionality!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Block Menu - Demo */}
      {showAddMenu && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowAddMenu(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Here to ADD NEW Blocks and create preview page</h3>
                <button
                  onClick={() => setShowAddMenu(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto">
              {blockTypes.map((blockType) => (
                <button
                  key={blockType.type}
                  onClick={() => {
                    setSelectedType(blockType.type)
                    setShowAddMenu(false)
                    alert('Demo mode: Sign in at /signin to create real blocks!')
                  }}
                  className="flex flex-col items-center gap-3 p-6 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all hover:scale-105 active:scale-95"
                >
                  <div className={`w-16 h-16 ${blockType.color} rounded-2xl flex items-center justify-center text-3xl`}>
                    {blockType.icon}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 text-center">
                    {blockType.name}
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3 text-sm">
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Link">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Image">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Text">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Embed">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </button>
                
                <div className="flex-1"></div>
                
                <Link
                  href="/"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Share my URL
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
