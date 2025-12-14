'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getProfile } from '@/lib/actions/profile'
import { createBlockSimple } from '@/lib/actions/blocks'

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
      emoji: '✍️',
      name: 'Text Block',
      description: 'Add a heading or paragraph',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      type: 'image' as BlockType,
      icon: '🖼️',
      emoji: '🖼️',
      name: 'Image',
      description: 'Upload and display an image',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      type: 'button' as BlockType,
      icon: '🔗',
      emoji: '🔗',
      name: 'Button Link',
      description: 'Add a clickable button with URL',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600'
    },
    {
      type: 'social_links' as BlockType,
      icon: '📱',
      emoji: '📱',
      name: 'Social Links',
      description: 'Display social media icons',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    },
    {
      type: 'embed' as BlockType,
      icon: '🎬',
      emoji: '🎬',
      name: 'Embed',
      description: 'Embed YouTube, Spotify, etc.',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      type: 'ai_chat' as BlockType,
      icon: '🤖',
      emoji: '🤖',
      name: 'AI Chat',
      description: 'Interactive AI chatbot widget',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Apple-style Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Dashboard</span>
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <h1 className="text-2xl font-semibold text-gray-900">Choose a Block Type</h1>
            </div>
            {profile && (
              <div className="flex items-center gap-3">
                <Link
                  href={`/${profile.username}`}
                  target="_blank"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-all hover:scale-105"
                >
                  View Page
                </Link>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {profile.display_name?.[0] || '?'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {!selectedType ? (
          <>
            {/* Subtitle */}
            <div className="text-center mb-12">
              <p className="text-lg text-gray-600">Select the type of content you want to add to your page</p>
            </div>

            {/* Block Type Cards - Apple Style Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {blockTypes.map((blockType) => (
                <button
                  key={blockType.type}
                  onClick={() => setSelectedType(blockType.type)}
                  className="group relative bg-white rounded-3xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left"
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 ${blockType.bgColor} rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {blockType.emoji}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {blockType.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {blockType.description}
                  </p>

                  {/* Create Button */}
                  <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
                    <span>Create</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
                    style={{ 
                      backgroundImage: `linear-gradient(135deg, ${blockType.color.split(' ')[1]} 0%, ${blockType.color.split(' ')[3]} 100%)`
                    }}
                  ></div>
                </button>
              ))}
            </div>

            {/* Pro Tip - Apple Style */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro Tip</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You can combine multiple blocks to create unique layouts. Each block is fully customizable and can be reordered on your profile page. Start with the basics and build your perfect page!
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Form Container with Apple Style */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Form Header */}
              <div className={`${blockTypes.find(b => b.type === selectedType)?.bgColor} p-8 border-b border-gray-200`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                    {blockTypes.find(b => b.type === selectedType)?.emoji}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {blockTypes.find(b => b.type === selectedType)?.name}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {blockTypes.find(b => b.type === selectedType)?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                {selectedType === 'text' && <TextBlockForm onSuccess={() => setSelectedType(null)} onCancel={() => setSelectedType(null)} />}
                {selectedType === 'image' && <ImageBlockForm onSuccess={() => setSelectedType(null)} onCancel={() => setSelectedType(null)} />}
                {selectedType === 'button' && <ButtonBlockForm onSuccess={() => setSelectedType(null)} onCancel={() => setSelectedType(null)} />}
                {selectedType === 'social_links' && <SocialLinksBlockForm onSuccess={() => setSelectedType(null)} onCancel={() => setSelectedType(null)} />}
                {selectedType === 'embed' && <EmbedBlockForm onSuccess={() => setSelectedType(null)} onCancel={() => setSelectedType(null)} />}
                {selectedType === 'ai_chat' && <AIChatBlockForm onSuccess={() => setSelectedType(null)} onCancel={() => setSelectedType(null)} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Text Block Form Component
function TextBlockForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [heading, setHeading] = useState('')
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const result = await createBlockSimple('text', {
        heading,
        text
      })

      if (result.error) {
        setError(result.error)
      } else {
        alert('Text block created successfully!')
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create block')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Heading</label>
        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="Enter your heading"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Content</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your content here..."
          rows={5}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none text-gray-900"
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={saving}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Creating...' : 'Create Text Block'}
        </button>
      </div>
    </form>
  )
}

// Image Block Form Component
function ImageBlockForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [caption, setCaption] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const result = await createBlockSimple('image', {
        url,
        alt,
        caption
      })

      if (result.error) {
        setError(result.error)
      } else {
        alert('Image block created successfully!')
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create block')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Image URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Alt Text</label>
        <input
          type="text"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Describe the image"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Caption (Optional)</label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Add a caption"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-gray-900"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={saving}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
        >
          {saving ? 'Creating...' : 'Create Image Block'}
        </button>
      </div>
    </form>
  )
}

// Button Block Form Component
function ButtonBlockForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [icon, setIcon] = useState('🔗')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const result = await createBlockSimple('button', {
        label,
        url,
        icon
      })

      if (result.error) {
        setError(result.error)
      } else {
        alert('Button block created successfully!')
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create block')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Button Label</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Visit My Website"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Icon (Emoji)</label>
        <input
          type="text"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="🔗"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none text-gray-900 text-2xl"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={saving}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
        >
          {saving ? 'Creating...' : 'Create Button'}
        </button>
      </div>
    </form>
  )
}

// Social Links Block Form Component
function SocialLinksBlockForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [links, setLinks] = useState([
    { platform: 'twitter', url: '', handle: '' }
  ])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const platforms = ['twitter', 'instagram', 'youtube', 'linkedin', 'github', 'tiktok', 'facebook']

  const addLink = () => {
    setLinks([...links, { platform: 'twitter', url: '', handle: '' }])
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...links]
    newLinks[index] = { ...newLinks[index], [field]: value }
    setLinks(newLinks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const result = await createBlockSimple('social_links', { links })

      if (result.error) {
        setError(result.error)
      } else {
        alert('Social links block created successfully!')
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create block')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {links.map((link, index) => (
          <div key={index} className="bg-gray-50 rounded-2xl p-6 space-y-4 relative">
            {links.length > 1 && (
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="absolute top-4 right-4 w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                ×
              </button>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Platform</label>
              <select
                value={link.platform}
                onChange={(e) => updateLink(index, 'platform', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none text-gray-900"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Profile URL</label>
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(index, 'url', e.target.value)}
                placeholder="https://twitter.com/username"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Handle</label>
              <input
                type="text"
                value={link.handle}
                onChange={(e) => updateLink(index, 'handle', e.target.value)}
                placeholder="@username"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none text-gray-900"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addLink}
        className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Another Link
      </button>

      <div className="flex gap-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={saving}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
        >
          {saving ? 'Creating...' : 'Create Social Links'}
        </button>
      </div>
    </form>
  )
}

// Embed Block Form Component
function EmbedBlockForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const result = await createBlockSimple('embed', {
        url,
        title
      })

      if (result.error) {
        setError(result.error)
      } else {
        alert('Embed block created successfully!')
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create block')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Embed URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-gray-900"
          required
        />
        <p className="text-sm text-gray-600 mt-2">Supports YouTube, Spotify, Twitter, and more</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Title (Optional)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your embed a title"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-gray-900"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={saving}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
        >
          {saving ? 'Creating...' : 'Create Embed'}
        </button>
      </div>
    </form>
  )
}

// AI Chat Block Form Component
function AIChatBlockForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [title, setTitle] = useState('Chat with AI')
  const [description, setDescription] = useState('Ask me anything!')
  const [welcomeMessage, setWelcomeMessage] = useState('Hi! I\'m here to help. Ask me anything!')
  const [personality, setPersonality] = useState('friendly')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const result = await createBlockSimple('ai_chat', {
        title,
        description,
        welcomeMessage,
        personality
      })

      if (result.error) {
        setError(result.error)
      } else {
        alert('AI Chat block created successfully!')
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create block')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Chat Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Chat with AI"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ask me anything!"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Welcome Message</label>
        <textarea
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          placeholder="Hi! I'm here to help. Ask me anything!"
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none resize-none text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">AI Personality</label>
        <select
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none text-gray-900"
        >
          <option value="friendly">Friendly & Helpful</option>
          <option value="professional">Professional</option>
          <option value="casual">Casual & Fun</option>
          <option value="expert">Expert & Detailed</option>
        </select>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-orange-600">✨</span>
          Features Included
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Real-time AI responses
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Conversation history
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Mobile-friendly interface
          </li>
        </ul>
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={saving}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
        >
          {saving ? 'Creating...' : 'Create AI Chat'}
        </button>
      </div>
    </form>
  )
}
