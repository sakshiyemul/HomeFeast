import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { persistSession } from "../services/session";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const { data } = await API.post("/auth/login", form);
      persistSession({ token: data.token, user: data.user });
      setForm({ email: "", password: "" });
      navigate(data.user?.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12" style={{
      background: "radial-gradient(ellipse at top left, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(236,72,153,0.1) 0%, transparent 50%), #0f172a"
    }}>
      {/* Floating orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb" style={{ width: 400, height: 400, top: "10%", left: "-10%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />
        <div className="orb" style={{ width: 300, height: 300, bottom: "10%", right: "-5%", background: "radial-gradient(circle, rgba(236,72,153,0.10) 0%, transparent 70%)" }} />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Glow border */}
        <div className="absolute -inset-0.5 rounded-2xl opacity-50" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.5), rgba(236,72,153,0.5))", filter: "blur(10px)" }} />

        <div className="relative rounded-2xl p-8" style={{
          background: "rgba(15,23,42,0.9)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)"
        }}>
          {/* Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg" style={{
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            boxShadow: "0 0 30px rgba(139,92,246,0.4)"
          }}>
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <h2 className="mt-5 text-center text-2xl font-extrabold tracking-tight text-white">Welcome back</h2>
          <p className="mt-2 text-center text-sm" style={{ color: "#94a3b8" }}>
            Sign in to manage your orders, subscriptions, or cook dashboard.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="input-dark w-full rounded-xl px-4 py-3 text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="input-dark w-full rounded-xl px-4 py-3 text-sm"
                placeholder="••••••••"
              />
            </div>

            {message && (
              <div className="rounded-xl border px-4 py-3 text-sm font-medium" style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171"
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                boxShadow: "0 4px 20px rgba(139,92,246,0.4)"
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "#64748b" }}>
            New here?{" "}
            <Link to="/register" className="font-semibold no-underline" style={{ color: "#a78bfa" }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
