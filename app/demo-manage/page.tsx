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
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type BlockType = 'text' | 'image' | 'button' | 'social_links' | 'embed' | 'ai_chat'

interface Block {
  id: string
  type: BlockType
  content: any
  order_index: number
  is_visible: boolean
}

// Demo data - no authentication required
const DEMO_PROFILE = {
  id: 'demo-user',
  username: 'demo',
  display_name: 'Demo User',
  avatar_url: '',
  bio: 'Je parle de design, de graphisme, de motion design, d\'art, tous ces termes qui désignent la création quoi... 🤙',
}

const DEMO_BLOCKS: Block[] = [
  {
    id: '1',
    type: 'text',
    content: { heading: 'Welcome!', text: 'This is a demo text block. Click "Add Block" to create more!' },
    order_index: 0,
    is_visible: true,
  },
  {
    id: '2',
    type: 'button',
    content: { label: 'Visit My Website', url: 'https://example.com', icon: '🔗' },
    order_index: 1,
    is_visible: true,
  },
  {
    id: '3',
    type: 'social_links',
    content: { links: [{ platform: 'twitter', url: 'https://twitter.com/demo', handle: '@demo' }] },
    order_index: 2,
    is_visible: true,
  },
]

export default function DemoManageBlocksPage() {
  const [blocks, setBlocks] = useState<Block[]>(DEMO_BLOCKS)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [selectedType, setSelectedType] = useState<BlockType | null>(null)

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
      alert('✅ Block reordered! (Demo mode - changes not saved)')
    }
  }

  const handleDeleteBlock = (blockId: string) => {
    if (!confirm('Delete this block? (Demo mode - just for preview)')) return
    setBlocks(blocks.filter(b => b.id !== blockId))
    alert('✅ Block deleted! (Demo mode)')
  }

  const handleBlockCreated = (type: BlockType, content: any) => {
    const newBlock: Block = {
      id: `demo-${Date.now()}`,
      type,
      content,
      order_index: blocks.length,
      is_visible: true,
    }
    setBlocks([...blocks, newBlock])
    setSelectedType(null)
    setShowAddMenu(false)
    alert('✅ Block created! (Demo mode - changes not saved)')
  }

  const blockTypes = [
    { type: 'text' as BlockType, icon: '📝', name: 'Text Block', color: 'bg-blue-100 text-blue-600' },
    { type: 'image' as BlockType, icon: '🖼️', name: 'Image', color: 'bg-purple-100 text-purple-600' },
    { type: 'button' as BlockType, icon: '🔗', name: 'Button Link', color: 'bg-cyan-100 text-cyan-600' },
    { type: 'social_links' as BlockType, icon: '📱', name: 'Social Links', color: 'bg-pink-100 text-pink-600' },
    { type: 'embed' as BlockType, icon: '🎬', name: 'Embed', color: 'bg-green-100 text-green-600' },
    { type: 'ai_chat' as BlockType, icon: '🤖', name: 'AI Chat', color: 'bg-orange-100 text-orange-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
        <div className="max-w-[1800px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <div className="font-bold text-sm">DEMO MODE - No Login Required</div>
              <div className="text-xs opacity-90">Preview all features without authentication</div>
            </div>
          </div>
          <Link href="/signup" className="px-4 py-1.5 bg-white text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-50 transition-colors">
            Sign Up Free
          </Link>
        </div>
      </div>

      {/* Top Bar - Apple Style */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              ← Home
            </Link>
            <div className="w-px h-5 bg-gray-300"></div>
            <h1 className="font-semibold text-gray-900">Manage Blocks (Demo)</h1>
          </div>
          
          <div className="flex items-center gap-3">
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
              <div className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">Profile Picture</div>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg">
                  D
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">{DEMO_PROFILE.display_name}</h2>
                  <p className="text-sm text-gray-600 mb-2">→ DESIGN + YOUTUBE</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {DEMO_PROFILE.bio}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>🤝</span>
                <span>business: contact@{DEMO_PROFILE.username}.com</span>
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
              <div className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">Preview Analytics</div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900">1.2K</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-gray-900">234</div>
                  <div className="text-sm text-gray-600">Clicks</div>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-xl text-sm font-medium">
                ⚡ Sign up to track real analytics
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
                  onClick={() => {
                    setSelectedType('social_links')
                    setShowAddMenu(false)
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Social
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {blocks.filter(b => b.type === 'social_links').length > 0 ? (
                  blocks.filter(b => b.type === 'social_links').map(block => (
                    <SocialLinkCard key={block.id} block={block} onDelete={() => handleDeleteBlock(block.id)} />
                  ))
                ) : (
                  <div className="col-span-4 text-center py-8 text-gray-500 text-sm">
                    No social links yet. Click "+ Add Social" to get started.
                  </div>
                )}
              </div>
            </div>

            {/* Mon travail Section - Draggable Blocks */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Mon travail 💼</h3>
                <div className="text-sm text-gray-500">Drag blocks to reorder</div>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext 
                  items={blocks.filter(b => b.type !== 'social_links').map(b => b.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blocks.filter(b => b.type !== 'social_links').length > 0 ? (
                      blocks.filter(b => b.type !== 'social_links').map(block => (
                        <SortableBlockCard 
                          key={block.id} 
                          block={block}
                          onDelete={() => handleDeleteBlock(block.id)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-12 text-gray-500 text-sm">
                        No blocks yet. Click "Add Block" to create your first block.
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Pro Tip */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">This is a Demo!</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    You're viewing a fully functional preview of the Manage Blocks page. Sign up to save your changes and create your own beautiful page!
                  </p>
                  <Link href="/signup" className="inline-block mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors">
                    Get Started Free →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Block Menu */}
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
                <h3 className="text-xl font-bold text-gray-900">Add New Block</h3>
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
          </div>
        </div>
      )}

      {/* Create Block Form Modal */}
      {selectedType && (
        <DemoBlockFormModal
          type={selectedType}
          blockTypes={blockTypes}
          onSuccess={handleBlockCreated}
          onCancel={() => setSelectedType(null)}
        />
      )}
    </div>
  )
}

// Sortable Block Card Component
function SortableBlockCard({ block, onDelete }: { block: Block; onDelete: () => void }) {
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
    <div
      ref={setNodeRef}
      style={style}
      className="group relative bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all cursor-move"
    >
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          {...listeners}
          {...attributes}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
          title="Drag to reorder"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>
        <button
          onClick={onDelete}
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
  )
}

// Social Link Card Component
function SocialLinkCard({ block, onDelete }: { block: Block; onDelete: () => void }) {
  return (
    <div className="group relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-100 hover:shadow-lg transition-all">
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
      >
        <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-2xl mb-2">
          📱
        </div>
        <div className="text-sm font-semibold text-gray-900 truncate w-full">
          {block.content.links?.[0]?.platform || 'Social'}
        </div>
      </div>
    </div>
  )
}

// Demo Block Form Modal
function DemoBlockFormModal({ 
  type, 
  blockTypes, 
  onSuccess, 
  onCancel 
}: { 
  type: BlockType
  blockTypes: any[]
  onSuccess: (type: BlockType, content: any) => void
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState<any>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSuccess(type, formData)
  }

  const blockType = blockTypes.find(b => b.type === type)

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Create {blockType?.name} (Demo)
            </h3>
            <button
              onClick={onCancel}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
            🎯 This is demo mode. Your block will be added temporarily for preview.
          </div>

          {type === 'text' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Heading</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                  placeholder="Enter heading"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Content</label>
                <textarea
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Write your content..."
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                  required
                />
              </div>
            </>
          )}

          {type === 'button' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Button Label</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Visit My Website"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">URL</label>
                <input
                  type="url"
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
            </>
          )}

          {type === 'image' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Image URL</label>
                <input
                  type="url"
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
            </>
          )}

          {type === 'social_links' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Platform</label>
                <select
                  onChange={(e) => setFormData({ ...formData, links: [{ platform: e.target.value, url: '', handle: '' }] })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none"
                >
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Profile URL</label>
                <input
                  type="url"
                  onChange={(e) => {
                    const links = formData.links || [{ platform: 'twitter', url: '', handle: '' }]
                    links[0].url = e.target.value
                    setFormData({ ...formData, links })
                  }}
                  placeholder="https://twitter.com/username"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
            </>
          )}

          {(type === 'embed' || type === 'ai_chat') && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {type === 'embed' ? 'Embed URL' : 'AI Chat Title'}
              </label>
              <input
                type={type === 'embed' ? 'url' : 'text'}
                onChange={(e) => setFormData({ ...formData, [type === 'embed' ? 'url' : 'title']: e.target.value })}
                placeholder={type === 'embed' ? 'https://www.youtube.com/watch?v=...' : 'Chat with AI'}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                required
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
            >
              Create (Demo)
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
