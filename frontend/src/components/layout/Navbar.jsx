import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { useStore } from '../../context/StoreContext'

const NAV_ITEMS = [
  { label: 'Shop', href: '/shop', hasMega: true },
  { label: 'Inspiration', href: '/inspiration' },
  { label: 'Collections', href: '/shop?sort=newest' },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count, setIsOpen } = useCart()
  const { user } = useAuth()
  const { items: wishItems } = useWishlist()
  const { categories } = useStore()
  const navigate = useNavigate()
  const searchRef = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-artisan-brown text-white text-center py-2.5 px-4 text-xs font-body tracking-widest uppercase" style={{ letterSpacing: '0.2em' }}>
        Complimentary White-Glove Delivery on Orders Over KSh50,000 &nbsp;·&nbsp; <span className="underline cursor-pointer">Learn More</span>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm' : 'bg-white'}`}>
        <nav className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-18 md:h-20">
            
            {/* Logo */}
            <Link to="/" className="flex flex-col leading-none group">
              <span className="font-display text-2xl font-600 text-artisan-charcoal tracking-wide group-hover:text-artisan-brown transition-colors">
                ArtisanHome
              </span>
              <span className="font-body text-xs tracking-widest text-artisan-brown uppercase" style={{ letterSpacing: '0.3em', fontSize: '9px' }}>
                Est. 2010 · Handcrafted
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-10">
              {NAV_ITEMS.map(item => (
                <div key={item.label} className="relative"
                  onMouseEnter={() => item.hasMega && setMegaOpen(true)}
                  onMouseLeave={() => item.hasMega && setMegaOpen(false)}
                >
                  <Link
                    to={item.href}
                    className="nav-link font-body text-sm tracking-wide underline-anim py-8 inline-block"
                  >
                    {item.label}
                  </Link>
                  
                  {/* Mega Menu */}
                  {item.hasMega && megaOpen && (
                    <div className="fixed left-0 right-0 top-[120px] bg-white border-t border-artisan-warm shadow-xl z-50 mega-menu"
                      onMouseEnter={() => setMegaOpen(true)}
                      onMouseLeave={() => setMegaOpen(false)}
                    >
                      <div className="max-w-[1440px] mx-auto px-12 py-10 grid grid-cols-5 gap-8">
                        <div className="col-span-1">
                          <p className="section-label mb-4">Shop By Room</p>
                          <div className="space-y-2">
                            {categories.map(cat => (
                              <Link key={cat.id} to={`/shop?category=${cat.slug}`}
                                className="block font-body text-sm text-artisan-charcoal hover:text-artisan-brown transition-colors py-1"
                                onClick={() => setMegaOpen(false)}
                              >
                                {cat.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                        <div className="col-span-4 grid grid-cols-3 gap-4">
                          {categories.slice(0, 3).map(cat => (
                            <Link key={cat.id} to={`/shop?category=${cat.slug}`}
                              className="group img-zoom" onClick={() => setMegaOpen(false)}
                            >
                              <div className="aspect-[4/3] overflow-hidden mb-3">
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              </div>
                              <p className="font-body text-sm font-500 text-artisan-charcoal group-hover:text-artisan-brown transition-colors">
                                {cat.name}
                              </p>
                              <p className="font-body text-xs text-artisan-gray-soft">{cat.count} pieces</p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-5">
              {/* Search */}
              <button onClick={() => setSearchOpen(!searchOpen)} className="text-artisan-charcoal hover:text-artisan-brown transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative text-artisan-charcoal hover:text-artisan-brown transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {wishItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-artisan-brown text-white text-xs w-4 h-4 rounded-full flex items-center justify-center" style={{ fontSize: '9px' }}>
                    {wishItems.length}
                  </span>
                )}
              </Link>

              {/* User */}
              <Link to={user ? '/account' : '/login'} className="text-artisan-charcoal hover:text-artisan-brown transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>

              {/* Cart */}
              <button onClick={() => setIsOpen(true)} className="relative text-artisan-charcoal hover:text-artisan-brown transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-artisan-brown text-white text-xs w-4 h-4 rounded-full flex items-center justify-center" style={{ fontSize: '9px' }}>
                    {count}
                  </span>
                )}
              </button>

              {/* Mobile menu */}
              <button className="lg:hidden text-artisan-charcoal" onClick={() => setMobileOpen(!mobileOpen)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="border-t border-artisan-warm py-4 animate-fade-in">
              <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-3">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for furniture, materials, styles..."
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary py-3 px-6">Search</button>
                <button type="button" onClick={() => setSearchOpen(false)} className="text-artisan-gray-soft hover:text-artisan-charcoal">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </div>
          )}

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="lg:hidden border-t border-artisan-warm py-6 space-y-4 animate-fade-in">
              {NAV_ITEMS.map(item => (
                <Link key={item.label} to={item.href}
                  className="block font-body text-sm text-artisan-charcoal hover:text-artisan-brown py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-artisan-warm pt-4 space-y-2">
                {categories.map(cat => (
                  <Link key={cat.id} to={`/shop?category=${cat.slug}`}
                    className="block font-body text-xs text-artisan-gray-soft hover:text-artisan-brown py-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}
