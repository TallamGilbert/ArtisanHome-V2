// CartPage.jsx
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export function CartPage() {
  const { items, total, removeItem, updateQuantity } = useCart()

  if (items.length === 0) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-4xl text-artisan-charcoal mb-3">Your cart is empty</p>
        <p className="font-body text-sm text-artisan-gray-soft mb-8">Discover our handcrafted collections</p>
        <Link to="/shop" className="btn-primary">Shop Now</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <h1 className="font-display text-5xl font-300 mb-12">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="border-b border-artisan-warm pb-4 mb-4 hidden md:grid grid-cols-4 gap-4">
              {['Product', 'Price', 'Quantity', 'Total'].map(h => (
                <p key={h} className="font-body text-xs tracking-widest uppercase text-artisan-gray-soft" style={{ letterSpacing: '0.15em' }}>{h}</p>
              ))}
            </div>
            {items.map(item => (
              <div key={item.key} className="grid md:grid-cols-4 gap-4 items-center py-6 border-b border-artisan-warm">
                <div className="flex gap-4 md:col-span-1">
                  <img src={item.images?.[0]} alt={item.name} className="w-20 h-20 object-cover bg-artisan-cream flex-shrink-0" />
                  <div>
                    <h3 className="font-body text-sm font-500 text-artisan-charcoal">{item.name}</h3>
                    {item.options?.color && <p className="font-body text-xs text-artisan-gray-soft mt-1">{item.options.color}</p>}
                    <button onClick={() => removeItem(item.key)} className="font-body text-xs text-artisan-gray-soft hover:text-artisan-brown underline mt-2">Remove</button>
                  </div>
                </div>
                <p className="font-body text-sm text-artisan-charcoal">${item.price?.toLocaleString()}</p>
                <div className="flex items-center border border-artisan-warm-dark w-fit">
                  <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center text-artisan-charcoal hover:bg-artisan-cream text-lg">−</button>
                  <span className="w-10 text-center font-body text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center text-artisan-charcoal hover:bg-artisan-cream text-lg">+</button>
                </div>
                <p className="font-body text-sm font-500 text-artisan-charcoal">${(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-artisan-cream p-8">
              <h2 className="font-display text-2xl font-400 mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-artisan-gray-soft">Subtotal</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-artisan-gray-soft">Delivery</span>
                  <span className="text-artisan-brown">{total >= 2000 ? 'Complimentary' : '$149'}</span>
                </div>
              </div>
              <div className="border-t border-artisan-warm-dark pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="font-body text-sm text-artisan-charcoal">Total</span>
                  <span className="font-display text-3xl text-artisan-charcoal">${(total + (total >= 2000 ? 0 : 149)).toLocaleString()}</span>
                </div>
              </div>
              <Link to="/checkout">
                <button className="btn-primary w-full justify-center text-center">Proceed to Checkout</button>
              </Link>
              <Link to="/shop" className="w-full text-center font-body text-xs text-artisan-gray-soft hover:text-artisan-brown mt-4 block underline">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
