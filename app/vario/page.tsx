import Link from 'next/link'

export const metadata = {
  title: 'Vario - Your Link-in-Bio Platform',
  description: 'Create your personalized link-in-bio page in minutes. Share all your content in one place.',
}

export default function VarioLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-16">
          <Link href="/" className="text-3xl font-bold text-white">
            Vario
          </Link>
          <div className="flex gap-4">
            <Link 
              href="/login"
              className="px-6 py-2 text-white hover:text-gray-200 transition"
            >
              Login
            </Link>
            <Link 
              href="/signup"
              className="px-6 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            One Link.<br />Infinite Possibilities.
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Share all your content, products, and social profiles with a single, beautiful link-in-bio page.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/signup"
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-xl"
            >
              Create Your Page - It's Free
            </Link>
            <Link 
              href="/login"
              className="px-8 py-4 bg-purple-700/50 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition backdrop-blur-sm"
            >
              View Demo
            </Link>
          </div>

          {/* Trust Indicator */}
          <p className="text-white/70 text-sm">
            Join thousands of creators sharing their content with Vario
          </p>
        </div>

        {/* Preview Section */}
        <div className="max-w-md mx-auto mt-16">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 text-center">
              <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-lg">
                👤
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Name</h3>
              <p className="text-gray-600 mb-1">@yourusername</p>
              <p className="text-gray-700">Your bio goes here ✨</p>
            </div>
            
            <div className="p-6 space-y-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-4 text-center text-white font-semibold shadow-lg">
                🔗 Your First Link
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-center text-white font-semibold shadow-lg">
                🌟 Your Second Link
              </div>
              <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-xl p-4 text-center text-white font-semibold shadow-lg">
                💼 Your Third Link
              </div>
            </div>

            <div className="p-6 text-center border-t">
              <p className="text-sm text-gray-500">
                Powered by <span className="font-semibold text-purple-600">Vario</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Everything you need in one place
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl text-white mx-auto mb-4">
                🎨
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Customizable Design</h3>
              <p className="text-gray-600">
                Choose from beautiful themes and colors to match your brand perfectly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl text-white mx-auto mb-4">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Track clicks, views, and engagement with powerful analytics tools.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center text-3xl text-white mx-auto mb-4">
                🤖
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Chat Assistant</h3>
              <p className="text-gray-600">
                Let visitors chat with an AI assistant trained on your content.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Create your personalized link-in-bio page in less than 2 minutes.
          </p>
          <Link 
            href="/signup"
            className="inline-block px-10 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-xl"
          >
            Get Your Free Page
          </Link>
          <p className="text-white/70 text-sm mt-4">
            No credit card required • Free forever
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <Link href="/" className="text-2xl font-bold text-white mb-4 inline-block">
            Vario
          </Link>
          <p className="text-gray-400 mb-6">
            Your all-in-one link-in-bio platform
          </p>
          <div className="flex justify-center gap-6 mb-6">
            <Link href="/login" className="text-gray-400 hover:text-white transition">
              Login
            </Link>
            <Link href="/signup" className="text-gray-400 hover:text-white transition">
              Sign Up
            </Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
              Dashboard
            </Link>
          </div>
          <p className="text-gray-600 text-sm">
            © 2024 Vario Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
