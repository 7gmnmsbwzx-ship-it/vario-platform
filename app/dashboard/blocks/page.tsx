'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getProfile } from '@/lib/actions/profile'

type BlockType = 'text' | 'image' | 'button' | 'social_links' | 'embed' | 'ai_chat'

export default function BlocksPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<BlockType | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const result = await getProfile()
      if (result.error) {
        router.push('/login')
        return
      }
      setProfile(result.data)
    } catch (err) {
      console.error('Failed to load profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const blockTypes = [
    {
      type: 'text' as BlockType,
      icon: '📝',
      name: 'Text Block',
      description: 'Add a heading or paragraph',
      gradient: 'from-indigo-500 to-purple-600',
      bgGradient: 'from-indigo-50 to-purple-50',
      borderColor: 'hover:border-indigo-400',
      shadowColor: 'hover:shadow-indigo-200'
    },
    {
      type: 'image' as BlockType,
      icon: '🖼️',
      name: 'Image',
      description: 'Upload and display an image',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'hover:border-purple-400',
      shadowColor: 'hover:shadow-purple-200'
    },
    {
      type: 'button' as BlockType,
      icon: '🔗',
      name: 'Button Link',
      description: 'Add a clickable button with URL',
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'hover:border-blue-400',
      shadowColor: 'hover:shadow-blue-200'
    },
    {
      type: 'social_links' as BlockType,
      icon: '📱',
      name: 'Social Links',
      description: 'Display social media icons',
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50',
      borderColor: 'hover:border-pink-400',
      shadowColor: 'hover:shadow-pink-200'
    },
    {
      type: 'embed' as BlockType,
      icon: '🎬',
      name: 'Embed',
      description: 'Embed YouTube, Spotify, etc.',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'hover:border-green-400',
      shadowColor: 'hover:shadow-green-200'
    },
    {
      type: 'ai_chat' as BlockType,
      icon: '🤖',
      name: 'AI Chat',
      description: 'Interactive AI chatbot widget',
      gradient: 'from-orange-500 to-amber-600',
      bgGradient: 'from-orange-50 to-amber-50',
      borderColor: 'hover:border-orange-400',
      shadowColor: 'hover:shadow-orange-200'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header with Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/20 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors group"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Manage Blocks
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        {/* Block Type Selection */}
        {!selectedType && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Choose a Block Type
              </h2>
              <p className="text-lg text-gray-600">
                Select the type of content you want to add to your page
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blockTypes.map((blockType, index) => (
                <button
                  key={blockType.type}
                  onClick={() => setSelectedType(blockType.type)}
                  className={`
                    group relative p-8 bg-white/80 backdrop-blur-sm border-2 border-gray-200
                    rounded-3xl transition-all duration-300 text-left
                    transform hover:-translate-y-2 hover:scale-105
                    ${blockType.borderColor} ${blockType.shadowColor}
                    hover:shadow-2xl hover:border-opacity-100
                    animate-fade-in
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Background on Hover */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br ${blockType.bgGradient}
                    rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  `}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon with 3D Effect */}
                    <div className="mb-5 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <div className="text-6xl filter drop-shadow-lg">
                        {blockType.icon}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-gray-700 transition-all">
                      {blockType.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                      {blockType.description}
                    </p>

                    {/* Arrow Icon */}
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-400 group-hover:text-indigo-600 transition-colors">
                      <span>Create</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>
                  </div>
                </button>
              ))}
            </div>

            {/* Additional Info Card */}
            <div className="mt-12 max-w-3xl mx-auto bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="text-4xl">✨</div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Pro Tip</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You can combine multiple blocks to create unique layouts. Each block is fully customizable 
                    and can be reordered on your profile page. Start with the basics and build your perfect page!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Block Creation Form */}
        {selectedType && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <button
              onClick={() => setSelectedType(null)}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to block types</span>
            </button>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/40">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-5xl">
                    {blockTypes.find(b => b.type === selectedType)?.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Create {blockTypes.find(b => b.type === selectedType)?.name}
                  </h2>
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
              </div>

              {selectedType === 'text' && <TextBlockForm onCancel={() => setSelectedType(null)} />}
              {selectedType === 'image' && <ImageBlockForm onCancel={() => setSelectedType(null)} />}
              {selectedType === 'button' && <ButtonBlockForm onCancel={() => setSelectedType(null)} />}
              {selectedType === 'social_links' && <SocialLinksBlockForm onCancel={() => setSelectedType(null)} />}
              {selectedType === 'embed' && <EmbedBlockForm onCancel={() => setSelectedType(null)} />}
              {selectedType === 'ai_chat' && <AIChatBlockForm onCancel={() => setSelectedType(null)} />}
            </div>
          </div>
        )}
      </main>

      {/* Add CSS for animations */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}

// Enhanced Form Components with 3D styling
function TextBlockForm({ onCancel }: { onCancel: () => void }) {
  const router = useRouter()
  const [heading, setHeading] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    
    try {
      const { createBlockSimple } = await import('@/lib/actions/blocks')
      const result = await createBlockSimple('text', {
        heading,
        text: content
      })
      
      if (result.error) {
        setError(result.error)
        setSaving(false)
        return
      }
      
      alert('Text block created successfully!')
      router.refresh()
      onCancel()
    } catch (err: any) {
      setError(err.message || 'Failed to create block')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Heading</label>
        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
          placeholder="Enter a catchy heading"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all resize-none"
          placeholder="Write your content here..."
          required
        />
      </div>
      
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all transform hover:scale-105"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </span>
          ) : 'Create Text Block'}
        </button>
      </div>
    </form>
  )
}

