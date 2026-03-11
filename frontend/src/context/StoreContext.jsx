import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { productService, categoryService } from "../services/index";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ── Initial fetch ─────────────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await productService.getAll({ per_page: 100 });
      const raw = res.data?.data ?? res.data ?? [];
      setProducts(raw.map(normalizeProduct));
    } catch (e) {
      console.error("fetchProducts failed", e);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const res = await categoryService.getAll();
      setCategories(res.data?.data ?? res.data ?? []);
    } catch (e) {
      console.error("fetchCategories failed", e);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // ── Products CRUD ─────────────────────────────────────────────────────────

  const addProduct = useCallback(async (form) => {
    const res = await productService.create(buildPayload(form));
    const created = normalizeProduct(res.data);
    setProducts((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateProduct = useCallback(async (id, form) => {
    const res = await productService.update(id, buildPayload(form));
    const updated = normalizeProduct(res.data);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    await productService.delete(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ── Categories CRUD ───────────────────────────────────────────────────────

  const addCategory = useCallback(async (form) => {
    const res = await categoryService.create(form);
    setCategories((prev) => [...prev, res.data]);
    return res.data;
  }, []);

  const updateCategory = useCallback(async (id, form) => {
    const res = await categoryService.update(id, form);
    const updated = res.data;
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setProducts((prev) =>
      prev.map((p) =>
        p.category?.id === id ? { ...p, category: updated } : p,
      ),
    );
    return updated;
  }, []);

  const deleteCategory = useCallback(async (id) => {
    await categoryService.delete(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // ── Lookup helpers ────────────────────────────────────────────────────────

  const getProductBySlug = useCallback(
    (slug) =>
      products.find((p) => p.slug === slug || p.id === parseInt(slug)) ?? null,
    [products],
  );

  const getRelated = useCallback(
    (product, limit = 4) =>
      products
        .filter(
          (p) => p.id !== product.id && p.category?.id === product.category?.id,
        )
        .slice(0, limit),
    [products],
  );

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        loading: loadingProducts || loadingCategories,
        fetchProducts,
        fetchCategories,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        getProductBySlug,
        getRelated,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);

// ── Helpers ───────────────────────────────────────────────────────────────

function normalizeProduct(p) {
  return {
    ...p,
    price: parseFloat(p.price),
    original_price: p.original_price ? parseFloat(p.original_price) : null,
    rating: parseFloat(p.rating) || 0,
    // API returns flat string array after our controller fix
    images: Array.isArray(p.images)
      ? p.images
          .map((img) => (typeof img === "string" ? img : (img?.url ?? "")))
          .filter(Boolean)
      : [],
    colors: Array.isArray(p.colors) ? p.colors : [],
  };
}

function buildPayload(form) {
  return {
    name: form.name,
    description: form.description || "",
    price: parseFloat(form.price),
    original_price: form.original_price
      ? parseFloat(form.original_price)
      : null,
    category_id: parseInt(form.category_id),
    material: form.material || null,
    finish: form.finish || null,
    dimensions: form.dimensions || null,
    weight: form.weight || null,
    stock: parseInt(form.stock) || 0,
    colors:
      typeof form.colors === "string"
        ? form.colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : form.colors || [],
    is_featured: !!form.is_featured,
    is_best_seller: !!form.is_best_seller,
    images: form.images || [],
  };
}
