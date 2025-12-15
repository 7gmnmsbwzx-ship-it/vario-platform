'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getProfile } from '@/lib/actions/profile'
import { getUserBlocks, createBlockSimple, deleteBlock, reorderBlocks } from '@/lib/actions/blocks'
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

export default function BlocksPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [selectedType, setSelectedType] = useState<BlockType | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const profileResult = await getProfile()
      if (profileResult.error) {
        router.push('/login')
        return
      }
      setProfile(profileResult.data)

      // Load user blocks
      const blocksData = await getUserBlocks(profileResult.data.id)
      setBlocks(blocksData || [])
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)

      const newBlocks = arrayMove(blocks, oldIndex, newIndex)
      setBlocks(newBlocks)

      // Update order in database
      const blockIds = newBlocks.map(block => block.id)
      await reorderBlocks(blockIds)
    }
  }

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Are you sure you want to delete this block?')) return

    try {
      await deleteBlock(blockId)
      setBlocks(blocks.filter(b => b.id !== blockId))
    } catch (err) {
      alert('Failed to delete block')
    }
  }

  const handleBlockCreated = () => {
    setSelectedType(null)
    setShowAddMenu(false)
    loadData() // Reload blocks
  }

  const blockTypes = [
    { type: 'text' as BlockType, icon: '📝', name: 'Text Block', color: 'bg-blue-100 text-blue-600' },
    { type: 'image' as BlockType, icon: '🖼️', name: 'Image', color: 'bg-purple-100 text-purple-600' },
    { type: 'button' as BlockType, icon: '🔗', name: 'Button Link', color: 'bg-cyan-100 text-cyan-600' },
    { type: 'social_links' as BlockType, icon: '📱', name: 'Social Links', color: 'bg-pink-100 text-pink-600' },
    { type: 'embed' as BlockType, icon: '🎬', name: 'Embed', color: 'bg-green-100 text-green-600' },
    { type: 'ai_chat' as BlockType, icon: '🤖', name: 'AI Chat', color: 'bg-orange-100 text-orange-600' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar - Apple Style */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              ← Dashboard
            </Link>
            <div className="w-px h-5 bg-gray-300"></div>
            <h1 className="font-semibold text-gray-900">Manage Blocks</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
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
              <div className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">Profile Picture</div>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    profile.display_name?.[0] || '?'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">{profile.display_name}</h2>
                  <p className="text-sm text-gray-600 mb-2">→ {profile.bio || 'DESIGN + YOUTUBE'}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {profile.bio || 'Je parle de design, de graphisme, de motion design, d\'art, tous ces termes qui désignent la création quoi... 🤙'}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>🤝</span>
                <span>business: contact@{profile.username}.com</span>
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
                <div className="text-sm text-gray-500">Blocks can drag and adapt accordingly</div>
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
                  <h4 className="font-semibold text-gray-900 mb-1">Pro Tip</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    You can combine multiple blocks to create unique layouts. Each block is fully customizable and can be reordered on your profile page. Start with the basics and build your perfect page!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Block Menu - Apple Style Bottom Sheet */}
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
                {/* Preview Icons */}
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
                  href={`/${profile.username}`}
                  target="_blank"
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

      {/* Create Block Form Modal */}
      {selectedType && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedType(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Create {blockTypes.find(b => b.type === selectedType)?.name}
                </h3>
                <button
                  onClick={() => setSelectedType(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {selectedType === 'text' && <TextBlockForm onSuccess={handleBlockCreated} onCancel={() => setSelectedType(null)} />}
              {selectedType === 'image' && <ImageBlockForm onSuccess={handleBlockCreated} onCancel={() => setSelectedType(null)} />}
              {selectedType === 'button' && <ButtonBlockForm onSuccess={handleBlockCreated} onCancel={() => setSelectedType(null)} />}
              {selectedType === 'social_links' && <SocialLinksBlockForm onSuccess={handleBlockCreated} onCancel={() => setSelectedType(null)} />}
              {selectedType === 'embed' && <EmbedBlockForm onSuccess={handleBlockCreated} onCancel={() => setSelectedType(null)} />}
              {selectedType === 'ai_chat' && <AIChatBlockForm onSuccess={handleBlockCreated} onCancel={() => setSelectedType(null)} />}
            </div>
          </div>
        </div>
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

// Form Components (keeping existing forms but with Apple styling)
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
      const result = await createBlockSimple('text', { heading, text })
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Heading</label>
        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="Enter heading"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Content</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your content..."
          rows={5}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
          required
        />
      </div>

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
          disabled={saving}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
        >
          {saving ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  )
}

// Other form components with similar Apple styling...
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
      const result = await createBlockSimple('image', { url, alt, caption })
      if (result.error) setError(result.error)
      else {
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Image URL</label>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none" required />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Alt Text</label>
        <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none" />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Caption (Optional)</label>
        <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Add a caption"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none" />
      </div>
      
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50">
          {saving ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  )
}

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
      const result = await createBlockSimple('button', { label, url, icon })
      if (result.error) setError(result.error)
      else {
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Button Label</label>
        <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Visit My Website"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none" required />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">URL</label>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none" required />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Icon (Emoji)</label>
        <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🔗"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none text-2xl" />
      </div>
      
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50">
          {saving ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  )
}

function SocialLinksBlockForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [links, setLinks] = useState([{ platform: 'twitter', url: '', handle: '' }])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const platforms = ['twitter', 'instagram', 'youtube', 'linkedin', 'github', 'tiktok', 'facebook']

  const addLink = () => setLinks([...links, { platform: 'twitter', url: '', handle: '' }])
  const removeLink = (index: number) => setLinks(links.filter((_, i) => i !== index))
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
      if (result.error) setError(result.error)
      else {
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}
      
      <div className="space-y-4">
        {links.map((link, index) => (
          <div key={index} className="bg-gray-50 rounded-xl p-4 space-y-3 relative">
            {links.length > 1 && (
              <button type="button" onClick={() => removeLink(index)} className="absolute top-3 right-3 w-7 h-7 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center text-sm">×</button>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Platform</label>
              <select value={link.platform} onChange={(e) => updateLink(index, 'platform', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none">
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Profile URL</label>
              <input type="url" value={link.url} onChange={(e) => updateLink(index, 'url', e.target.value)} placeholder="https://twitter.com/username"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none" required />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Handle</label>
              <input type="text" value={link.handle} onChange={(e) => updateLink(index, 'handle', e.target.value)} placeholder="@username"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none" />
            </div>
          </div>
        ))}
      </div>
      
      <button type="button" onClick={addLink} className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Another Link
      </button>
      
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50">
          {saving ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  )
}

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
      const result = await createBlockSimple('embed', { url, title })
      if (result.error) setError(result.error)
      else {
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Embed URL</label>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none" required />
        <p className="text-sm text-gray-600 mt-2">Supports YouTube, Spotify, Twitter, and more</p>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Title (Optional)</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your embed a title"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none" />
      </div>
      
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50">
          {saving ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  )
}

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
      const result = await createBlockSimple('ai_chat', { title, description, welcomeMessage, personality })
      if (result.error) setError(result.error)
      else {
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Chat Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Chat with AI"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none" required />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ask me anything!"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none" />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Welcome Message</label>
        <textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} placeholder="Hi! I'm here to help. Ask me anything!" rows={3}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none resize-none" required />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">AI Personality</label>
        <select value={personality} onChange={(e) => setPersonality(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none">
          <option value="friendly">Friendly & Helpful</option>
          <option value="professional">Professional</option>
          <option value="casual">Casual & Fun</option>
          <option value="expert">Expert & Detailed</option>
        </select>
      </div>
      
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition-all">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50">
          {saving ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  )
}