// Placeholder forms with enhanced styling (keep same functionality)
function ImageBlockForm({ onCancel }: { onCancel: () => void }) {
  const [imageUrl, setImageUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Image block created successfully! (Database integration pending)')
    setSaving(false)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all"
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Alt Text</label>
        <input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all"
          placeholder="Describe your image"
          required
        />
      </div>
      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all transform hover:scale-105">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-xl disabled:opacity-50">
          {saving ? 'Creating...' : 'Create Image Block'}
        </button>
      </div>
    </form>
  )
}

function ButtonBlockForm({ onCancel }: { onCancel: () => void }) {
  const [buttonText, setButtonText] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Button block created successfully! (Database integration pending)')
    setSaving(false)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Button Text</label>
        <input
          type="text"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
          placeholder="Click me!"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Link URL</label>
        <input
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
          placeholder="https://example.com"
          required
        />
      </div>
      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all transform hover:scale-105">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-xl disabled:opacity-50">
          {saving ? 'Creating...' : 'Create Button Block'}
        </button>
      </div>
    </form>
  )
}

function SocialLinksBlockForm({ onCancel }: { onCancel: () => void }) {
  const [twitter, setTwitter] = useState('')
  const [instagram, setInstagram] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Social links block created successfully! (Database integration pending)')
    setSaving(false)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-gray-600 mb-4">Add your social media links to connect with your audience</p>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter/X</label>
        <input
          type="url"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all"
          placeholder="https://twitter.com/username"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram</label>
        <input
          type="url"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all"
          placeholder="https://instagram.com/username"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
        <input
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all"
          placeholder="https://linkedin.com/in/username"
        />
      </div>
      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all transform hover:scale-105">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-xl disabled:opacity-50">
          {saving ? 'Creating...' : 'Create Social Links'}
        </button>
      </div>
    </form>
  )
}

function EmbedBlockForm({ onCancel }: { onCancel: () => void }) {
  const [embedUrl, setEmbedUrl] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Embed block created successfully! (Database integration pending)')
    setSaving(false)
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Embed URL</label>
        <input
          type="url"
          value={embedUrl}
          onChange={(e) => setEmbedUrl(e.target.value)}
          className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
          placeholder="YouTube, Spotify, or other embed URL"
          required
        />
        <p className="text-xs text-gray-500 mt-2">Supports YouTube, Spotify, SoundCloud, and more</p>
      </div>
      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all transform hover:scale-105">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-xl disabled:opacity-50">
          {saving ? 'Creating...' : 'Create Embed Block'}
        </button>
      </div>
    </form>
  )
}

function AIChatBlockForm({ onCancel }: { onCancel: () => void }) {
  const [chatTitle, setChatTitle] = useState('💬 Chat with AI')
  const [welcomeMessage, setWelcomeMessage] = useState('Hi! I\'m here to help. Ask me anything!')
  const [personality, setPersonality] = useState('friendly')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('AI Chat block created successfully! (Database integration pending)')
    setSaving(false)
    onCancel()
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🤖</div>
          <div>
            <h3 className="font-bold text-orange-900 text-lg mb-2">AI Chat Block</h3>
            <p className="text-sm text-orange-800">
              Add an interactive AI chatbot to your page. Visitors can ask questions and get instant responses powered by AI.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Chat Title</label>
          <input
            type="text"
            value={chatTitle}
            onChange={(e) => setChatTitle(e.target.value)}
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Welcome Message</label>
          <textarea
            rows={3}
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">AI Personality</label>
          <select
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all"
          >
            <option value="friendly">Friendly & Helpful</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual & Fun</option>
            <option value="expert">Expert & Detailed</option>
          </select>
        </div>

        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Features Included:</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Real-time AI responses
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Conversation history
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Customizable appearance
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Mobile-friendly interface
            </li>
          </ul>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all transform hover:scale-105">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-xl disabled:opacity-50">
            {saving ? 'Creating...' : 'Create AI Chat Block'}
          </button>
        </div>
      </form>
    </div>
  )
}
