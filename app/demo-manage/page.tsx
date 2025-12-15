'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BlockStyleEditor } from './block-style-editor'

type BlockType = 'text' | 'image' | 'button' | 'social_links' | 'embed' | 'ai_chat'

interface Block {
  id: string
  type: BlockType
  content: any
  order_index: number
  is_visible: boolean
  size?: 'small' | 'medium' | 'large'
  style?: {
    shape?: 'square' | 'rounded' | 'rounded-lg' | 'circle'
    bgColor?: string
    textColor?: string
    borderWidth?: '0' | '1' | '2' | '4'
    textAlign?: 'left' | 'center' | 'right' | 'justify'
    fontSize?: 'sm' | 'base' | 'lg' | 'xl'
    padding?: 'sm' | 'md' | 'lg'
  }
}

const DEMO_PROFILE = {
  id: 'demo-user',
  username: 'justinbuisson',
  display_name: 'JUSTIN BUISSON',
  avatar_url: '',
  bio: 'Digital Marketing Strategist & Content Creator',
}

const DEMO_BLOCKS: Block[] = [
  {
    id: '1',
    type: 'image',
    content: { url: '', alt: 'SF Display Me..., 16pt' },
    order_index: 0,
    is_visible: true,
    size: 'large'
  },
  {
    id: '2',
    type: 'image',
    content: { url: '', alt: 'SF Display Medi..., 16pt' },
    order_index: 1,
    is_visible: true,
    size: 'small'
  },
  {
    id: '3',
    type: 'image',
    content: { url: '', alt: 'SF Display Medi..., 16pt' },
    order_index: 2,
    is_visible: true,
    size: 'small'
  },
]

// Available social platforms
const AVAILABLE_SOCIAL_PLATFORMS = [
  { platform: 'Twitter', icon: '𝕏', color: 'text-blue-400', bgColor: 'bg-blue-50', url: 'https://twitter.com/' },
  { platform: 'LinkedIn', icon: 'in', color: 'text-blue-600', bgColor: 'bg-blue-50', url: 'https://linkedin.com/in/' },
  { platform: 'TikTok', icon: '♪', color: 'text-black', bgColor: 'bg-gray-50', url: 'https://tiktok.com/@' },
  { platform: 'Instagram', icon: '📷', color: 'text-pink-500', bgColor: 'bg-pink-50', url: 'https://instagram.com/' },
  { platform: 'YouTube', icon: '▶', color: 'text-red-600', bgColor: 'bg-red-50', url: 'https://youtube.com/@' },
  { platform: 'Facebook', icon: 'f', color: 'text-blue-700', bgColor: 'bg-blue-50', url: 'https://facebook.com/' },
  { platform: 'GitHub', icon: 'gh', color: 'text-gray-900', bgColor: 'bg-gray-50', url: 'https://github.com/' },
  { platform: 'Discord', icon: '💬', color: 'text-indigo-600', bgColor: 'bg-indigo-50', url: 'https://discord.gg/' },
]

