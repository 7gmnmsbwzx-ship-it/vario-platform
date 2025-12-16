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

type BlockType = 'text' | 'image' | 'button' | 'link' | 'email' | 'music'

interface Block {
  id: string
  type: BlockType
  title: string
  description: string
  icon: string
  bgColor: string
  textColor: string
  url?: string
  size?: 'small' | 'medium' | 'large'
}

const DEMO_PROFILE = {
  display_name: 'Alex Chen',
  username: '@alexchen',
  avatar_url: '',
  bio: 'Product designer & creative technologist building the future of digital experiences',
  views: '1,247',
}

const SOCIAL_ICONS = [
  { id: 's1', platform: 'Twitter', icon: '𝕏', url: '#' },
  { id: 's2', platform: 'Instagram', icon: '📷', url: '#' },
  { id: 's3', platform: 'LinkedIn', icon: 'in', url: '#' },
  { id: 's4', platform: 'GitHub', icon: '</>', url: '#' },
]

// Dock block types for macOS-style quick add
const DOCK_BLOCK_TYPES = [
  { id: 'link', icon: '🔗', label: 'Link', bgColor: 'bg-blue-500' },
  { id: 'text', icon: '📝', label: 'Text', bgColor: 'bg-purple-500' },
  { id: 'image', icon: '🖼️', label: 'Image', bgColor: 'bg-pink-500' },
  { id: 'button', icon: '🔘', label: 'Button', bgColor: 'bg-green-500' },
  { id: 'email', icon: '✉️', label: 'Email', bgColor: 'bg-orange-500' },
  { id: 'music', icon: '🎵', label: 'Music', bgColor: 'bg-teal-500' },
  { id: 'video', icon: '🎬', label: 'Video', bgColor: 'bg-red-500' },
  { id: 'social', icon: '👥', label: 'Social', bgColor: 'bg-indigo-500' },
]

const DEMO_BLOCKS: Block[] = [
  {
    id: '1',
    type: 'link',
    title: 'My Portfolio',
    description: 'See my latest design work and case studies',
    icon: '🔗',
    bgColor: 'bg-purple-50',
    textColor: 'text-gray-900',
    size: 'large',
  },
  {
    id: '2',
    type: 'link',
    title: 'Book a Call',
    description: "Let's chat about your project",
    icon: '🔗',
    bgColor: 'bg-purple-50',
    textColor: 'text-gray-900',
    size: 'medium',
  },
  {
    id: '3',
    type: 'email',
    title: 'Design Weekly',
    description: 'Get weekly design tips in your inbox',
    icon: '✉️',
    bgColor: 'bg-purple-50',
    textColor: 'text-gray-900',
    size: 'medium',
  },
  {
    id: '4',
    type: 'music',
    title: 'Focus Playlist',
    description: 'My go-to music for deep work',
    icon: '🎵',
    bgColor: 'bg-green-50',
    textColor: 'text-gray-900',
    size: 'small',
  },
  {
    id: '5',
    type: 'link',
    title: 'Design System Guide',
    description: 'Free guide to building scalable design systems',
    icon: '🔗',
    bgColor: 'bg-purple-50',
    textColor: 'text-gray-900',
    size: 'large',
  },
  {
    id: '6',
    type: 'link',
    title: 'Latest Tweets',
    description: 'Thoughts on design & tech',
    icon: '↗',
    bgColor: 'bg-purple-50',
    textColor: 'text-gray-900',
    size: 'medium',
  },
]

