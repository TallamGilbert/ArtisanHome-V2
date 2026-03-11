import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { StoreProvider } from "./context/StoreContext";
import ScrollToTop from "./components/common/ScrollToTop";

// Layouts
import CustomerLayout from "./components/layout/CustomerLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Customer Pages
import HomePage from "./pages/customer/HomePage";
import ShopPage from "./pages/customer/ShopPage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import { CartPage } from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import { InspirationPage, WishlistPage } from "./pages/customer/OtherPages";
import AboutPage from "./pages/customer/AboutPage";
import { LoginPage, RegisterPage } from "./pages/customer/AuthPages";
import AccountPage from "./pages/customer/AccountPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReviews from "./pages/admin/AdminReviews";

import { AdminCategories, AdminCustomers } from "./pages/admin/AdminOtherPages";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <CartProvider>
            <WishlistProvider>
              <ScrollToTop />
              <Routes>
                {/* Auth (no layout) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />

                {/* Customer */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/inspiration" element={<InspirationPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/account" element={<AccountPage />} />
                </Route>

                {/* Admin */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="reviews" element={<AdminReviews />} />
                </Route>
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
