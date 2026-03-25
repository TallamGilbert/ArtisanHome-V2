import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";
import ProductCard from "../../components/common/ProductCard";
import api from "../../services/api";

function StarRating({ rating, size = "sm" }) {
  const sz = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`${sz} ${i <= Math.round(rating) ? "text-artisan-brown" : "text-artisan-warm-dark"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, loading, getProductBySlug, getRelated } = useStore();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const product = getProductBySlug(id);
  const related = product ? getRelated(product) : [];
  const wishlisted = product ? isWishlisted(product.id) : false;

  useEffect(() => {
    setActiveImage(0);
    setQuantity(1);
    setActiveTab("description");
    setZoomed(false);
  }, [id]);

  useEffect(() => {
    if (product?.colors?.length) setSelectedColor(product.colors[0]);
  }, [product?.id]);

  // Fetch real reviews from API
  useEffect(() => {
    if (!product?.id) return;
    setReviewsLoading(true);
    api
      .get(`/products/${product.id}/reviews`)
      .then((res) => setReviews(res.data.data || []))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, [product?.id]);

  const handleMouseMove = (e) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleAddToCart = () => {
    addItem({ ...product, quantity }, 1, { color: selectedColor });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;
    setSubmitting(true);
    setReviewError("");
    try {
      const res = await api.post(`/products/${product.id}/reviews`, newReview);
      setReviews((prev) => [res.data, ...prev]);
      setNewReview({ rating: 5, comment: "" });
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="font-body text-sm text-gray-400">Loading…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="font-display text-2xl text-artisan-charcoal">
          Product not found
        </p>
        <button onClick={() => navigate("/shop")} className="btn-primary">
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5">
        <div className="flex items-center gap-2 font-body text-xs text-artisan-gray-soft">
          <Link to="/" className="hover:text-artisan-brown">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-artisan-brown">
            Shop
          </Link>
          <span>/</span>
          <Link
            to={`/shop?category=${product.category?.slug}`}
            className="hover:text-artisan-brown"
          >
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-artisan-charcoal">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Images */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-3 w-20 flex-shrink-0">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 overflow-hidden border-2 transition-colors ${i === activeImage ? "border-artisan-brown" : "border-transparent"}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="flex-1 relative">
              <div
                className={`relative overflow-hidden bg-artisan-cream ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                style={{ aspectRatio: "4/5" }}
                onClick={() => setZoomed(!zoomed)}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setZoomed(false)}
              >
                <img
                  src={product.images?.[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-200"
                  style={
                    zoomed
                      ? {
                          transform: "scale(2)",
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        }
                      : {}
                  }
                />
                <div className="absolute bottom-4 right-4 bg-white/80 text-artisan-charcoal text-xs font-body px-3 py-1.5 backdrop-blur-sm">
                  {zoomed ? "Click to zoom out" : "Click to zoom"}
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="lg:pt-4">
            <p className="section-label mb-3">{product.category?.name}</p>
            <h1 className="font-display text-4xl lg:text-5xl font-400 text-artisan-charcoal leading-tight mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-5">
              <StarRating rating={product.rating} />
              <span className="font-body text-sm text-artisan-gray-soft">
                {product.rating} ({product.reviews_count} reviews)
              </span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-4xl text-artisan-charcoal">
                KSh{product.price?.toLocaleString('en-KE')}
              </span>
              {product.original_price && (
                <span className="font-body text-lg text-artisan-gray-soft line-through">
                  KSh{product.original_price?.toLocaleString('en-KE')}
                </span>
              )}
            </div>
            <div className="w-16 h-px bg-artisan-warm-dark mb-6" />

            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p
                  className="font-body text-xs tracking-widest uppercase text-artisan-charcoal mb-3 font-500"
                  style={{ letterSpacing: "0.15em" }}
                >
                  Finish:{" "}
                  <span className="text-artisan-brown">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 font-body text-xs border transition-all ${
                        selectedColor === color
                          ? "border-artisan-brown bg-artisan-brown text-white"
                          : "border-artisan-warm-dark text-artisan-charcoal hover:border-artisan-brown"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <p
                className="font-body text-xs tracking-widest uppercase text-artisan-charcoal mb-3 font-500"
                style={{ letterSpacing: "0.15em" }}
              >
                Quantity
              </p>
              <div className="flex items-center border border-artisan-warm-dark w-fit">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 text-xl hover:bg-artisan-cream flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-12 text-center font-body text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock || 10, q + 1))
                  }
                  className="w-12 h-12 text-xl hover:bg-artisan-cream flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 justify-center"
              >
                Add to Cart — KSh{(product.price * quantity).toLocaleString('en-KE')}
              </button>
              <button
                onClick={() => toggle(product)}
                className={`w-14 h-14 border flex items-center justify-center transition-all ${wishlisted ? "border-artisan-brown bg-artisan-brown" : "border-artisan-warm-dark hover:border-artisan-brown"}`}
              >
                <svg
                  className={`w-5 h-5 ${wishlisted ? "text-white fill-white" : "text-artisan-charcoal"}`}
                  fill={wishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </button>
            </div>

            {product.stock < 10 && product.stock > 0 && (
              <p className="font-body text-xs text-amber-700 mb-4">
                Only {product.stock} left in stock
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-artisan-warm mb-6">
              {[
                { label: "Material", value: product.material },
                { label: "Dimensions", value: product.dimensions },
                { label: "Weight", value: product.weight },
                { label: "Finish", value: product.finish },
              ].map(
                ({ label, value }) =>
                  value && (
                    <div key={label}>
                      <p className="font-body text-xs text-artisan-gray-soft uppercase tracking-wider mb-1">
                        {label}
                      </p>
                      <p className="font-body text-sm text-artisan-charcoal">
                        {value}
                      </p>
                    </div>
                  ),
              )}
            </div>

            <div className="space-y-3">
              {[
                { icon: "🚚", text: "Complimentary white-glove delivery" },
                { icon: "🔄", text: "30-day return policy" },
                { icon: "🛡️", text: "15-year structural warranty" },
                { icon: "📐", text: "Free design consultation" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span>{icon}</span>
                  <span className="font-body text-sm text-artisan-gray-soft">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20 border-t border-artisan-warm pt-12">
          <div className="flex gap-8 border-b border-artisan-warm mb-10">
            {[
              { id: "description", label: "Description" },
              { id: "dimensions", label: "Dimensions & Care" },
              {
                id: "reviews",
                label: `Reviews (${reviews.length || product.reviews_count || 0})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-body text-sm pb-4 border-b-2 transition-all -mb-px ${activeTab === tab.id ? "border-artisan-brown text-artisan-brown" : "border-transparent text-artisan-gray-soft hover:text-artisan-charcoal"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div className="max-w-2xl">
              <p className="font-body text-base text-artisan-charcoal leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {activeTab === "dimensions" && (
            <div className="grid md:grid-cols-2 gap-10 max-w-2xl">
              <div>
                <h4 className="font-body text-xs tracking-widest uppercase text-artisan-charcoal mb-4 font-500">
                  Dimensions
                </h4>
                <div className="space-y-3">
                  {[
                    { label: "Dimensions", value: product.dimensions },
                    { label: "Weight", value: product.weight },
                    { label: "Material", value: product.material },
                    { label: "Finish", value: product.finish },
                  ].map(
                    ({ label, value }) =>
                      value && (
                        <div
                          key={label}
                          className="flex justify-between border-b border-artisan-warm pb-2"
                        >
                          <span className="font-body text-sm text-artisan-gray-soft">
                            {label}
                          </span>
                          <span className="font-body text-sm text-artisan-charcoal">
                            {value}
                          </span>
                        </div>
                      ),
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-body text-xs tracking-widest uppercase text-artisan-charcoal mb-4 font-500">
                  Care Instructions
                </h4>
                <ul className="space-y-2">
                  {[
                    "Dust regularly with a soft, dry cloth",
                    "Avoid direct sunlight to prevent fading",
                    "Use coasters to protect surfaces",
                    "Professional cleaning recommended annually",
                  ].map((tip) => (
                    <li
                      key={tip}
                      className="flex gap-2 font-body text-sm text-artisan-charcoal"
                    >
                      <span className="text-artisan-brown mt-0.5">·</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-2xl">
              {/* Rating summary */}
              <div className="flex items-center gap-6 mb-10 p-6 bg-artisan-cream">
                <div className="text-center">
                  <p className="font-display text-5xl text-artisan-charcoal">
                    {product.rating}
                  </p>
                  <StarRating rating={product.rating} size="lg" />
                  <p className="font-body text-xs text-artisan-gray-soft mt-1">
                    {reviews.length} reviews
                  </p>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-3 mb-1">
                      <span className="font-body text-xs text-artisan-gray-soft w-4">
                        {star}
                      </span>
                      <div className="flex-1 bg-artisan-warm h-1.5">
                        <div
                          className="bg-artisan-brown h-full"
                          style={{
                            width: star >= 4 ? `${star * 18}%` : `${star * 8}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit review */}
              {user ? (
                <form
                  onSubmit={handleSubmitReview}
                  className="mb-10 p-6 border border-artisan-warm rounded"
                >
                  <h3 className="font-cormorant text-xl text-artisan-charcoal mb-4">
                    Write a Review
                  </h3>
                  <div className="mb-4">
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Your Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setNewReview((r) => ({ ...r, rating: star }))
                          }
                        >
                          <svg
                            className={`w-7 h-7 transition-colors ${star <= newReview.rating ? "text-artisan-brown" : "text-artisan-warm-dark"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Comment
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview((r) => ({ ...r, comment: e.target.value }))
                      }
                      rows={4}
                      className="w-full border border-artisan-warm rounded px-4 py-3 text-sm focus:outline-none focus:border-artisan-brown resize-none"
                      placeholder="Share your experience with this product..."
                    />
                  </div>
                  {reviewError && (
                    <p className="text-red-500 text-sm mb-3">{reviewError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting || !newReview.comment.trim()}
                    className="px-8 py-3 bg-artisan-brown text-white text-xs tracking-widest uppercase hover:bg-artisan-charcoal transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Submitting…" : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="mb-10 p-6 border border-artisan-warm rounded text-center">
                  <p className="text-gray-500 text-sm mb-3">
                    Sign in to leave a review
                  </p>
                  <Link
                    to="/login"
                    className="text-artisan-brown text-sm underline hover:text-artisan-charcoal"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Reviews list */}
              <div className="space-y-8">
                {reviewsLoading ? (
                  <p className="text-gray-400 text-sm">Loading reviews…</p>
                ) : reviews.length === 0 ? (
                  <p className="text-gray-400 text-sm">
                    No reviews yet. Be the first to share your experience!
                  </p>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="pb-8 border-b border-artisan-warm last:border-0"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-artisan-brown rounded-full flex items-center justify-center text-white font-body text-sm font-500">
                            {review.user?.name?.[0] ?? "?"}
                          </div>
                          <div>
                            <p className="font-body text-sm font-500 text-artisan-charcoal">
                              {review.user?.name ?? "Anonymous"}
                            </p>
                            <StarRating rating={review.rating} />
                          </div>
                        </div>
                        <span className="font-body text-xs text-artisan-gray-soft">
                          {new Date(review.created_at).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" },
                          )}
                        </span>
                      </div>
                      <p className="font-body text-sm text-artisan-charcoal leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex justify-between items-end mb-10">
              <div>
                <p className="section-label mb-2">Complete the Look</p>
                <h2 className="font-display text-3xl font-400">
                  You May Also Like
                </h2>
              </div>
              <Link to="/shop" className="btn-ghost hidden md:inline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
