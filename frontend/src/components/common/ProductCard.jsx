import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'text-artisan-brown' : 'text-artisan-warm-dark'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function ProductCard({ product, size = 'default' }) {
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  const isCompact = size === 'compact'

  return (
    <div className="product-card group">
      {/* Image */}
      <div className={`relative bg-artisan-cream overflow-hidden ${isCompact ? 'aspect-square' : 'aspect-[3/4]'}`}>
        <Link to={`/product/${product.slug || product.id}`}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          {/* Hover second image */}
          {product.images?.[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.original_price && (
            <span className="badge bg-artisan-brown text-white">Sale</span>
          )}
          {product.is_best_seller && !product.original_price && (
            <span className="badge bg-artisan-charcoal text-white">Best Seller</span>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <span className="badge bg-amber-100 text-amber-800">Low Stock</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => toggle(product)}
          className="absolute top-3 right-3 w-9 h-9 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-artisan-cream"
        >
          <svg className={`w-4 h-4 transition-colors ${wishlisted ? 'text-artisan-brown fill-artisan-brown' : 'text-artisan-charcoal'}`} fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => addItem(product)}
            className="w-full bg-artisan-charcoal text-white font-body text-xs tracking-widest uppercase py-3.5 hover:bg-artisan-brown transition-colors"
            style={{ letterSpacing: '0.15em' }}
          >
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className={`pt-4 ${isCompact ? 'pb-2' : 'pb-4'}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link to={`/product/${product.slug || product.id}`}>
              <h3 className="font-body text-sm font-500 text-artisan-charcoal hover:text-artisan-brown transition-colors leading-snug truncate">
                {product.name}
              </h3>
            </Link>
            {product.material && !isCompact && (
              <p className="font-body text-xs text-artisan-gray-soft mt-0.5">{product.material}</p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-body text-sm font-500 text-artisan-charcoal">
              KSh{product.price?.toLocaleString('en-KE')}
            </p>
            {product.original_price && (
              <p className="font-body text-xs text-artisan-gray-soft line-through">
                KSh{product.original_price?.toLocaleString('en-KE')}
              </p>
            )}
          </div>
        </div>

        {product.rating && !isCompact && (
          <div className="flex items-center gap-1.5 mt-2">
            <StarRating rating={product.rating} />
            <span className="font-body text-xs text-artisan-gray-soft">({product.reviews_count})</span>
          </div>
        )}
      </div>
    </div>
  )
}
