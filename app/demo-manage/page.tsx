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

type BlockType = 'text' | 'image' | 'button' | 'social_links' | 'embed' | 'ai_chat'

interface Block {
  id: string
  type: BlockType
  content: any
  order_index: number
  is_visible: boolean
  size?: 'small' | 'medium' | 'large' // For grid layout
}

// Demo data - no authentication required
const DEMO_PROFILE = {
  id: 'demo-user',
  username: 'justinbuisson',
  display_name: 'JUSTIN BUISSON',
  avatar_url: 'https://www.genspark.ai/api/files/s/Vz4mix8C',
  bio: 'Digital Marketing Strategist & Content Creator',
}

const DEMO_BLOCKS: Block[] = [
  {
    id: '1',
    type: 'ai_chat',
    content: { 
      title: 'AI CHAT',
      description: 'SF Display Medium, 18pt',
      welcomeMessage: 'Ask anything...',
      personality: 'friendly'
    },
    order_index: 0,
    is_visible: true,
    size: 'large'
  },
  {
    id: '2',
    type: 'embed',
    content: { 
      url: 'https://example.com/weather',
      title: 'Weather',
      thumbnail: 'weather'
    },
    order_index: 1,
    is_visible: true,
    size: 'small'
  },
  {
    id: '3',
    type: 'image',
    content: { url: 'https://via.placeholder.com/300x400', alt: 'Content 1' },
    order_index: 2,
    is_visible: true,
    size: 'medium'
  },
  {
    id: '4',
    type: 'image',
    content: { url: 'https://via.placeholder.com/300x200', alt: 'Content 2' },
    order_index: 3,
    is_visible: true,
    size: 'small'
  },
  {
    id: '5',
    type: 'image',
    content: { url: 'https://via.placeholder.com/300x200', alt: 'Content 3' },
    order_index: 4,
    is_visible: true,
    size: 'small'
  },
]

const SOCIAL_LINKS = [
  { id: 's1', platform: 'Twitter', icon: '𝕏', color: 'bg-white', textColor: 'text-black' },
  { id: 's2', platform: 'LinkedIn', icon: 'in', color: 'bg-white', textColor: 'text-blue-600' },
  { id: 's3', platform: 'TikTok', icon: '♪', color: 'bg-white', textColor: 'text-black' },
  { id: 's4', platform: 'Instagram', icon: '📷', color: 'bg-white', textColor: 'text-pink-600' },
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

  const handleBlockCreated = (type: BlockType, content: any, size: 'small' | 'medium' | 'large' = 'medium') => {
    const newBlock: Block = {
      id: `demo-${Date.now()}`,
      type,
      content,
      order_index: blocks.length,
      is_visible: true,
      size
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
        <div className="max-w-[640px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <div className="font-bold text-sm">DEMO MODE - No Login Required</div>
              <div className="text-xs opacity-90">Preview Bento.me style layout</div>
            </div>
          </div>
          <Link href="/signup" className="px-4 py-1.5 bg-white text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-50 transition-colors">
            Sign Up Free
          </Link>
        </div>
      </div>

      {/* Main Content - Centered Single Column */}
      <div className="max-w-[640px] mx-auto px-6 py-8">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-lg">
            <div className="text-5xl">👨‍💼</div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{DEMO_PROFILE.display_name}</h1>
          <p className="text-gray-600 text-sm">{DEMO_PROFILE.bio}</p>
        </div>

        {/* Social Links - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {SOCIAL_LINKS.map((social) => (
            <div
              key={social.id}
              className="bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 ${social.color} rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform ${social.textColor} font-bold`}>
                  {social.icon}
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-2">{social.platform}</div>
                <button className="w-full px-4 py-1.5 border-2 border-blue-500 text-blue-500 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Content Blocks - Masonry Grid */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map(b => b.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {blocks.map((block) => (
                <SortableBlock
                  key={block.id}
                  block={block}
                  onDelete={() => handleDeleteBlock(block.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Bottom Action Buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Views
          </button>

          <button
            onClick={() => setShowAddMenu(true)}
            className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>

          <button
            onClick={() => setShowAddMenu(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Block
          </button>

          <button className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>

        {/* Pro Tip */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">This is a Demo!</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                You're viewing a Bento.me-style layout. Sign up to save your changes and create your own beautiful page!
              </p>
              <Link href="/signup" className="inline-block mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors">
                Get Started Free →
              </Link>
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

// Sortable Block Component
function SortableBlock({ block, onDelete }: { block: Block; onDelete: () => void }) {
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

  // Determine grid span based on size
  const sizeClasses = {
    small: 'col-span-1 aspect-square',
    medium: 'col-span-1 aspect-[3/4]',
    large: 'col-span-2 aspect-video',
  }

  const sizeClass = sizeClasses[block.size || 'medium']

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-move ${sizeClass}`}
      {...attributes}
      {...listeners}
    >
      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
      >
        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Block Content */}
      <BlockContent block={block} />
    </div>
  )
}

// Block Content Renderer
function BlockContent({ block }: { block: Block }) {
  if (block.type === 'ai_chat') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-orange-50 to-amber-50 p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-xl">
            🤖
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-900">{block.content.title}</div>
            <div className="text-xs text-gray-600">{block.content.description}</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <input
          type="text"
          placeholder={block.content.welcomeMessage}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-2"
          readOnly
        />

        <div className="text-xs text-gray-500 mb-3">{block.content.description}</div>
      </div>
    )
  }

  if (block.type === 'embed' && block.content.thumbnail === 'weather') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-yellow-50 to-orange-50 p-4 flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌤️</span>
            <span className="text-sm font-medium text-gray-700">Weather</span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    )
  }

  if (block.type === 'image') {
    return (
      <div className="w-full h-full relative bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium">
          {block.content.alt || 'SF Display Me..., 16pt'}
        </div>
      </div>
    )
  }

  if (block.type === 'button') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-cyan-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">{block.content.icon || '🔗'}</div>
          <div className="text-sm font-semibold text-gray-900">{block.content.label}</div>
        </div>
      </div>
    )
  }

  if (block.type === 'text') {
    return (
      <div className="w-full h-full bg-white p-4 flex flex-col">
        <h4 className="text-sm font-bold text-gray-900 mb-2">{block.content.heading}</h4>
        <p className="text-xs text-gray-600 line-clamp-4">{block.content.text}</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <span className="text-gray-400 text-sm">Block Content</span>
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
  onSuccess: (type: BlockType, content: any, size?: 'small' | 'medium' | 'large') => void
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState<any>({})
  const [blockSize, setBlockSize] = useState<'small' | 'medium' | 'large'>('medium')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSuccess(type, formData, blockSize)
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

          {/* Block Size Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Block Size</label>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setBlockSize(size)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    blockSize === size
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
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
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Icon (Emoji)</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🔗"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none text-2xl"
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
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Alt Text</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  placeholder="SF Display Me..., 16pt"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </>
          )}

          {type === 'ai_chat' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="AI CHAT"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="SF Display Medium, 18pt"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Welcome Message</label>
                <input
                  type="text"
                  onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                  placeholder="Ask anything..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </>
          )}

          {type === 'embed' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Embed URL</label>
              <input
                type="url"
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
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
