import { Link } from 'react-router-dom'
import { useState } from 'react'

const FOOTER_LINKS = {
  'Shop': [
    { label: 'Living Room', href: '/shop?category=living-room' },
    { label: 'Bedroom', href: '/shop?category=bedroom' },
    { label: 'Dining', href: '/shop?category=dining' },
    { label: 'Office', href: '/shop?category=office' },
    { label: 'Outdoor', href: '/shop?category=outdoor' },
    { label: 'Decor', href: '/shop?category=decor' },
  ],
  'Company': [
    { label: 'Our Story', href: '/about' },
    { label: 'Craftsmanship', href: '/about#craftsmanship' },
    { label: 'Sustainability', href: '/about#sustainability' },
    { label: 'Showrooms', href: '/showrooms' },
    { label: 'Press', href: '/press' },
    { label: 'Careers', href: '/careers' },
  ],
  'Customer Care': [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping & Delivery', href: '/shipping' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Care Instructions', href: '/care' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Track Order', href: '/track' },
  ],
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-artisan-charcoal text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label text-artisan-warm-dark mb-3">Stay Inspired</p>
              <h3 className="font-display text-4xl font-300 text-white leading-tight mb-3">
                Join the ArtisanHome<br />Community
              </h3>
              <p className="font-body text-sm text-white/60 leading-relaxed max-w-md">
                Receive curated design inspiration, early access to new collections, and exclusive offers. 
                No spam — just beauty, delivered thoughtfully.
              </p>
            </div>
            <div>
              {subscribed ? (
                <div className="text-center lg:text-left">
                  <p className="font-display text-2xl text-white mb-2">Thank you for joining us.</p>
                  <p className="font-body text-sm text-white/60">Your first edition arrives soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 px-5 py-4 font-body text-sm focus:outline-none focus:border-white/50 transition-colors"
                  />
                  <button type="submit" className="bg-artisan-brown hover:bg-artisan-brown-light text-white px-8 py-4 font-body text-xs tracking-widest uppercase transition-colors whitespace-nowrap" style={{ letterSpacing: '0.2em' }}>
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <span className="font-display text-2xl font-600 text-white">ArtisanHome</span>
            </Link>
            <p className="font-body text-sm text-white/50 leading-relaxed mb-6">
              Handcrafted furniture for elevated living. Each piece is made with intention, designed to last, and built to be loved.
            </p>
            {/* Social */}
            <div className="flex gap-4">
              {['instagram', 'pinterest', 'facebook'].map(social => (
                <a key={social} href={`#${social}`} className="text-white/40 hover:text-white transition-colors capitalize text-xs font-body tracking-wide">
                  {social === 'instagram' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  )}
                  {social === 'pinterest' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                  )}
                  {social === 'facebook' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="font-body text-xs tracking-widest uppercase text-white/40 mb-5" style={{ letterSpacing: '0.2em' }}>{title}</p>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.href} className="font-body text-sm text-white/60 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-white/30">
            © {new Date().getFullYear()} ArtisanHome. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Accessibility'].map(item => (
              <a key={item} href="#" className="font-body text-xs text-white/30 hover:text-white/60 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
