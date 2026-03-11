import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const STEPS = ["Shipping", "Payment", "Confirmation"];

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber] = useState(() => `AH-${Date.now().toString().slice(-6)}`);
  const [orderSnapshot, setOrderSnapshot] = useState(null);

  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });

  const [payment, setPayment] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  // Always compute from live items
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );
  const delivery = subtotal >= 2000 ? 0 : 149;
  const tax = Math.round(subtotal * 0.08);
  const grandTotal = subtotal + delivery + tax;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);
    // Snapshot everything BEFORE clearing cart
    setOrderSnapshot({
      items: [...items],
      subtotal,
      delivery,
      tax,
      grandTotal,
    });
    setOrderComplete(true);
    setStep(2);
    clearCart();
    window.scrollTo(0, 0);
  };

  // Use snapshot values after order complete, live values before
  const displayItems = orderComplete ? (orderSnapshot?.items ?? []) : items;
  const displaySubtotal = orderComplete
    ? (orderSnapshot?.subtotal ?? 0)
    : subtotal;
  const displayDelivery = orderComplete
    ? (orderSnapshot?.delivery ?? 0)
    : delivery;
  const displayTax = orderComplete ? (orderSnapshot?.tax ?? 0) : tax;
  const displayTotal = orderComplete
    ? (orderSnapshot?.grandTotal ?? 0)
    : grandTotal;

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-artisan-cream flex items-center justify-center px-6">
        <div className="max-w-md text-center py-20">
          <div className="w-20 h-20 bg-artisan-brown rounded-full flex items-center justify-center mx-auto mb-8">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="section-label mb-3">Order Confirmed</p>
          <h1 className="font-display text-4xl font-300 text-artisan-charcoal mb-4">
            Thank You
          </h1>
          <p className="font-body text-sm text-artisan-gray-soft mb-2">
            Your order <strong>{orderNumber}</strong> has been placed.
          </p>
          <p className="font-body text-sm text-artisan-gray-soft mb-8">
            A confirmation email has been sent to{" "}
            <strong>{shipping.email}</strong>. Our white-glove delivery team
            will contact you within 24 hours to schedule delivery.
          </p>
          <div className="bg-white p-6 mb-8 text-left">
            <p className="font-body text-xs tracking-widest uppercase text-artisan-gray-soft mb-3">
              Order Summary
            </p>
            {displayItems.map((item) => (
              <div
                key={item.key}
                className="flex justify-between font-body text-sm mb-2"
              >
                <span>
                  {item.name} ×{item.quantity}
                </span>
                <span>
                  ${(parseFloat(item.price) * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
            <div className="border-t border-artisan-warm mt-3 pt-3 space-y-1">
              <div className="flex justify-between font-body text-sm text-artisan-gray-soft">
                <span>Delivery</span>
                <span>
                  {displayDelivery === 0
                    ? "Complimentary"
                    : `$${displayDelivery}`}
                </span>
              </div>
              <div className="flex justify-between font-body text-sm text-artisan-gray-soft">
                <span>Tax</span>
                <span>${displayTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-body text-sm font-500 pt-2 border-t border-artisan-warm">
                <span>Total</span>
                <span>${displayTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <Link to="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-artisan-warm py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <Link
            to="/"
            className="font-display text-2xl font-600 text-artisan-charcoal"
          >
            ArtisanHome
          </Link>
          <div className="flex items-center gap-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-body ${i <= step ? "bg-artisan-brown text-white" : "bg-artisan-warm text-artisan-gray-soft"}`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span
                  className={`font-body text-xs hidden md:inline ${i === step ? "text-artisan-charcoal font-500" : "text-artisan-gray-soft"}`}
                >
                  {s}
                </span>
                {i < STEPS.length - 1 && (
                  <div className="w-8 h-px bg-artisan-warm-dark" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            {step === 0 && (
              <form onSubmit={handleShippingSubmit}>
                <h2 className="font-display text-3xl font-400 mb-8">
                  Shipping Details
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.firstName}
                      onChange={(e) =>
                        setShipping((p) => ({
                          ...p,
                          firstName: e.target.value,
                        }))
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.lastName}
                      onChange={(e) =>
                        setShipping((p) => ({ ...p, lastName: e.target.value }))
                      }
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) =>
                      setShipping((p) => ({ ...p, email: e.target.value }))
                    }
                    className="input-field"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={shipping.phone}
                    onChange={(e) =>
                      setShipping((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="input-field"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.address}
                    onChange={(e) =>
                      setShipping((p) => ({ ...p, address: e.target.value }))
                    }
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="col-span-1">
                    <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.city}
                      onChange={(e) =>
                        setShipping((p) => ({ ...p, city: e.target.value }))
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.state}
                      onChange={(e) =>
                        setShipping((p) => ({ ...p, state: e.target.value }))
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
                      ZIP
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.zip}
                      onChange={(e) =>
                        setShipping((p) => ({ ...p, zip: e.target.value }))
                      }
                      className="input-field"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary">
                  Continue to Payment →
                </button>
              </form>
            )}

            {step === 1 && (
              <form onSubmit={handlePaymentSubmit}>
                <h2 className="font-display text-3xl font-400 mb-8">
                  Payment Details
                </h2>
                <div className="bg-amber-50 border border-amber-200 p-4 mb-6 font-body text-sm text-amber-800">
                  🔒 Demo mode — no real payment is processed. Use any card
                  number.
                </div>
                <div className="mb-4">
                  <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="As on card"
                    value={payment.name}
                    onChange={(e) =>
                      setPayment((p) => ({ ...p, name: e.target.value }))
                    }
                    className="input-field"
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    value={payment.cardNumber}
                    onChange={(e) =>
                      setPayment((p) => ({ ...p, cardNumber: e.target.value }))
                    }
                    className="input-field font-body tracking-widest"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
                      Expiry
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM / YY"
                      maxLength={7}
                      value={payment.expiry}
                      onChange={(e) =>
                        setPayment((p) => ({ ...p, expiry: e.target.value }))
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
                      CVV
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="•••"
                      maxLength={4}
                      value={payment.cvv}
                      onChange={(e) =>
                        setPayment((p) => ({ ...p, cvv: e.target.value }))
                      }
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="btn-outline"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={processing}
                    className="btn-primary flex-1 justify-center"
                  >
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Place Order — $${grandTotal.toLocaleString()}`
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-artisan-cream p-6 sticky top-24">
              <h3
                className="font-body text-xs tracking-widest uppercase text-artisan-charcoal mb-5 font-500"
                style={{ letterSpacing: "0.15em" }}
              >
                Order Summary
              </h3>
              <div className="space-y-4 mb-5 max-h-64 overflow-y-auto">
                {displayItems.map((item) => (
                  <div key={item.key} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="w-full h-full object-cover bg-artisan-warm"
                      />
                      <span className="absolute -top-2 -right-2 bg-artisan-brown text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-artisan-charcoal truncate">
                        {item.name}
                      </p>
                      <p className="font-body text-xs text-artisan-gray-soft mt-0.5">
                        ${parseFloat(item.price).toLocaleString()} ea.
                      </p>
                    </div>
                    <p className="font-body text-sm text-artisan-charcoal">
                      $
                      {(
                        parseFloat(item.price) * item.quantity
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-artisan-warm-dark pt-4 space-y-2">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-artisan-gray-soft">Subtotal</span>
                  <span>${displaySubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-artisan-gray-soft">Delivery</span>
                  <span
                    className={
                      displayDelivery === 0 ? "text-artisan-brown" : ""
                    }
                  >
                    {displayDelivery === 0
                      ? "Complimentary"
                      : `$${displayDelivery}`}
                  </span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-artisan-gray-soft">Tax (8%)</span>
                  <span>${displayTax.toLocaleString()}</span>
                </div>
              </div>
              <div className="border-t border-artisan-warm-dark mt-4 pt-4 flex justify-between items-baseline">
                <span className="font-body text-sm font-500">Total</span>
                <span className="font-display text-2xl text-artisan-charcoal">
                  ${displayTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