export default function DemoManagePageRedesign() {
  const [blocks, setBlocks] = useState<Block[]>(DEMO_BLOCKS)
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredDockItem, setHoveredDockItem] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleAddBlockFromDock = (blockType: string) => {
    const newBlock: Block = {
      id: `${Date.now()}`,
      type: blockType as BlockType,
      title: `New ${blockType.charAt(0).toUpperCase() + blockType.slice(1)} Block`,
      description: 'Click to edit this block',
      icon: DOCK_BLOCK_TYPES.find(d => d.id === blockType)?.icon || '📦',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-900',
      size: 'medium',
    }
    setBlocks([...blocks, newBlock])
    alert(`Added new ${blockType} block!`)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)
      const newBlocks = arrayMove(blocks, oldIndex, newIndex)
      setBlocks(newBlocks)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <span className="text-xs font-semibold">DEMO MODE - Centered Layout</span>
          </div>
          <Link href="/signup" className="px-3 py-1 bg-white text-blue-600 rounded-full text-xs font-semibold">
            Sign Up
          </Link>
        </div>
      </div>

      {/* Main Content - Centered Single Column */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Profile Section */}
        <div className="text-center mb-8">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-100 to-purple-200 mx-auto mb-6 flex items-center justify-center overflow-hidden relative">
            <div className="text-6xl">👨‍💼</div>
            {/* Online Status */}
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
          </div>

          {/* Name */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {DEMO_PROFILE.display_name}
          </h1>

          {/* Username */}
          <p className="text-lg text-gray-600 mb-4">
            {DEMO_PROFILE.username}
          </p>

          {/* Bio */}
          <p className="text-base text-gray-700 max-w-2xl mx-auto mb-6">
            {DEMO_PROFILE.bio}
          </p>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {SOCIAL_ICONS.map((social) => (
              <button
                key={social.id}
                onClick={() => alert(`Opening ${social.platform}...`)}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all hover:scale-110 text-gray-700"
                title={social.platform}
              >
                <span className="text-xl">{social.icon}</span>
              </button>
            ))}
          </div>

          {/* View Count */}
          <p className="text-sm text-gray-500 mb-8">
            {DEMO_PROFILE.views} views
          </p>

          {/* AI Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search with AI... try 'how can I contact them?' or 'what projects are they working on?'"
                className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 placeholder:text-gray-400"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content Blocks Grid */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map(b => b.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr mb-32">
              {blocks.map((block) => (
                <SortableBlock key={block.id} block={block} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* macOS-Style Dock - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-6 pointer-events-none">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-end justify-center gap-2 pointer-events-auto">
            <div className="bg-white/30 backdrop-blur-2xl border border-white/50 rounded-[24px] p-3 shadow-2xl">
              <div className="flex items-end gap-3">
                {DOCK_BLOCK_TYPES.map((dockItem, index) => {
                  const isHovered = hoveredDockItem === dockItem.id
                  const distance = hoveredDockItem 
                    ? Math.abs(DOCK_BLOCK_TYPES.findIndex(d => d.id === hoveredDockItem) - index)
                    : 999
                  
                  // Scale based on distance from hovered item
                  let scale = 1
                  if (isHovered) scale = 1.5
                  else if (distance === 1) scale = 1.3
                  else if (distance === 2) scale = 1.15
                  
                  return (
                    <button
                      key={dockItem.id}
                      onClick={() => handleAddBlockFromDock(dockItem.id)}
                      onMouseEnter={() => setHoveredDockItem(dockItem.id)}
                      onMouseLeave={() => setHoveredDockItem(null)}
                      className={`${dockItem.bgColor} relative flex flex-col items-center justify-center rounded-2xl transition-all duration-200 ease-out shadow-lg hover:shadow-2xl group`}
                      style={{
                        width: `${48 * scale}px`,
                        height: `${48 * scale}px`,
                        transform: isHovered ? 'translateY(-12px)' : 'translateY(0)',
                      }}
                      title={dockItem.label}
                    >
                      {/* Icon */}
                      <span className="text-2xl" style={{ fontSize: `${20 * scale}px` }}>
                        {dockItem.icon}
                      </span>
                      
                      {/* Tooltip on hover */}
                      <div className={`absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        {dockItem.label}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900/90"></div>
                      </div>
                      
                      {/* Gloss effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-2xl pointer-events-none"></div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sortable Block Component
function SortableBlock({ block }: { block: Block }) {
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

  // Determine grid span based on block size
  const sizeClasses = {
    small: 'md:col-span-1 md:row-span-1',
    medium: 'md:col-span-1 md:row-span-1',
    large: 'md:col-span-2 md:row-span-1',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${block.bgColor} ${block.textColor} ${sizeClasses[block.size || 'medium']} rounded-3xl p-6 cursor-move hover:shadow-lg transition-all group relative overflow-hidden`}
      {...attributes}
      {...listeners}
    >
      {/* Icon */}
      <div className="mb-4">
        <div className="w-12 h-12 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center text-2xl">
          {block.icon}
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-lg font-bold mb-2">{block.title}</h3>
        <p className="text-sm opacity-70">{block.description}</p>
      </div>

      {/* Hover Actions */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            alert('Edit block')
          }}
          className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow-lg"
        >
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