// Initial social links (can be modified by user)
const INITIAL_SOCIAL_LINKS = [
  { id: 's1', platform: 'Twitter', icon: '𝕏', color: 'text-blue-400', bgColor: 'bg-blue-50' },
  { id: 's2', platform: 'LinkedIn', icon: 'in', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { id: 's3', platform: 'TikTok', icon: '♪', color: 'text-black', bgColor: 'bg-gray-50' },
  { id: 's4', platform: 'Instagram', icon: '📷', color: 'text-pink-500', bgColor: 'bg-pink-50' },
]

export default function DemoManagePageV2() {
  const [blocks, setBlocks] = useState<Block[]>(DEMO_BLOCKS)
  const [socialLinks, setSocialLinks] = useState(INITIAL_SOCIAL_LINKS)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showAddSocialMenu, setShowAddSocialMenu] = useState(false)
  const [editingBlock, setEditingBlock] = useState<Block | null>(null)
  const [showStyleEditor, setShowStyleEditor] = useState(false)
  const [showAIChat, setShowAIChat] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)
      const newBlocks = arrayMove(blocks, oldIndex, newIndex)
      setBlocks(newBlocks)
    }
  }

  const handleDeleteBlock = (blockId: string) => {
    if (!confirm('Delete this block?')) return
    setBlocks(blocks.filter(b => b.id !== blockId))
  }

  const handleEditBlock = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId)
    if (block) {
      setEditingBlock(block)
      setShowStyleEditor(true)
    }
  }

  const handleUpdateBlockStyle = (style: any) => {
    if (!editingBlock) return
    const updatedBlocks = blocks.map(b => 
      b.id === editingBlock.id ? { ...b, style: { ...b.style, ...style } } : b
    )
    setBlocks(updatedBlocks)
    setEditingBlock({ ...editingBlock, style: { ...editingBlock.style, ...style } })
  }

  const handleAddBlock = (type: BlockType) => {
    // Prevent adding AI Chat blocks (only one fixed position in sidebar)
    if (type === 'ai_chat') {
      alert('❌ AI Chat Block\n\nAI Chat is only available in the left sidebar.\nYou can show/hide it using the toggle switch.\n\n(Only one AI Chat block is allowed per page)')
      setShowAddMenu(false)
      return
    }

    // Prevent adding Social Links to content blocks (only in sidebar)
    if (type === 'social_links') {
      alert('❌ Social Links Block\n\nSocial Links are only available in the left sidebar.\nClick "Add Social Link" button in the profile card.\n\n(Social links are fixed in sidebar only)')
      setShowAddMenu(false)
      return
    }

    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      content: { alt: `New ${type} block` },
      order_index: blocks.length,
      is_visible: true,
      size: 'small'
    }
    setBlocks([...blocks, newBlock])
    setShowAddMenu(false)
    alert(`✅ ${type.toUpperCase()} block added! (Demo mode - changes not saved)`)
  }

  const handleAddSocialLink = (platform: string) => {
    const platformData = AVAILABLE_SOCIAL_PLATFORMS.find(p => p.platform === platform)
    if (!platformData) return

    // Check if platform already exists
    if (socialLinks.find(s => s.platform === platform)) {
      alert(`⚠️ ${platform} Already Added\n\nThis social platform is already in your profile.`)
      setShowAddSocialMenu(false)
      return
    }

    const newSocialLink = {
      id: `s${Date.now()}`,
      platform: platformData.platform,
      icon: platformData.icon,
      color: platformData.color,
      bgColor: platformData.bgColor
    }
    setSocialLinks([...socialLinks, newSocialLink])
    setShowAddSocialMenu(false)
    alert(`✅ ${platform} Added!\n\nSocial link added to your profile. (Demo mode - changes not saved)`)
  }

  const handleDeleteSocialLink = (linkId: string) => {
    if (!confirm('Remove this social link?')) return
    setSocialLinks(socialLinks.filter(s => s.id !== linkId))
    alert('✅ Social link removed!')
  }

  const handleViewsClick = () => {
    alert('📊 Views Analytics\n\nTotal Views: 1,234\nToday: 45\nThis Week: 178\n\n(Demo mode - sample data)')
  }

  const handleSettingsClick = () => {
    alert('⚙️ Settings\n\n• Profile Settings\n• Theme Customization\n• Privacy Options\n• Analytics Setup\n\n(Demo mode - redirects to settings page in full version)')
  }

  const handleShareClick = () => {
    const demoUrl = 'https://vario.bio/justinbuisson'
    navigator.clipboard.writeText(demoUrl).then(() => {
      alert(`🔗 Link Copied!\n\n${demoUrl}\n\nShare your link-in-bio page with your audience!`)
    }).catch(() => {
      alert(`🔗 Share Your Page\n\n${demoUrl}\n\n(Demo mode - copy manually)`)
    })
  }

  const handleSocialFollow = (platform: string) => {
    alert(`👋 Follow on ${platform}\n\nThis would open ${platform} profile in full version!\n\n(Demo mode)`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <span className="text-xs font-semibold">DEMO MODE - 2 Column Layout</span>
          </div>
          <Link href="/signup" className="px-3 py-1 bg-white text-blue-600 rounded-full text-xs font-semibold">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          
          {/* Left Sidebar */}
          <div className="space-y-4">
            {/* Profile Card with Social Links */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="flex flex-col items-center text-center">
                {/* Profile Avatar */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 mb-6 flex items-center justify-center overflow-hidden">
                  <div className="text-5xl">👨‍💼</div>
                </div>
                
                {/* Profile Info */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">{DEMO_PROFILE.display_name}</h1>
                <p className="text-base text-gray-600 mb-8">{DEMO_PROFILE.bio}</p>
                
                {/* Social Links - Compact Icon-Only Display */}
                {socialLinks.length > 0 ? (
                  <div className="flex flex-wrap gap-3 w-full justify-center mb-6">
                    {socialLinks.map((social) => (
                      <div key={social.id} className="relative group">
                        <button
                          onClick={() => handleSocialFollow(social.platform)}
                          title={`Follow on ${social.platform}`}
                          className={`flex items-center justify-center p-3 ${social.bgColor} rounded-2xl hover:shadow-lg hover:scale-110 transition-all w-12 h-12`}
                        >
                          <div className={`text-2xl ${social.color} font-bold leading-none`}>
                            {social.icon}
                          </div>
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteSocialLink(social.id)}
                          title="Remove this link"
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg flex items-center justify-center"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-6 text-center text-gray-500 text-sm py-4">
                    No social links yet. Click below to add!
                  </div>
                )}
                
                {/* Add Social Link Button */}
                <button
                  onClick={() => setShowAddSocialMenu(true)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-2xl text-sm font-semibold text-gray-700 transition-all flex items-center justify-center gap-2 border border-dashed border-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Social Link
                </button>
              </div>
            </div>

            {/* AI Chat Card - Modern Fancy Design */}
            {showAIChat ? (
              <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-[2px] shadow-xl">
                {/* Inner white card with gradient border effect */}
                <div className="bg-white rounded-3xl p-6">
                  {/* Header with sparkle icon */}
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          AI Assistant
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">Powered by AI</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowAIChat(false)
                        alert('❌ AI Chat Hidden\n\nClick "Show AI Chat" button to display it again.')
                      }}
                      className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-all hover:scale-110"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Fancy input field with icon */}
                  <div className="relative mb-4">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Ask me anything..."
                      className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-purple-300 focus:from-white focus:to-purple-50 transition-all placeholder:text-gray-400"
                      readOnly
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Status with fancy toggle */}
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-700">AI Active</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        defaultChecked
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowAIChat(true)
                  alert('✅ AI Chat Enabled\n\nAI Chat widget is now visible in the sidebar.')
                }}
                className="w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 group"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-white text-lg">Enable AI Assistant</div>
                    <div className="text-xs text-white/80">Click to activate</div>
                  </div>
                </div>
              </button>
            )}

            {/* Weather Widget */}
            <div className="bg-white rounded-3xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🌤️</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Weather</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="space-y-4">
            {/* Content Blocks - Complex Grid */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={blocks.map(b => b.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 gap-4" style={{ gridAutoRows: '200px' }}>
                  {blocks.map((block, index) => {
                    // First block spans 2 rows (tall)
                    // Second and third blocks are normal height
                    const gridClass = index === 0 
                      ? 'row-span-2' 
                      : 'row-span-1'
                    
                    return (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        gridClass={gridClass}
                        onDelete={() => handleDeleteBlock(block.id)}
                        onEdit={() => handleEditBlock(block.id)}
                      />
                    )
                  })}
                </div>
              </SortableContext>
            </DndContext>

            {/* Bottom Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={handleViewsClick}
                className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Views
              </button>

              <button
                onClick={handleSettingsClick}
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>

              <button
                onClick={() => setShowAddMenu(true)}
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Block
              </button>

              <button
                onClick={handleShareClick}
                className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Block Menu Modal */}
      {showAddMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddMenu(false)}>
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Block</h2>
              <button
                onClick={() => setShowAddMenu(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleAddBlock('text')}
                className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all text-left"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Text Block</div>
                  <div className="text-sm text-gray-500">Add a text paragraph</div>
                </div>
              </button>

              <button
                onClick={() => handleAddBlock('image')}
                className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all text-left"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Image Block</div>
                  <div className="text-sm text-gray-500">Add an image or photo</div>
                </div>
              </button>

              <button
                onClick={() => handleAddBlock('button')}
                className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all text-left"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Button/Link</div>
                  <div className="text-sm text-gray-500">Add a clickable button</div>
                </div>
              </button>

              <button
                onClick={() => handleAddBlock('social_links')}
                className="w-full flex items-center gap-4 p-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all text-left opacity-60 cursor-not-allowed"
              >
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-700">Social Links</div>
                  <div className="text-sm text-gray-500">Fixed in left sidebar only</div>
                </div>
              </button>

              <button
                onClick={() => handleAddBlock('embed')}
                className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all text-left"
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Embed</div>
                  <div className="text-sm text-gray-500">Embed external content</div>
                </div>
              </button>

              <button
                onClick={() => handleAddBlock('ai_chat')}
                className="w-full flex items-center gap-4 p-4 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all text-left opacity-60 cursor-not-allowed"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-700">AI Chat</div>
                  <div className="text-sm text-gray-500">Fixed in left sidebar only</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Social Link Modal */}
      {showAddSocialMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddSocialMenu(false)}>
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Social Link</h2>
              <button
                onClick={() => setShowAddSocialMenu(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {AVAILABLE_SOCIAL_PLATFORMS.map((platform) => {
                const alreadyAdded = socialLinks.find(s => s.platform === platform.platform)
                return (
                  <button
                    key={platform.platform}
                    onClick={() => handleAddSocialLink(platform.platform)}
                    disabled={!!alreadyAdded}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
                      alreadyAdded 
                        ? 'bg-gray-100 opacity-50 cursor-not-allowed' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-12 h-12 ${platform.bgColor} rounded-xl flex items-center justify-center`}>
                      <div className={`text-2xl ${platform.color} font-bold`}>
                        {platform.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${alreadyAdded ? 'text-gray-500' : 'text-gray-900'}`}>
                        {platform.platform}
                      </div>
                      <div className="text-sm text-gray-500">
                        {alreadyAdded ? 'Already added' : 'Add to profile'}
                      </div>
                    </div>
                    {alreadyAdded && (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Block Style Editor */}
      {editingBlock && showStyleEditor && (
        <BlockStyleEditor
          block={editingBlock}
          onUpdate={handleUpdateBlockStyle}
          onClose={() => {
            setEditingBlock(null)
            setShowStyleEditor(false)
          }}
        />
      )}
    </div>
  )
}

// Sortable Block Component
function SortableBlock({ 
  block, 
  gridClass,
  onDelete, 
  onEdit 
}: { 
  block: Block
  gridClass: string
  onDelete: () => void
  onEdit: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const customStyle = block.style || {}
  const borderRadiusMap = {
    square: '0px',
    rounded: '12px',
    'rounded-lg': '24px',
    circle: '9999px',
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: customStyle.bgColor || '#FFFFFF',
        borderRadius: borderRadiusMap[customStyle.shape as keyof typeof borderRadiusMap] || '24px',
        borderWidth: `${customStyle.borderWidth || '0'}px`,
        borderColor: '#E5E7EB',
        borderStyle: 'solid',
      }}
      className={`group relative overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-move ${gridClass}`}
      {...attributes}
      {...listeners}
    >
      {/* Gradient Background for Image Blocks */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400"></div>
      
      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50"
        >
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-50"
        >
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Block Label */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="text-sm font-medium text-gray-900">
            {block.content.alt || 'SF Display Medi..., 16pt'}
          </div>
        </div>
      </div>
    </div>
  )
}
