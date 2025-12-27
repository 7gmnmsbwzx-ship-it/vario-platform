import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#EBEBF0]">
        <nav className="container mx-auto px-6 py-5 flex justify-between items-center max-w-7xl">
          <div className="text-2xl font-semibold text-[#333333]">Vario</div>
          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-5 py-2.5 text-[#333333] text-[15px] font-medium hover:text-[#39B57E] transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="px-6 py-2.5 bg-[#74D8A1] text-white text-[15px] font-semibold rounded-xl hover:bg-[#39B57E] transition-all shadow-sm hover:shadow-md h-[48px] flex items-center"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-[48px] leading-[1.2] font-bold text-[#333333] mb-6">
            Your Perfect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#74D8A1] to-[#39B57E]">
              {' '}Link in Bio{' '}
            </span>
            Page
          </h1>
          <p className="text-[18px] leading-[1.5] text-[#8E8E93] mb-10 max-w-2xl mx-auto">
            Create a beautiful, customizable page to share all your links in one place. 
            Perfect for creators, influencers, and businesses.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/signup" 
              className="px-8 py-3 bg-[#74D8A1] text-white text-[16px] font-semibold rounded-xl hover:bg-[#39B57E] transition-all shadow-sm hover:shadow-lg h-[48px] flex items-center"
            >
              Start For Free
            </Link>
            <Link 
              href="/demo" 
              className="px-8 py-3 bg-white border-2 border-[#EBEBF0] text-[#39B57E] text-[16px] font-semibold rounded-xl hover:border-[#74D8A1] hover:bg-[#E9F9F2] transition-all h-[48px] flex items-center"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-6 border border-[#EBEBF0] hover:shadow-lg transition-all hover:border-[#C1ECD8]">
            <div className="w-12 h-12 bg-[#E9F9F2] rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-[#39B57E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-[20px] font-semibold text-[#333333] mb-3">Lightning Fast</h3>
            <p className="text-[15px] leading-[1.5] text-[#8E8E93]">Create your page in minutes with our intuitive drag-and-drop editor</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#EBEBF0] hover:shadow-lg transition-all hover:border-[#C1ECD8]">
            <div className="w-12 h-12 bg-[#E9F9F2] rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-[#39B57E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-[20px] font-semibold text-[#333333] mb-3">Fully Customizable</h3>
            <p className="text-[15px] leading-[1.5] text-[#8E8E93]">Choose from beautiful themes or create your own custom design</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#EBEBF0] hover:shadow-lg transition-all hover:border-[#C1ECD8]">
            <div className="w-12 h-12 bg-[#E9F9F2] rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-[#39B57E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 4 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-[20px] font-semibold text-[#333333] mb-3">Track Analytics</h3>
            <p className="text-[15px] leading-[1.5] text-[#8E8E93]">Understand your audience with detailed analytics and insights</p>
          </div>
        </div>

        {/* Stats Section with Glass Effect */}
        <div className="mt-32 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#E9F9F2] to-[#C1ECD8] rounded-2xl p-12 relative overflow-hidden">
            {/* Glass Card */}
            <div className="relative z-10 backdrop-blur-xl bg-white/65 rounded-xl p-8 border border-white/60 shadow-lg">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-[40px] font-bold text-[#39B57E] mb-2">10M+</div>
                  <div className="text-[15px] text-[#8E8E93]">Active Users</div>
                </div>
                <div>
                  <div className="text-[40px] font-bold text-[#39B57E] mb-2">50K+</div>
                  <div className="text-[15px] text-[#8E8E93]">Creators</div>
                </div>
                <div>
                  <div className="text-[40px] font-bold text-[#39B57E] mb-2">99.9%</div>
                  <div className="text-[15px] text-[#8E8E93]">Uptime</div>
                </div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#74D8A1] opacity-20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#39B57E] opacity-20 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-32">
          <h2 className="text-[36px] font-bold text-center text-[#333333] mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E9F9F2] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#39B57E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-[24px] font-semibold text-[#333333] mb-3">1. Sign Up</h3>
              <p className="text-[15px] text-[#8E8E93] leading-[1.5]">Create your free account in seconds</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E9F9F2] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#39B57E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="text-[24px] font-semibold text-[#333333] mb-3">2. Customize</h3>
              <p className="text-[15px] text-[#8E8E93] leading-[1.5]">Add your links and personalize your page</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E9F9F2] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#39B57E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-[24px] font-semibold text-[#333333] mb-3">3. Share</h3>
              <p className="text-[15px] text-[#8E8E93] leading-[1.5]">Share your link and grow your audience</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center bg-[#F7F7F8] rounded-2xl p-16">
          <h2 className="text-[36px] font-bold text-[#333333] mb-4">Ready to get started?</h2>
          <p className="text-[18px] text-[#8E8E93] mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using Vario to connect with their audience.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center px-8 py-3 bg-[#74D8A1] text-white text-[16px] font-semibold rounded-xl hover:bg-[#39B57E] transition-all shadow-sm hover:shadow-lg h-[48px]"
          >
            Get Started For Free
          </Link>
        </div>
      </main>
    </div>
  )
}
