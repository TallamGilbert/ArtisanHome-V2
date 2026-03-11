import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: "◈" },
  { label: "Products", href: "/admin/products", icon: "◻" },
  { label: "Categories", href: "/admin/categories", icon: "⊞" },
  { label: "Orders", href: "/admin/orders", icon: "◷" },
  { label: "Reviews", href: "/admin/reviews", icon: "★" },
  { label: "Customers", href: "/admin/customers", icon: "◉" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-16" : "w-60"} bg-artisan-charcoal flex-shrink-0 flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/10">
          {!collapsed ? (
            <div>
              <span className="font-display text-xl font-600 text-white">
                ArtisanHome
              </span>
              <p className="font-body text-xs text-white/40 mt-0.5">
                Admin Panel
              </p>
            </div>
          ) : (
            <span className="font-display text-xl text-white">A</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV.map((item) => {
            const isActive =
              item.href === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-3 text-sm font-body transition-all rounded-sm ${isActive ? "bg-artisan-brown text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-6 space-y-1">
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-3 text-sm font-body text-white/60 hover:text-white transition-colors rounded-sm`}
          >
            <span className="text-base flex-shrink-0">↗</span>
            {!collapsed && <span>View Store</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-3 text-sm font-body text-white/60 hover:text-red-400 transition-colors w-full rounded-sm`}
          >
            <span className="text-base flex-shrink-0">→</span>
            {!collapsed && <span>Sign Out</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-3 text-sm font-body text-white/40 hover:text-white transition-colors w-full rounded-sm"
          >
            <span className="text-base">{collapsed ? "»" : "«"}</span>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="font-body text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-artisan-brown rounded-full flex items-center justify-center text-white font-body text-xs font-500">
              A
            </div>
            <span className="font-body text-sm text-gray-600">Admin</span>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
