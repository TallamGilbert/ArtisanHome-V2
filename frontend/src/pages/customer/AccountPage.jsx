import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AccountPage() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-artisan-charcoal">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-artisan-cream">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-cormorant text-4xl text-artisan-charcoal mb-2">
            My Account
          </h1>
          <p className="text-gray-500">Welcome back, {user.name}</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="font-cormorant text-2xl text-artisan-charcoal mb-6">
            Profile Details
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-artisan-brown flex items-center justify-center text-white text-2xl font-cormorant">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-artisan-charcoal text-lg">
                  {user.name}
                </p>
                <p className="text-gray-500">{user.email}</p>
                {user.is_admin && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-artisan-brown text-white text-xs rounded">
                    Admin
                  </span>
                )}
              </div>
            </div>
            {user.phone && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-artisan-charcoal">{user.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => navigate("/wishlist")}
            className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
          >
            <div className="text-artisan-brown mb-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-artisan-charcoal">Wishlist</h3>
            <p className="text-sm text-gray-500 mt-1">View your saved items</p>
          </button>

          <button
            onClick={() => navigate("/shop")}
            className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
          >
            <div className="text-artisan-brown mb-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="font-medium text-artisan-charcoal">
              Continue Shopping
            </h3>
            <p className="text-sm text-gray-500 mt-1">Browse our collection</p>
          </button>

          {user.is_admin && (
            <button
              onClick={() => navigate("/admin")}
              className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow sm:col-span-2"
            >
              <div className="text-artisan-brown mb-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-artisan-charcoal">
                Admin Dashboard
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage products, orders and more
              </p>
            </button>
          )}
        </div>

        {/* Logout */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full sm:w-auto px-8 py-3 border border-artisan-brown text-artisan-brown hover:bg-artisan-brown hover:text-white transition-colors rounded text-sm tracking-widest uppercase disabled:opacity-50"
          >
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
