import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

const TEAM = [
  {
    name: "Amina Kariuki",
    role: "Founder & Creative Director",
    bio: "With 25 years in furniture design, Amina founded ArtisanHome with a singular belief: that beautiful, lasting furniture should be accessible to every Kenyan home.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
  },
  {
    name: "James Mwangi",
    role: "Head of Craftsmanship",
    bio: "A third-generation woodworker, James oversees every piece that leaves our workshop — ensuring each one meets the standards he learned from his grandfather.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  },
  {
    name: "Wanjiru Odhiambo",
    role: "Lead Designer",
    bio: "Trained in Nairobi and Cape Town, Wanjiru brings a pan-African sensibility to each collection — blending East African craftsmanship with contemporary design.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
  },
  {
    name: "Daniel Osei",
    role: "Sustainability Director",
    bio: "Daniel ensures every material we source meets our strict environmental standards — from responsibly harvested timber to vegetable-tanned leathers.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
  },
];

const VALUES = [
  {
    icon: "◈",
    title: "Uncompromising Craft",
    desc: "Every joint is hand-fitted, every surface hand-finished. We believe the details that go unseen are the ones that matter most.",
  },
  {
    icon: "◉",
    title: "Sustainable by Design",
    desc: "We source only responsibly harvested Kenyan hardwoods, recycled metals, and natural textiles. Beautiful furniture should never come at the planet's expense.",
  },
  {
    icon: "◻",
    title: "Built to Last",
    desc: "We design with the next generation in mind. Our 15-year structural warranty is our promise that ArtisanHome pieces are heirlooms, not disposables.",
  },
  {
    icon: "◷",
    title: "Honest Pricing",
    desc: "No markups for markups' sake. We price fairly — reflecting the true cost of quality materials and skilled labour, nothing more.",
  },
];

const MILESTONES = [
  {
    year: "2010",
    event:
      "Founded in a small Nairobi workshop with five pieces and a vision.",
  },
  {
    year: "2013",
    event:
      "Opened our first showroom in Westlands, Nairobi. Sold out within the first month.",
  },
  {
    year: "2016",
    event:
      "Expanded to a 40,000 sq ft production facility on the outskirts of Nairobi.",
  },
  {
    year: "2019",
    event: "Launched our sustainability pledge — carbon neutral by 2025.",
  },
  {
    year: "2022",
    event: "Reached 50,000 homes across East Africa.",
  },
  {
    year: "2024",
    event:
      "Certified B Corporation. Recognised as one of East Africa's most sustainable brands.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1597534458220-9fb4969f2df5?w=1920&q=85"
          alt="Craftsman at work"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full">
            <div className="max-w-xl">
              <p className="section-label text-artisan-warm mb-4">Our Story</p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-300 text-white leading-tight mb-6">
                Made with
                <br />
                Intention
              </h1>
              <p className="font-body text-base text-white/80 leading-relaxed max-w-md">
                ArtisanHome was born from a simple idea — that the furniture we
                live with every day should be as beautiful and enduring as the
                moments it frames.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <p className="section-label mb-4">Who We Are</p>
            <h2 className="section-title mb-6">
              A Workshop,
              <br />
              Not a Factory
            </h2>
            <div className="w-12 h-px bg-artisan-brown mb-8" />
            <p className="font-body text-base text-artisan-gray-soft leading-relaxed mb-5">
              ArtisanHome began in 2010 in a small Nairobi workshop, where
              founder Amina Kariuki and a team of five craftspeople set out to
              make furniture the way it used to be made — slowly, carefully, and
              with genuine pride.
            </p>
            <p className="font-body text-base text-artisan-gray-soft leading-relaxed mb-5">
              Fourteen years later, we've grown to a 40,000 square foot
              production facility — but our methods haven't changed. Every piece
              is still built by hand, by people who care deeply about their
              work.
            </p>
            <p className="font-body text-base text-artisan-gray-soft leading-relaxed mb-10">
              We believe your home deserves furniture that tells a story,
              furniture that improves with age, and furniture that can be passed
              down. That's what we make.
            </p>
            <Link to="/shop" className="btn-primary">
              Explore the Collection
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"
                    alt="Living room"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="aspect-square overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600"
                    alt="Dining"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600"
                    alt="Bedroom"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600"
                    alt="Office"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-artisan-brown py-20 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { number: "14+", label: "Years of Craft" },
            { number: "50K+", label: "Kenyan Homes Furnished" },
            { number: "200+", label: "Local Artisans Employed" },
            { number: "15yr", label: "Structural Warranty" },
          ].map((stat, i) => (
            <AnimatedSection
              key={stat.label}
              delay={i * 100}
              className="text-center"
            >
              <p className="font-display text-5xl lg:text-6xl font-300 text-white mb-2">
                {stat.number}
              </p>
              <p className="font-body text-sm text-white/60 tracking-wide">
                {stat.label}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Values */}
      <section
        id="craftsmanship"
        className="py-24 px-6 lg:px-12 bg-artisan-cream"
      >
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <p className="section-label mb-3">What We Stand For</p>
            <h2 className="section-title">Our Values</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 100}>
                <div className="bg-white p-8 h-full">
                  <div className="w-12 h-12 bg-artisan-beige flex items-center justify-center mb-6 text-artisan-brown text-xl">
                    {value.icon}
                  </div>
                  <h3 className="font-display text-xl font-400 text-artisan-charcoal mb-3">
                    {value.title}
                  </h3>
                  <p className="font-body text-sm text-artisan-gray-soft leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship process */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=900"
                  alt="Woodworking"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-artisan-brown p-8 hidden lg:block">
                <p className="font-display text-4xl text-white font-300">30+</p>
                <p className="font-body text-xs text-white/70 mt-1">
                  Hours per piece,
                  <br />
                  on average
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <p className="section-label mb-4">How We Build</p>
            <h2 className="font-display text-4xl lg:text-5xl font-300 text-artisan-charcoal leading-tight mb-6">
              The Making of
              <br />
              an ArtisanHome Piece
            </h2>
            <div className="w-12 h-px bg-artisan-brown mb-8" />
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Material Selection",
                  desc: "Every project begins with hand-selecting timber, leathers, and textiles — choosing pieces with the right grain, weight, and character.",
                },
                {
                  step: "02",
                  title: "Joinery & Structure",
                  desc: "Our joiners use traditional mortise-and-tenon and dovetail techniques that have stood the test of centuries.",
                },
                {
                  step: "03",
                  title: "Hand Finishing",
                  desc: "Each surface is sanded through seven grits before receiving a hand-applied oil or lacquer finish.",
                },
                {
                  step: "04",
                  title: "Quality Inspection",
                  desc: "Every piece passes a 47-point inspection before it earns the ArtisanHome mark.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-5">
                  <span
                    className="font-body text-xs text-artisan-brown font-500 mt-1 flex-shrink-0"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    {item.step}
                  </span>
                  <div>
                    <h4 className="font-body text-sm font-500 text-artisan-charcoal mb-1">
                      {item.title}
                    </h4>
                    <p className="font-body text-sm text-artisan-gray-soft leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Sustainability */}
      <section
        id="sustainability"
        className="bg-artisan-charcoal py-24 px-6 lg:px-12"
      >
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <p className="section-label text-artisan-warm mb-4">Environment</p>
            <h2 className="font-display text-4xl lg:text-5xl font-300 text-white leading-tight mb-6">
              Sustainability
              <br />
              is Not Optional
            </h2>
            <div className="w-12 h-px bg-artisan-brown mb-8" />
            <p className="font-body text-sm text-white/70 leading-relaxed mb-5">
              We believe beautiful furniture and environmental responsibility
              are not in conflict — they are the same thing. Furniture built to
              last doesn't end up in landfill.
            </p>
            <p className="font-body text-sm text-white/70 leading-relaxed mb-10">
              Every piece of timber we use is responsibly sourced from Kenyan forests.
              Our leathers are vegetable-tanned using traditional methods. Our packaging
              is 100% recycled and recyclable. And we offset every tonne of carbon our
              production generates.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Responsibly Sourced", sub: "All Kenyan timber" },
                { label: "Carbon Offset", sub: "100% of production" },
                { label: "B Corp", sub: "Certified 2024" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border border-white/10 p-4 text-center"
                >
                  <p className="font-body text-xs font-500 text-white mb-1">
                    {item.label}
                  </p>
                  <p className="font-body text-xs text-white/40">{item.sub}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={150}>
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1542601906897-2dbb9d4bdb4b?w=900"
                alt="Sustainable forest"
                className="w-full h-full object-cover"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 lg:px-12 bg-artisan-beige">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <p className="section-label mb-3">Made in Kenya, Since 2010</p>
            <h2 className="section-title">Our Journey</h2>
          </AnimatedSection>

          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-artisan-warm-dark hidden md:block" />
            <div className="space-y-10">
              {MILESTONES.map((m, i) => (
                <AnimatedSection key={m.year} delay={i * 80}>
                  <div className="flex gap-8 items-start">
                    <div className="w-32 flex-shrink-0 text-right hidden md:block">
                      <span className="font-display text-2xl text-artisan-brown font-400">
                        {m.year}
                      </span>
                    </div>
                    <div className="relative hidden md:block">
                      <div className="w-3 h-3 bg-artisan-brown rounded-full mt-2 relative z-10" />
                    </div>
                    <div className="flex-1 pb-2">
                      <span className="font-display text-xl text-artisan-brown font-400 md:hidden">
                        {m.year} —{" "}
                      </span>
                      <p className="font-body text-base text-artisan-charcoal leading-relaxed inline">
                        {m.event}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <AnimatedSection className="text-center mb-16">
            <p className="section-label mb-3">The People Behind the Pieces</p>
            <h2 className="section-title">Meet the Team</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 100}>
                <div className="group">
                  <div className="aspect-[3/4] overflow-hidden mb-5 bg-artisan-cream">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="font-display text-xl font-400 text-artisan-charcoal mb-1">
                    {member.name}
                  </h3>
                  <p className="font-body text-xs text-artisan-brown tracking-wide mb-3">
                    {member.role}
                  </p>
                  <p className="font-body text-sm text-artisan-gray-soft leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-artisan-cream py-24 px-6 lg:px-12 text-center">
        <AnimatedSection>
          <p className="section-label mb-4">Ready to Begin?</p>
          <h2 className="section-title mb-6">Find Your Perfect Piece</h2>
          <p className="font-body text-base text-artisan-gray-soft max-w-xl mx-auto mb-10">
            Browse our full collection of handcrafted furniture, or visit our
            Nairobi showroom to experience the quality in person.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/shop" className="btn-primary">
              Shop the Collection
            </Link>
            <Link to="/inspiration" className="btn-outline">
              View Inspiration
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
