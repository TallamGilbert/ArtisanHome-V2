import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard";
import { useStore } from "../../context/StoreContext";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Most Popular" },
  { value: "newest", label: "Newest" },
];

const PRICE_RANGES = [
  { label: "Under $500", min: 0, max: 500 },
  { label: "$500 – $1,500", min: 500, max: 1500 },
  { label: "$1,500 – $3,000", min: 1500, max: 3000 },
  { label: "$3,000 – $6,000", min: 3000, max: 6000 },
  { label: "$6,000+", min: 6000, max: Infinity },
];

const MATERIALS = [
  "Leather",
  "Linen",
  "Velvet",
  "Solid Wood",
  "Stone",
  "Brass",
  "Bouclé",
];

export default function ShopPage() {
  const {
    products: MOCK_PRODUCTS,
    categories: MOCK_CATEGORIES,
    loading,
  } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("featured");
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category") ? [searchParams.get("category")] : [],
  );
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const searchQuery = searchParams.get("search") || "";

  const filtered = useMemo(() => {
    let products = [...MOCK_PRODUCTS];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q),
      );
    }

    if (selectedCategories.length > 0) {
      products = products.filter((p) =>
        selectedCategories.includes(p.category?.slug),
      );
    }

    if (selectedPrices.length > 0) {
      products = products.filter((p) => {
        return selectedPrices.some((range) => {
          const r = PRICE_RANGES.find((pr) => pr.label === range);
          return r && p.price >= r.min && p.price < r.max;
        });
      });
    }

    if (selectedMaterials.length > 0) {
      products = products.filter((p) =>
        selectedMaterials.some(
          (m) => p.material?.includes(m) || p.tags?.includes(m),
        ),
      );
    }

    switch (sort) {
      case "price-asc":
        return products.sort((a, b) => a.price - b.price);
      case "price-desc":
        return products.sort((a, b) => b.price - a.price);
      case "rating":
        return products.sort((a, b) => b.rating - a.rating);
      case "newest":
        return products.sort((a, b) => b.id - a.id);
      default:
        return products;
    }
  }, [
    sort,
    selectedCategories,
    selectedPrices,
    selectedMaterials,
    searchQuery,
  ]);

  const toggleFilter = (arr, setArr, value) => {
    setArr((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPrices([]);
    setSelectedMaterials([]);
    setSearchParams({});
  };

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedPrices.length > 0 ||
    selectedMaterials.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-artisan-cream border-b border-artisan-warm">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
          <p className="section-label mb-2">Furniture</p>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <h1 className="section-title">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategories.length === 1
                  ? MOCK_CATEGORIES.find(
                      (c) => c.slug === selectedCategories[0],
                    )?.name || "All Furniture"
                  : "All Furniture"}
            </h1>
            <p className="font-body text-sm text-artisan-gray-soft">
              {filtered.length} pieces
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-artisan-warm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 font-body text-sm text-artisan-charcoal hover:text-artisan-brown transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                />
              </svg>
              Filters{" "}
              {hasFilters && (
                <span className="bg-artisan-brown text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {selectedCategories.length +
                    selectedPrices.length +
                    selectedMaterials.length}
                </span>
              )}
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="font-body text-xs text-artisan-gray-soft hover:text-artisan-brown underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-body text-xs text-artisan-gray-soft hidden md:inline">
              Sort by:
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="font-body text-sm text-artisan-charcoal bg-transparent border-b border-artisan-warm-dark focus:outline-none focus:border-artisan-brown cursor-pointer py-1"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Sidebar Filters */}
          {filtersOpen && (
            <div className="w-56 flex-shrink-0 animate-fade-in">
              {/* Categories */}
              <div className="mb-8">
                <h3
                  className="font-body text-xs tracking-widest uppercase text-artisan-charcoal mb-4 font-500"
                  style={{ letterSpacing: "0.15em" }}
                >
                  Room
                </h3>
                <div className="space-y-2">
                  {MOCK_CATEGORIES.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.slug)}
                        onChange={() =>
                          toggleFilter(
                            selectedCategories,
                            setSelectedCategories,
                            cat.slug,
                          )
                        }
                        className="w-3.5 h-3.5 rounded-none border-artisan-warm-dark text-artisan-brown focus:ring-artisan-brown"
                      />
                      <span className="font-body text-sm text-artisan-charcoal group-hover:text-artisan-brown transition-colors">
                        {cat.name}
                      </span>
                      <span className="font-body text-xs text-artisan-gray-soft ml-auto">
                        {cat.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-8 border-t border-artisan-warm pt-6">
                <h3
                  className="font-body text-xs tracking-widest uppercase text-artisan-charcoal mb-4 font-500"
                  style={{ letterSpacing: "0.15em" }}
                >
                  Price
                </h3>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <label
                      key={range.label}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPrices.includes(range.label)}
                        onChange={() =>
                          toggleFilter(
                            selectedPrices,
                            setSelectedPrices,
                            range.label,
                          )
                        }
                        className="w-3.5 h-3.5 border-artisan-warm-dark text-artisan-brown"
                      />
                      <span className="font-body text-sm text-artisan-charcoal group-hover:text-artisan-brown transition-colors">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="border-t border-artisan-warm pt-6">
                <h3
                  className="font-body text-xs tracking-widest uppercase text-artisan-charcoal mb-4 font-500"
                  style={{ letterSpacing: "0.15em" }}
                >
                  Material
                </h3>
                <div className="space-y-2">
                  {MATERIALS.map((mat) => (
                    <label
                      key={mat}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(mat)}
                        onChange={() =>
                          toggleFilter(
                            selectedMaterials,
                            setSelectedMaterials,
                            mat,
                          )
                        }
                        className="w-3.5 h-3.5 border-artisan-warm-dark text-artisan-brown"
                      />
                      <span className="font-body text-sm text-artisan-charcoal group-hover:text-artisan-brown transition-colors">
                        {mat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-3xl text-artisan-charcoal mb-3">
                  No pieces found
                </p>
                <p className="font-body text-sm text-artisan-gray-soft mb-6">
                  Try adjusting your filters
                </p>
                <button onClick={clearFilters} className="btn-outline">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${filtersOpen ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}
              >
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
