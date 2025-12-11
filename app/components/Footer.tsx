import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Vario</h3>
            <p className="text-sm text-gray-400">
              The world's most advanced link-in-bio platform connecting creators with their audience through beautiful, customizable pages.
            </p>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-white font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://getearnly.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition"
                >
                  Vario™ AI Search
                </a>
              </li>
              <li>
                <Link href="/vario" className="text-sm hover:text-white transition">
                  For Creators
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/analytics" className="text-sm hover:text-white transition">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/vario" className="text-sm hover:text-white transition">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/vario" className="text-sm hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <a 
                  href="https://getearnly.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition"
                >
                  Earnly Platform
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:hello@getearnly.com" 
                  className="text-sm hover:text-white transition"
                >
                  hello@getearnly.com
                </a>
              </li>
              <li>
                <Link href="/vario" className="text-sm hover:text-white transition">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} Vario AI. All rights reserved.
            <span className="mx-2">|</span>
            Transforming link-in-bio experiences worldwide.
          </p>
          
          <div className="flex gap-6">
            <Link href="/vario" className="text-sm hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/vario" className="text-sm hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/vario" className="text-sm hover:text-white transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
