'use client'

import { useState } from 'react'
import Link from 'next/link'

type BlockType = 'text' | 'image' | 'button' | 'social_links' | 'embed' | 'ai_chat'

export default function TestBlocksPage() {
  const [selectedType, setSelectedType] = useState<BlockType | null>(null)

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
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50',
      borderColor: 'hover:border-pink-400',
      shadowColor: 'hover:shadow-pink-200'
    },
    {
      type: 'button' as BlockType,
      icon: '🔘',
      name: 'Button Link',
      description: 'Add a clickable button',
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'hover:border-blue-400',
      shadowColor: 'hover:shadow-blue-200'
    },
    {
      type: 'social_links' as BlockType,
      icon: '🌐',
      name: 'Social Links',
      description: 'Link to your social profiles',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'hover:border-green-400',
      shadowColor: 'hover:shadow-green-200'
    },
    {
      type: 'embed' as BlockType,
      icon: '📺',
      name: 'Embed',
      description: 'Embed videos, tweets, etc.',
      gradient: 'from-orange-500 to-amber-600',
      bgGradient: 'from-orange-50 to-amber-50',
      borderColor: 'hover:border-orange-400',
      shadowColor: 'hover:shadow-orange-200'
    },
    {
      type: 'ai_chat' as BlockType,
      icon: '🤖',
      name: 'AI Chat',
      description: 'Interactive AI chatbot widget',
      gradient: 'from-teal-500 to-cyan-600',
      bgGradient: 'from-teal-50 to-cyan-50',
      borderColor: 'hover:border-teal-400',
      shadowColor: 'hover:shadow-teal-200'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                🎨 Test Blocks Manager
              </h1>
              <p className="text-gray-600 text-lg">
                Preview all block types and designs without authentication
              </p>
            </div>
            <Link 
              href="/" 
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Block Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blockTypes.map((blockType) => (
            <button
              key={blockType.type}
              onClick={() => setSelectedType(selectedType === blockType.type ? null : blockType.type)}
              className={`
                group relative bg-gradient-to-br ${blockType.bgGradient}
                rounded-2xl p-6 border-2 ${
                  selectedType === blockType.type
                    ? `border-${blockType.gradient.split('-')[1]}-400 shadow-xl scale-105`
                    : 'border-transparent hover:border-gray-300'
                }
                transition-all duration-300 hover:scale-105 hover:shadow-2xl
                ${blockType.shadowColor}
                backdrop-blur-sm
              `}
            >
              <div className="relative z-10">
                <div className={`
                  text-5xl mb-4 inline-block p-4 rounded-2xl
                  bg-gradient-to-br ${blockType.gradient}
                  shadow-lg transform group-hover:scale-110 group-hover:rotate-6
                  transition-all duration-300
                `}>
                  <span className="drop-shadow-lg">{blockType.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {blockType.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {blockType.description}
                </p>
              </div>
              
              {/* Selection indicator */}
              {selectedType === blockType.type && (
                <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Demo Preview */}
        {selectedType && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Preview: {blockTypes.find(b => b.type === selectedType)?.name}
              </h2>
              <button
                onClick={() => setSelectedType(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-dashed border-gray-300">
              <p className="text-gray-600 text-center text-lg">
                This is a demo preview for <span className="font-bold">{selectedType}</span> block.
                <br />
                In production, this would show the actual block form and functionality.
              </p>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-blue-800 text-sm">
                💡 <strong>Note:</strong> This is a test page without authentication. 
                To create real blocks, please <Link href="/login" className="underline font-bold">sign in</Link> and 
                visit <Link href="/dashboard/blocks" className="underline font-bold">/dashboard/blocks</Link>.
              </p>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-bold text-gray-800 mb-2">Beautiful Design</h3>
            <p className="text-gray-600 text-sm">
              3D effects, glassmorphism, and smooth animations
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-gray-800 mb-2">Fast & Responsive</h3>
            <p className="text-gray-600 text-sm">
              Optimized performance on all devices
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-bold text-gray-800 mb-2">Easy to Use</h3>
            <p className="text-gray-600 text-sm">
              Create blocks in seconds with intuitive forms
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
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
      `}</style>
    </div>
  )
}
