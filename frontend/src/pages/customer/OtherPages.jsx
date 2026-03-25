import { Link } from 'react-router-dom'
import { useWishlist } from '../../context/WishlistContext'
import { useStore } from '../../context/StoreContext'
import { MOCK_ROOMS } from '../../services/mockData'
import ProductCard from '../../components/common/ProductCard'

export function InspirationPage() {
  const { products } = useStore()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-artisan-cream py-16 px-6 lg:px-12 text-center">
        <div className="max-w-[1440px] mx-auto">
          <p className="section-label mb-3">Interior Design</p>
          <h1 className="section-title mb-4">Room Inspiration</h1>
          <p className="font-body text-base text-artisan-gray-soft max-w-xl mx-auto">
            Discover how our furniture transforms everyday spaces into extraordinary places. 
            Click any room to shop the pieces featured inside.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
        {MOCK_ROOMS.map((room, i) => (
          <div key={room.id} className={`grid lg:grid-cols-2 gap-10 items-center mb-24 ${i % 2 === 1 ? 'lg:direction-rtl' : ''}`}>
            <div className={`relative img-zoom ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="aspect-[4/3] overflow-hidden">
                <img src={room.image} alt={room.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-2">
                <p className="font-body text-xs text-artisan-gray-soft">{room.subtitle}</p>
              </div>
            </div>
            <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
              <p className="section-label mb-3">Featured Room</p>
              <h2 className="font-display text-4xl font-400 text-artisan-charcoal mb-4">{room.title}</h2>
              <p className="font-body text-sm text-artisan-gray-soft leading-relaxed mb-8">
                A thoughtfully curated space that brings together our finest handcrafted pieces, 
                creating harmony between form, function, and everyday living.
              </p>
              {/* Featured products from room */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {products.filter(p => room.products.includes(p.id)).slice(0, 2).map(p => (
                  <Link key={p.id} to={`/product/${p.slug}`} className="flex gap-3 bg-artisan-cream p-3 hover:bg-artisan-warm transition-colors group">
                    <img src={p.images?.[0]?.url || p.images?.[0]} alt={p.name} className="w-14 h-14 object-cover flex-shrink-0" />
                    <div>
                      <p className="font-body text-xs font-500 text-artisan-charcoal group-hover:text-artisan-brown transition-colors">{p.name}</p>
                      <p className="font-body text-xs text-artisan-gray-soft mt-1">KSh{p.price?.toLocaleString('en-KE')}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to={`/shop?category=${products.find(p => room.products.includes(p.id))?.category?.slug}`} className="btn-outline">
                Shop This Room
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function WishlistPage() {
  const { items } = useWishlist()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <div className="mb-10">
          <p className="section-label mb-2">Your Collection</p>
          <h1 className="section-title">Wishlist</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-12 h-12 text-artisan-warm-dark mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <p className="font-display text-3xl text-artisan-charcoal mb-3">Your wishlist is empty</p>
            <p className="font-body text-sm text-artisan-gray-soft mb-8">Save pieces you love to revisit later</p>
            <Link to="/shop" className="btn-primary">Explore Collection</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
