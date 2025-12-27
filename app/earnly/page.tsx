'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function EarnlyHomePage() {
  const [liveConversations, setLiveConversations] = useState(2847)
  const [revenue, setRevenue] = useState(47892)

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveConversations(prev => prev + Math.floor(Math.random() * 5))
      setRevenue(prev => prev + Math.floor(Math.random() * 100))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/65 backdrop-blur-[18px] border-b border-[#EBEBF0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-10">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-[#333333]">Earnly</span>
              </Link>
              <div className="hidden md:flex space-x-8">
                <Link href="/for-advertisers" className="text-[#8E8E93] hover:text-[#39B57E] transition-colors text-sm font-medium">
                  For Advertisers
                </Link>
                <Link href="/for-ai-platforms" className="text-[#8E8E93] hover:text-[#39B57E] transition-colors text-sm font-medium">
                  For AI Platforms
                </Link>
                <Link href="/creators" className="text-[#8E8E93] hover:text-[#39B57E] transition-colors text-sm font-medium">
                  For Creators
                </Link>
                <Link href="/geo-report" className="text-[#8E8E93] hover:text-[#39B57E] transition-colors text-sm font-medium">
                  GEO Analytics
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#74D8A1] rounded-full animate-pulse"></div>
                  <span className="text-[#74D8A1] font-medium">Live</span>
                </div>
                <span className="text-[#C4C4CC]">|</span>
                <span className="text-[#333333] font-semibold">{liveConversations.toLocaleString()}</span>
                <span className="text-[#8E8E93]">conversations</span>
              </div>
              <Link 
                href="/get-started" 
                className="bg-[#74D8A1] hover:bg-[#39B57E] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-[#E9F9F2] rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-[#74D8A1] rounded-full animate-pulse"></div>
                <span className="text-sm text-[#106146] font-medium">New: Real-time AI Optimization</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-[#333333] leading-tight">
                Connect{' '}
                <span className="text-[#74D8A1]">Advertisers</span>
                {' '}& AI Platforms
              </h1>
              
              <p className="text-xl text-[#8E8E93] leading-relaxed max-w-2xl">
                Intelligent ecosystem powered by{' '}
                <span className="text-[#39B57E] font-semibold">contextual recommendations</span>
                {' '}and{' '}
                <span className="text-[#74D8A1] font-semibold">real-time optimization</span>.
              </p>

              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#74D8A1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm text-[#8E8E93]">Privacy-First</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#74D8A1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm text-[#8E8E93]">Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#74D8A1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm text-[#8E8E93]">Real-time Analytics</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href="/get-started"
                  className="bg-[#74D8A1] hover:bg-[#39B57E] text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/demo"
                  className="bg-white hover:bg-[#F7F7F8] text-[#39B57E] px-8 py-4 rounded-xl font-semibold border border-[#EBEBF0] transition-all"
                >
                  Watch Demo
                </Link>
              </div>
            </div>

            {/* Right: Dashboard Preview Card */}
            <div className="relative">
              <div className="bg-white rounded-2xl border border-[#EBEBF0] p-6 shadow-[0px_4px_16px_rgba(0,0,0,0.06)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#333333]">Live Performance Dashboard</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#74D8A1] rounded-full animate-pulse"></div>
                    <span className="text-sm text-[#74D8A1] font-medium">Real-time</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-[#74D8A1] to-[#39B57E] rounded-xl p-4 text-white">
                    <div className="text-2xl font-bold">${revenue.toLocaleString()}</div>
                    <div className="text-sm opacity-90">Revenue Today</div>
                    <div className="text-xs opacity-75 mt-1">
                      ↑ +23.4%
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#39B57E] to-[#106146] rounded-xl p-4 text-white">
                    <div className="text-2xl font-bold">8.7%</div>
                    <div className="text-sm opacity-90">Conversion Rate</div>
                    <div className="text-xs opacity-75 mt-1">
                      ↑ +1.2%
                    </div>
                  </div>
                </div>

                <div className="bg-[#F7F7F8] rounded-xl p-4">
                  <h4 className="font-semibold text-[#333333] mb-3 flex items-center text-sm">
                    <svg className="w-4 h-4 text-[#74D8A1] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI-Matched Products
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#EBEBF0]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#E9F9F2] rounded-lg flex items-center justify-center">
                          💻
                        </div>
                        <div>
                          <div className="font-medium text-[#333333] text-sm">Gaming Laptop Pro</div>
                          <div className="text-xs text-[#8E8E93]">Match Score: 94.2%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#39B57E]">$1,299</div>
                        <div className="text-xs text-[#8E8E93]">12% commission</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#EBEBF0]">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#E9F9F2] rounded-lg flex items-center justify-center">
                          🎧
                        </div>
                        <div>
                          <div className="font-medium text-[#333333] text-sm">Wireless Headphones</div>
                          <div className="text-xs text-[#8E8E93]">Match Score: 91.8%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#39B57E]">$299</div>
                        <div className="text-xs text-[#8E8E93]">15% commission</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[#F7F7F8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#333333] mb-4">How Earnly Works</h2>
            <p className="text-xl text-[#8E8E93] max-w-3xl mx-auto">
              Connecting advertisers with AI platforms through intelligent, contextual recommendations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-[#EBEBF0] p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)]">
              <div className="mb-6">
                <div className="w-12 h-12 bg-[#E9F9F2] rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[#39B57E]">1</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#333333] mb-3">Connect</h3>
                <p className="text-[#8E8E93] leading-relaxed mb-6">
                  Advertisers list products and set targeting preferences. AI platforms integrate our SDK or API in minutes.
                </p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-[#74D8A1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-[#8E8E93]">Product Catalog Setup</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-[#74D8A1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-[#8E8E93]">SDK Integration</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-[#74D8A1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-[#8E8E93]">Targeting Configuration</span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-[#EBEBF0] p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)]">
              <div className="mb-6">
                <div className="w-12 h-12 bg-[#E9F9F2] rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[#39B57E]">2</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#333333] mb-3">Match</h3>
                <p className="text-[#8E8E93] leading-relaxed mb-6">
                  Our AI analyzes conversation context and user intent to match the most relevant products in real-time.
                </p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-[#74D8A1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-[#8E8E93]">Intent Detection</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-[#74D8A1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-[#8E8E93]">Contextual Analysis</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-[#74D8A1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-[#8E8E93]">Real-time Scoring</span>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-[#EBEBF0] p-8 shadow-[0px_4px_16px_rgba(0,0,0,0.06)]">
              <div className="mb-6">
                <div className="w-12 h-12 bg-[#E9F9F2] rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[#39B57E]">3</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#333333] mb-3">Earn</h3>
                <p className="text-[#8E8E93] leading-relaxed mb-6">
                  Transparent tracking, real-time analytics, and automated payments for all parties.
                </p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-[#74D8A1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-[#8E8E93]">Revenue Tracking</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-[#74D8A1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-[#8E8E93]">Automated Payments</span>
                </li>
                <li className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-[#74D8A1] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-[#8E8E93]">Performance Analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#333333] mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-[#8E8E93] mb-8">
            Join hundreds of advertisers and AI platforms already growing with Earnly
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              href="/get-started"
              className="bg-[#74D8A1] hover:bg-[#39B57E] text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="bg-white hover:bg-[#F7F7F8] text-[#39B57E] px-8 py-4 rounded-xl font-semibold border border-[#EBEBF0] transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F7F7F8] border-t border-[#EBEBF0] py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-[#333333] mb-4">Earnly</h3>
              <p className="text-sm text-[#8E8E93]">
                Connecting advertisers with AI platforms through intelligent recommendations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#333333] mb-4 text-sm">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-sm text-[#8E8E93] hover:text-[#39B57E]">Features</Link></li>
                <li><Link href="/pricing" className="text-sm text-[#8E8E93] hover:text-[#39B57E]">Pricing</Link></li>
                <li><Link href="/docs" className="text-sm text-[#8E8E93] hover:text-[#39B57E]">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#333333] mb-4 text-sm">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-[#8E8E93] hover:text-[#39B57E]">About</Link></li>
                <li><Link href="/blog" className="text-sm text-[#8E8E93] hover:text-[#39B57E]">Blog</Link></li>
                <li><Link href="/careers" className="text-sm text-[#8E8E93] hover:text-[#39B57E]">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#333333] mb-4 text-sm">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-[#8E8E93] hover:text-[#39B57E]">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm text-[#8E8E93] hover:text-[#39B57E]">Terms</Link></li>
                <li><Link href="/security" className="text-sm text-[#8E8E93] hover:text-[#39B57E]">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#EBEBF0] pt-8 text-center">
            <p className="text-sm text-[#8E8E93]">
              © 2025 Earnly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
