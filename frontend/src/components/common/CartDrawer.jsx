import { useCart } from '../../context/CartContext'
import { Link } from 'react-router-dom'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total } = useCart()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 animate-fade-in" onClick={() => setIsOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl cart-drawer ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-artisan-warm">
          <div>
            <h2 className="font-display text-2xl font-400">Your Cart</h2>
            <p className="font-body text-xs text-artisan-gray-soft">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-artisan-gray-soft hover:text-artisan-charcoal transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-12 h-12 text-artisan-warm-dark mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              <p className="font-display text-xl text-artisan-charcoal mb-2">Your cart is empty</p>
              <p className="font-body text-sm text-artisan-gray-soft mb-6">Discover our handcrafted collections</p>
              <button onClick={() => setIsOpen(false)} className="btn-outline text-sm">
                <Link to="/shop">Continue Shopping</Link>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.key} className="flex gap-4 pb-6 border-b border-artisan-warm last:border-0">
                  <div className="w-20 h-20 bg-artisan-cream flex-shrink-0 overflow-hidden">
                    <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body text-sm font-500 text-artisan-charcoal truncate">{item.name}</h4>
                    {item.options && Object.keys(item.options).length > 0 && (
                      <p className="font-body text-xs text-artisan-gray-soft mt-0.5">
                        {Object.values(item.options).join(' · ')}
                      </p>
                    )}
                    <p className="font-body text-sm text-artisan-brown font-500 mt-1">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      {/* Qty */}
                      <div className="flex items-center border border-artisan-warm-dark">
                        <button onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-artisan-charcoal hover:bg-artisan-cream transition-colors text-sm">−
                        </button>
                        <span className="w-8 text-center font-body text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-artisan-charcoal hover:bg-artisan-cream transition-colors text-sm">+
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.key)} className="font-body text-xs text-artisan-gray-soft hover:text-artisan-brown transition-colors underline">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-artisan-warm bg-artisan-cream">
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-body text-sm text-artisan-gray-soft">Subtotal</span>
              <span className="font-display text-2xl text-artisan-charcoal">${total.toLocaleString()}</span>
            </div>
            <p className="font-body text-xs text-artisan-gray-soft mb-5">Shipping and taxes calculated at checkout</p>
            <Link to="/checkout" onClick={() => setIsOpen(false)}>
              <button className="btn-primary w-full justify-center text-center">
                Proceed to Checkout
              </button>
            </Link>
            <button onClick={() => setIsOpen(false)} className="w-full text-center font-body text-xs text-artisan-gray-soft hover:text-artisan-brown mt-3 transition-colors underline">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
