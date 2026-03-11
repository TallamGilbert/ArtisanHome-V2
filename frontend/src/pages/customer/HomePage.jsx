import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard";
import { MOCK_TESTIMONIALS, MOCK_ROOMS } from "../../services/mockData";
import { useStore } from "../../context/StoreContext";

// Hook for intersection observer animations
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, ...options },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

function AnimatedSection({ children, className = "", delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Hero Section
function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=85",
      label: "New Collection",
      title: "Crafted for\nHow You Live",
      subtitle:
        "Heirloom-quality furniture made by artisans who believe your home should tell your story.",
      cta: "Shop Living Room",
      href: "/shop?category=living-room",
    },
    {
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920&q=85",
      label: "Bedroom Collection",
      title: "Sleep in\nPure Luxury",
      subtitle:
        "Beds and bedroom furniture crafted from sustainably sourced hardwoods and premium textiles.",
      cta: "Shop Bedroom",
      href: "/shop?category=bedroom",
    },
    {
      image:
        "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1920&q=85",
      label: "Dining Collection",
      title: "Gather Around\nSomething Beautiful",
      subtitle:
        "Dining tables and chairs built for the moments that matter most.",
      cta: "Shop Dining",
      href: "/shop?category=dining",
    },
  ];

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % slides.length),
      6000,
    );
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
      {/* Background images */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? "opacity-100" : "opacity-0"}`}
        >
          <img src={s.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center">
        <div className="max-w-xl">
          <p
            key={`label-${currentSlide}`}
            className="section-label text-artisan-warm mb-4 animate-fade-in"
          >
            {slide.label}
          </p>
          <h1
            key={`title-${currentSlide}`}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-300 text-white leading-tight mb-6 animate-fade-up whitespace-pre-line"
          >
            {slide.title}
          </h1>
          <p
            key={`sub-${currentSlide}`}
            className="font-body text-base text-white/80 leading-relaxed mb-10 max-w-sm animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            {slide.subtitle}
          </p>
          <div
            className="flex flex-wrap gap-4 animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <Link to={slide.href} className="btn-primary">
              {slide.cta}
            </Link>
            <Link
              to="/inspiration"
              className="border border-white text-white px-8 py-3.5 font-body text-xs tracking-widest uppercase hover:bg-white hover:text-artisan-charcoal transition-all"
              style={{ letterSpacing: "0.15em" }}
            >
              View Inspiration
            </Link>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-0.5 transition-all duration-300 ${i === currentSlide ? "bg-white w-12" : "bg-white/40 w-4"}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-12 flex flex-col items-center gap-2">
        <p
          className="font-body text-xs text-white/50 tracking-widest uppercase"
          style={{ writingMode: "vertical-rl", letterSpacing: "0.2em" }}
        >
          Scroll
        </p>
        <div className="w-px h-12 bg-white/30 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-white/70 animate-pulse"
            style={{ height: "50%" }}
          />
        </div>
      </div>
    </section>
  );
}

// Category Grid
function CategorySection() {
  const { categories } = useStore();
  return (
    <section className="py-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
      <AnimatedSection className="text-center mb-12">
        <p className="section-label mb-3">Explore</p>
        <h2 className="section-title">Shop by Room</h2>
      </AnimatedSection>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <AnimatedSection key={cat.id} delay={i * 80}>
            <Link
              to={`/shop?category=${cat.slug}`}
              className="group relative overflow-hidden block"
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="font-display text-2xl font-400 text-white mb-1">
                    {cat.name}
                  </h3>
                  <p className="font-body text-xs text-white/70">
                    {cat.count} Pieces
                  </p>
                </div>
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 transition-all duration-300" />
              </div>
            </Link>
          </AnimatedSection>
        ))}{" "}
        {/* <--- The brace belongs here, not after {categories} */}
      </div>
    </section>
  );
}

// Featured Products
function FeaturedSection() {
  const { products, categories } = useStore();
  const featured = products.filter((p) => p.is_featured).slice(0, 4);

  return (
    <section className="py-20 bg-artisan-cream">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <AnimatedSection className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <p className="section-label mb-3">Curated Selection</p>
            <h2 className="section-title">Featured Pieces</h2>
          </div>
          <Link to="/shop" className="btn-ghost mt-4 md:mt-0">
            View All Furniture →
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, i) => (
            <AnimatedSection key={product.id} delay={i * 100}>
              <ProductCard product={product} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Craftsmanship Banner
function CraftsmanshipSection() {
  return (
    <section className="py-0 overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Image */}
        <div className="relative h-[500px] lg:h-[600px]">
          <img
            src="https://images.unsplash.com/photo-1597534458220-9fb4969f2df5?w=1000"
            alt="Craftsman working"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-artisan-brown/10" />
        </div>

        {/* Content */}
        <div className="bg-artisan-charcoal flex items-center px-10 lg:px-16 py-16">
          <div className="max-w-md">
            <AnimatedSection>
              <p className="section-label text-artisan-brown mb-4">
                Our Promise
              </p>
              <h2 className="font-display text-4xl lg:text-5xl font-300 text-white leading-tight mb-6">
                Built by Hand,
                <br />
                Built to Last
              </h2>
              <div className="w-12 h-px bg-artisan-brown mb-8" />
              <p className="font-body text-sm text-white/70 leading-relaxed mb-5">
                Every ArtisanHome piece begins with the finest materials —
                sustainably harvested hardwoods, full-grain leathers, and
                hand-woven textiles — selected by our master craftspeople.
              </p>
              <p className="font-body text-sm text-white/70 leading-relaxed mb-10">
                Each joint is hand-fitted, each surface hand-finished, and each
                piece inspected to ensure it meets our exacting standards before
                it reaches your home.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-10">
                {[
                  ["30+", "Years Experience"],
                  ["100%", "Handcrafted"],
                  ["15yr", "Warranty"],
                ].map(([num, label]) => (
                  <div key={label}>
                    <p className="font-display text-3xl text-white font-300">
                      {num}
                    </p>
                    <p className="font-body text-xs text-white/50 mt-1">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="border border-white/30 text-white px-8 py-3.5 font-body text-xs tracking-widest uppercase hover:border-white hover:bg-white/10 transition-all inline-block"
                style={{ letterSpacing: "0.15em" }}
              >
                Our Story
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}

// Best Sellers
function BestSellersSection() {
  const { products: allProducts } = useStore();
  const bestSellers = allProducts.filter((p) => p.is_best_seller);

  return (
    <section className="py-20 px-6 lg:px-12 max-w-[1440px] mx-auto">
      <AnimatedSection className="text-center mb-12">
        <p className="section-label mb-3">Community Favorites</p>
        <h2 className="section-title">Best Sellers</h2>
      </AnimatedSection>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {bestSellers.slice(0, 4).map((product, i) => (
          <AnimatedSection key={product.id} delay={i * 80}>
            <ProductCard product={product} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

// Room Inspiration
function InspirationSection() {
  return (
    <section className="py-20 bg-artisan-beige">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <AnimatedSection className="flex justify-between items-end mb-12">
          <div>
            <p className="section-label mb-3">Style Guide</p>
            <h2 className="section-title">Room Inspiration</h2>
          </div>
          <Link to="/inspiration" className="btn-ghost hidden md:inline">
            Explore All Rooms →
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_ROOMS.map((room, i) => (
            <AnimatedSection key={room.id} delay={i * 80}>
              <Link
                to="/inspiration"
                className="group block relative overflow-hidden"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="font-body text-xs text-white/70 uppercase tracking-wider mb-1">
                      {room.subtitle}
                    </p>
                    <h3 className="font-display text-xl text-white font-400">
                      {room.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials
function TestimonialsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 bg-artisan-charcoal">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-12">
          <p className="section-label text-artisan-warm mb-3">
            What Our Customers Say
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-300 text-white">
            Loved by Homeowners
          </h2>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center gap-1 mb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-artisan-brown"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <blockquote
              key={active}
              className="font-display text-2xl md:text-3xl font-300 text-white/90 leading-relaxed mb-8 animate-fade-in"
            >
              "{MOCK_TESTIMONIALS[active].text}"
            </blockquote>

            <div className="flex items-center justify-center gap-3">
              <img
                src={MOCK_TESTIMONIALS[active].avatar}
                alt={MOCK_TESTIMONIALS[active].name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="font-body text-sm font-500 text-white">
                  {MOCK_TESTIMONIALS[active].name}
                </p>
                <p className="font-body text-xs text-white/50">
                  {MOCK_TESTIMONIALS[active].location}
                </p>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {MOCK_TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === active ? "bg-artisan-brown w-6" : "bg-white/30"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Materials Section
function MaterialsSection() {
  const materials = [
    {
      name: "Solid Hardwoods",
      desc: "White oak, walnut, ash — sustainably harvested and kiln-dried",
      icon: "🌿",
    },
    {
      name: "Full-Grain Leather",
      desc: "Top-tier hides that develop a rich patina over time",
      icon: "✦",
    },
    {
      name: "Belgian Linen",
      desc: "Stone-washed for exceptional softness and durability",
      icon: "◈",
    },
    {
      name: "Natural Stone",
      desc: "Travertine, marble, and onyx sourced from Italian quarries",
      icon: "◆",
    },
  ];

  return (
    <section className="py-20 px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <AnimatedSection className="text-center mb-14">
          <p className="section-label mb-3">Materials</p>
          <h2 className="section-title">Only the Finest</h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {materials.map((m, i) => (
            <AnimatedSection key={m.name} delay={i * 100}>
              <div className="text-center">
                <div className="w-16 h-16 bg-artisan-cream rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
                  {m.icon}
                </div>
                <h4 className="font-display text-xl font-400 text-artisan-charcoal mb-2">
                  {m.name}
                </h4>
                <p className="font-body text-sm text-artisan-gray-soft leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <FeaturedSection />
      <CraftsmanshipSection />
      <BestSellersSection />
      <InspirationSection />
      <TestimonialsSection />
      <MaterialsSection />
    </div>
  );
}
