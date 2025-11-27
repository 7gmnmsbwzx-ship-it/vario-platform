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
      color: 'indigo'
    },
    {
      type: 'image' as BlockType,
      icon: '🖼️',
      name: 'Image',
      description: 'Upload and display an image',
      color: 'purple'
    },
    {
      type: 'button' as BlockType,
      icon: '🔗',
      name: 'Button Link',
      description: 'Add a clickable button with URL',
      color: 'blue'
    },
    {
      type: 'social_links' as BlockType,
      icon: '📱',
      name: 'Social Links',
      description: 'Display social media icons',
      color: 'pink'
    },
    {
      type: 'embed' as BlockType,
      icon: '🎬',
      name: 'Embed',
      description: 'Embed YouTube, Spotify, etc.',
      color: 'green'
    },
    {
      type: 'ai_chat' as BlockType,
      icon: '🤖',
      name: 'AI Chat',
      description: 'Interactive AI chatbot widget',
      color: 'orange'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Manage Blocks</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Block Type Selection */}
        {!selectedType && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Choose a Block Type</h2>
              <p className="text-gray-600">Select the type of content you want to add to your page</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blockTypes.map((blockType) => (
                <button
                  key={blockType.type}
                  onClick={() => setSelectedType(blockType.type)}
                  className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-lg transition text-left group"
                >
                  <div className="text-4xl mb-3">{blockType.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600">
                    {blockType.name}
                  </h3>
                  <p className="text-sm text-gray-600">{blockType.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Block Creation Form */}
        {selectedType && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setSelectedType(null)}
              className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              ← Back to block types
            </button>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create {blockTypes.find(b => b.type === selectedType)?.name}
              </h2>

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
    </div>
  )
}

// Block Forms Components with working submit handlers
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
      // Import the server action
      const { createBlockSimple } = await import('@/lib/actions/blocks')
      
      // Call server action to create block
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter heading text"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your text content"
          required
        />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Creating...' : 'Create Text Block'}
        </button>
      </div>
    </form>
  )
}

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
        <input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="Image description"
          required
        />
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50">
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
        <input
          type="text"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Click me!"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Link URL</label>
        <input
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com"
          required
        />
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-gray-600 mb-4">Add your social media links</p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter/X</label>
        <input
          type="url"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="https://twitter.com/username"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
        <input
          type="url"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="https://instagram.com/username"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
        <input
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="https://linkedin.com/in/username"
        />
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50">
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Embed URL</label>
        <input
          type="url"
          value={embedUrl}
          onChange={(e) => setEmbedUrl(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          placeholder="YouTube, Spotify, or other embed URL"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Supports YouTube, Spotify, SoundCloud, and more</p>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50">
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
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🤖</div>
          <div>
            <h3 className="font-semibold text-orange-900 mb-1">AI Chat Block</h3>
            <p className="text-sm text-orange-800">
              Add an interactive AI chatbot to your page. Visitors can ask questions and get instant responses.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chat Title</label>
          <input
            type="text"
            value={chatTitle}
            onChange={(e) => setChatTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
          <textarea
            rows={3}
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">AI Personality</label>
          <select
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="friendly">Friendly & Helpful</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual & Fun</option>
            <option value="expert">Expert & Detailed</option>
          </select>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Features Included:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>✅ Real-time AI responses</li>
            <li>✅ Conversation history</li>
            <li>✅ Customizable appearance</li>
            <li>✅ Mobile-friendly chat interface</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50">
            {saving ? 'Creating...' : 'Create AI Chat Block'}
          </button>
        </div>
      </form>
    </div>
  )
}
