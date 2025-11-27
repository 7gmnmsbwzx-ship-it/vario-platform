'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ThemePage() {
  const [selectedTheme, setSelectedTheme] = useState('minimal')

  const themes = [
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean and simple design',
      preview: 'bg-white',
      primary: '#6366f1',
      secondary: '#8b5cf6'
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      description: 'Sleek dark theme',
      preview: 'bg-gray-900',
      primary: '#3b82f6',
      secondary: '#8b5cf6'
    },
    {
      id: 'gradient',
      name: 'Gradient',
      description: 'Colorful gradients',
      preview: 'bg-gradient-to-br from-purple-500 to-pink-500',
      primary: '#a855f7',
      secondary: '#ec4899'
    },
    {
      id: 'nature',
      name: 'Nature',
      description: 'Earth tones',
      preview: 'bg-green-600',
      primary: '#16a34a',
      secondary: '#65a30d'
    },
    {
      id: 'ocean',
      name: 'Ocean',
      description: 'Blue and calm',
      preview: 'bg-blue-500',
      primary: '#3b82f6',
      secondary: '#0ea5e9'
    }
  ]

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
              <h1 className="text-2xl font-bold text-gray-900">Customize Theme</h1>
            </div>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Theme Selection */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Choose a Theme</h2>
            <div className="space-y-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`w-full p-6 rounded-xl border-2 transition text-left ${
                    selectedTheme === theme.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-lg ${theme.preview}`}></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                      <p className="text-sm text-gray-600">{theme.description}</p>
                    </div>
                    {selectedTheme === theme.id && (
                      <div className="text-indigo-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Colors */}
            <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Custom Colors</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <input type="color" className="w-full h-12 rounded-lg border border-gray-300" defaultValue="#6366f1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                  <input type="color" className="w-full h-12 rounded-lg border border-gray-300" defaultValue="#8b5cf6" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <input type="color" className="w-full h-12 rounded-lg border border-gray-300" defaultValue="#ffffff" />
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Preview</h2>
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Name</h3>
                <p className="text-gray-600">@username</p>
              </div>

              <div className="space-y-3">
                <div className="bg-indigo-600 text-white p-4 rounded-lg text-center font-semibold">
                  Sample Button Link
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-900 font-medium">Sample Text Block</p>
                  <p className="text-sm text-gray-600 mt-1">This is how your text content will look</p>
                </div>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-lg text-center font-semibold">
                  Gradient Button
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                💡 <strong>Tip:</strong> Changes will be applied to your public profile page in real-time.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
