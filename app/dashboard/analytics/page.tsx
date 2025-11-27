'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7days')

  const stats = {
    totalViews: 1234,
    totalClicks: 567,
    aiChatOpens: 89,
    uniqueVisitors: 890
  }

  const topBlocks = [
    { name: 'Contact Button', clicks: 234, type: 'button' },
    { name: 'Portfolio Link', clicks: 189, type: 'button' },
    { name: 'AI Chat', clicks: 89, type: 'ai_chat' },
    { name: 'Social Links', clicks: 55, type: 'social_links' }
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
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Views</h3>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-2">↑ 12.5% from last period</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Clicks</h3>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalClicks.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-2">↑ 8.3% from last period</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">AI Chat Opens</h3>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.aiChatOpens.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-2">↑ 15.7% from last period</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Unique Visitors</h3>
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.uniqueVisitors.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-2">↑ 6.2% from last period</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Views Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 59, 80, 81, 56, 78, 95].map((height, i) => (
                <div key={i} className="flex-1 bg-indigo-600 rounded-t-lg hover:bg-indigo-700 transition" style={{height: `${height}%`}}></div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-500">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* Click Rate Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Click-Through Rate</h2>
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle cx="96" cy="96" r="80" stroke="#e5e7eb" strokeWidth="16" fill="none" />
                  <circle cx="96" cy="96" r="80" stroke="#6366f1" strokeWidth="16" fill="none"
                    strokeDasharray="502.4" strokeDashoffset="125.6" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <p className="text-4xl font-bold text-gray-900">46%</p>
                  <p className="text-sm text-gray-600">CTR</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Blocks */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Blocks</h2>
          <div className="space-y-4">
            {topBlocks.map((block, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center font-bold text-indigo-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{block.name}</p>
                    <p className="text-sm text-gray-600">{block.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{block.clicks}</p>
                  <p className="text-xs text-gray-600">clicks</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Direct</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{width: '45%'}}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Social Media</span>
                <span className="font-semibold">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: '30%'}}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Search Engines</span>
                <span className="font-semibold">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-pink-600 h-2 rounded-full" style={{width: '15%'}}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Other</span>
                <span className="font-semibold">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '10%'}}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h2>
            <div className="space-y-3">
              {[
                { country: 'United States', flag: '🇺🇸', visitors: 456 },
                { country: 'United Kingdom', flag: '🇬🇧', visitors: 234 },
                { country: 'Canada', flag: '🇨🇦', visitors: 123 },
                { country: 'Australia', flag: '🇦🇺', visitors: 77 }
              ].map((location, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{location.flag}</span>
                    <span className="text-gray-700">{location.country}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{location.visitors}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
