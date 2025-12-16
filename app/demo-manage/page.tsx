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

type BlockType = 'text' | 'image' | 'button' | 'link' | 'email' | 'music' | 'video' | 'social'

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

// Dock block types - Updated with proper icons
const DOCK_BLOCK_TYPES = [
  { 
    id: 'link', 
    label: 'Link', 
    bgColor: 'from-blue-400 to-blue-600',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    )
  },
  { 
    id: 'text', 
    label: 'Text', 
    bgColor: 'from-purple-400 to-purple-600',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
  { 
    id: 'image', 
    label: 'Image', 
    bgColor: 'from-pink-400 to-pink-600',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    id: 'button', 
    label: 'Button', 
    bgColor: 'from-green-400 to-green-600',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    )
  },
  { 
    id: 'email', 
    label: 'Email', 
    bgColor: 'from-orange-400 to-orange-600',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    id: 'music', 
    label: 'Music', 
    bgColor: 'from-teal-400 to-teal-600',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    )
  },
  { 
    id: 'video', 
    label: 'Video', 
    bgColor: 'from-red-400 to-red-600',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    id: 'social', 
    label: 'Social', 
    bgColor: 'from-indigo-400 to-indigo-600',
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
]

const DEMO_BLOCKS: Block[] = [
  {
    id: '1',
    type: 'link',
    title: 'Explore AI with Perplexity',
    description: 'Your go-to platform for intelligent insights',
    icon: '🔗',
    bgColor: 'bg-black',
    textColor: 'text-white',
    size: 'large',
  },
  {
    id: '2',
    type: 'link',
    title: 'My Portfolio',
    description: 'See my latest design work and case studies',
    icon: '🔗',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    size: 'medium',
  },
  {
    id: '3',
    type: 'link',
    title: 'Book a Call',
    description: "Let's chat about your project",
    icon: '🔗',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    size: 'medium',
  },
  {
    id: '4',
    type: 'email',
    title: 'Design Weekly',
    description: 'Get weekly design tips in your inbox',
    icon: '✉️',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    size: 'medium',
  },
  {
    id: '5',
    type: 'music',
    title: 'Focus Playlist',
    description: 'My go-to music for deep work',
    icon: '🎵',
    bgColor: 'bg-white',
    textColor: 'text-gray-900',
    size: 'medium',
  },
  {
    id: '6',
    type: 'link',
    title: 'Craft Your Design System',
    description: 'Explore tools and resources for effective design systems.',
    icon: '📘',
    bgColor: 'bg-white',
    textColor: 'text-indigo-600',
    size: 'large',
  },
]

export default function DemoManagePageRedesign() {
  const [blocks, setBlocks] = useState<Block[]>(DEMO_BLOCKS)
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
      icon: '📦',
      bgColor: 'bg-white',
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
    <div className="min-h-screen bg-gray-50 pb-40">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Your Blocks</h1>
              <button className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Link
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Profile
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <button 
                onClick={() => handleAddBlockFromDock('link')}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Block
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Content Blocks Grid */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map(b => b.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {blocks.map((block) => (
                <SortableBlock key={block.id} block={block} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* macOS-Style Dock - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-8 pointer-events-none">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-end justify-center gap-2 pointer-events-auto">
            <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[28px] p-4 shadow-2xl">
              <div className="flex items-end gap-4">
                {DOCK_BLOCK_TYPES.map((dockItem, index) => {
                  const isHovered = hoveredDockItem === dockItem.id
                  const distance = hoveredDockItem 
                    ? Math.abs(DOCK_BLOCK_TYPES.findIndex(d => d.id === hoveredDockItem) - index)
                    : 999
                  
                  // Scale based on distance from hovered item
                  let scale = 1
                  if (isHovered) scale = 1.4
                  else if (distance === 1) scale = 1.25
                  else if (distance === 2) scale = 1.1
                  
                  return (
                    <button
                      key={dockItem.id}
                      onClick={() => handleAddBlockFromDock(dockItem.id)}
                      onMouseEnter={() => setHoveredDockItem(dockItem.id)}
                      onMouseLeave={() => setHoveredDockItem(null)}
                      className={`bg-gradient-to-br ${dockItem.bgColor} relative flex flex-col items-center justify-center rounded-[22px] transition-all duration-300 ease-out shadow-xl hover:shadow-2xl group`}
                      style={{
                        width: `${64 * scale}px`,
                        height: `${64 * scale}px`,
                        transform: isHovered ? 'translateY(-16px)' : 'translateY(0)',
                      }}
                      title={dockItem.label}
                    >
                      {/* Icon */}
                      <div style={{ transform: `scale(${scale})` }} className="transition-transform duration-300">
                        {dockItem.icon}
                      </div>
                      
                      {/* Tooltip on hover */}
                      <div className={`absolute -top-14 left-1/2 -translate-x-1/2 bg-gray-900/95 text-white text-xs px-3 py-2 rounded-xl whitespace-nowrap transition-opacity duration-200 font-medium ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        {dockItem.label}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-gray-900/95"></div>
                      </div>
                      
                      {/* Gloss effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent rounded-[22px] pointer-events-none"></div>
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
    large: 'md:col-span-1 lg:col-span-2 md:row-span-1',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${block.bgColor} ${block.textColor} ${sizeClasses[block.size || 'medium']} rounded-2xl p-6 cursor-move hover:shadow-xl transition-all group relative border border-gray-200`}
      {...attributes}
      {...listeners}
    >
      {/* Icon in top-left corner */}
      <div className="mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-100/80 flex items-center justify-center text-xl">
          {block.icon}
        </div>
      </div>

      {/* External link icon in top-right */}
      <div className="absolute top-5 right-5">
        <div className="w-8 h-8 rounded-lg bg-gray-100/50 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2">{block.title}</h3>
        <p className="text-sm opacity-70">{block.description}</p>
      </div>

      {/* Hover visibility icon in bottom-right */}
      <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-lg bg-gray-100/80 flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      </div>
    </div>
  )
}
