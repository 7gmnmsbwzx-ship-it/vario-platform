'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getProfile } from '@/lib/actions/profile'
import { signOut } from '@/lib/actions/auth'

interface Profile {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  theme_id: number
  is_public: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const result = await getProfile()
      
      if (result.error) {
        setError(result.error)
        // If no profile, redirect to login
        if (result.error.includes('not found') || result.error.includes('authenticated')) {
          router.push('/login')
        }
      } else if (result.data) {
        setProfile(result.data)
      }
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

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

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700">
            Go to Login
          </Link>
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
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Vario
            </Link>
            
            <div className="flex items-center gap-4">
              {profile && (
                <Link 
                  href={`/${profile.username}`}
                  target="_blank"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition"
                >
                  View Your Page →
                </Link>
              )}
              
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.display_name || 'User'}! 👋
          </h1>
          <p className="text-indigo-100 mb-4">
            Your personal link is: getearnly.com/{profile?.username}
          </p>
          <div className="flex gap-3">
            <Link
              href={`/${profile?.username}`}
              target="_blank"
              className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              View Page
            </Link>
            <Link
              href="/dashboard/settings"
              className="px-6 py-2 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Blocks</h3>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">Links and content blocks</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Page Views</h3>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600 text-sm font-medium">Total Clicks</h3>
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">Link clicks</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/blocks"
              className="flex items-start gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition group"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 transition">
                <svg className="w-6 h-6 text-indigo-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Add New Block</h3>
                <p className="text-sm text-gray-600">Create links, text, images, or embeds</p>
              </div>
            </Link>

            <Link
              href="/dashboard/theme"
              className="flex items-start gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition">
                <svg className="w-6 h-6 text-purple-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Customize Theme</h3>
                <p className="text-sm text-gray-600">Change colors, fonts, and layout</p>
              </div>
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex items-start gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-pink-600 hover:bg-pink-50 transition group"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-pink-600 transition">
                <svg className="w-6 h-6 text-pink-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Profile Settings</h3>
                <p className="text-sm text-gray-600">Edit username, bio, and avatar</p>
              </div>
            </Link>

            <Link
              href="/dashboard/analytics"
              className="flex items-start gap-4 p-6 border-2 border-gray-200 rounded-xl hover:border-green-600 hover:bg-green-50 transition group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition">
                <svg className="w-6 h-6 text-green-600 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
                <p className="text-sm text-gray-600">Track views, clicks, and engagement</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-indigo-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Getting Started</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <p className="text-gray-700">Add your first link or content block</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <p className="text-gray-700">Customize your theme and colors</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <p className="text-gray-700">Share your unique link: getearnly.com/{profile?.username}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
