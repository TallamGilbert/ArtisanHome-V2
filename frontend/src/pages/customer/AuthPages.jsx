import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login(email, password);
      toast.success(`Welcome back, ${userData.name}`);
      navigate(userData.is_admin ? "/admin" : "/");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.message ||
        "Invalid credentials. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-artisan-cream flex">
      {/* Image — fixed to viewport height */}
      <div className="hidden lg:block lg:w-1/2 relative h-screen sticky top-0">
        <img
          src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1000"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-artisan-charcoal/30" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="font-display text-4xl text-white font-300 leading-tight mb-3">
            "Good design is about making things better, not just making them
            different."
          </p>
          <p className="font-body text-sm text-white/70">
            — The ArtisanHome Philosophy
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-block mb-10">
            <span className="font-display text-3xl text-artisan-charcoal">
              ArtisanHome
            </span>
          </Link>
          <h1 className="font-display text-4xl font-300 text-artisan-charcoal mb-2">
            Welcome Back
          </h1>
          <p className="font-body text-sm text-artisan-gray-soft mb-10">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body text-xs text-artisan-gray-soft mb-1.5 tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-body text-xs text-artisan-gray-soft mb-1.5 tracking-wide">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </div>
            <div className="flex justify-end">
              <a
                href="#"
                className="font-body text-xs text-artisan-brown hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="font-body text-sm text-artisan-gray-soft text-center mt-6">
            New to ArtisanHome?{" "}
            <Link to="/register" className="text-artisan-brown hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created! Welcome to ArtisanHome.");
      navigate("/");
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0]?.[0];
        toast.error(first || "Registration failed. Please check your details.");
      } else {
        toast.error(
          err.response?.data?.message || "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-artisan-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-block mb-10">
          <span className="font-display text-3xl text-artisan-charcoal">
            ArtisanHome
          </span>
        </Link>
        <h1 className="font-display text-4xl font-300 text-artisan-charcoal mb-2">
          Create Account
        </h1>
        <p className="font-body text-sm text-artisan-gray-soft mb-10">
          Join our community of design lovers
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              className="input-field"
            />
          </div>
          <div>
            <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              className="input-field"
            />
          </div>
          <div>
            <label className="block font-body text-xs text-artisan-gray-soft mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={form.password_confirmation}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  password_confirmation: e.target.value,
                }))
              }
              className="input-field"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-2"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="font-body text-sm text-artisan-gray-soft text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-artisan-brown hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
