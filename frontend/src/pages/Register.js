import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    setSuccess(false);
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      setSuccess(true);
      setMessage("Account created successfully! Redirecting to login...");
      setForm({ name: "", email: "", password: "", role: form.role });
      navigate("/login");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Unable to register");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12" style={{
      background: "radial-gradient(ellipse at top right, rgba(236,72,153,0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(139,92,246,0.1) 0%, transparent 50%), #0f172a"
    }}>
      {/* Floating orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb" style={{ width: 400, height: 400, top: "5%", right: "-10%", background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)" }} />
        <div className="orb" style={{ width: 300, height: 300, bottom: "10%", left: "-5%", background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)" }} />
      </div>

      <div className="relative w-full max-w-md animate-slide-up z-10">
        {/* Glow border */}
        <div className="absolute -inset-0.5 rounded-2xl opacity-50" style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.5), rgba(139,92,246,0.5))", filter: "blur(10px)" }} />

        <div className="relative rounded-2xl p-8" style={{
          background: "rgba(15,23,42,0.9)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)"
        }}>
          {/* Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg" style={{
            background: "linear-gradient(135deg, #ec4899, #7c3aed)",
            boxShadow: "0 0 30px rgba(236,72,153,0.4)"
          }}>
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>

          <h2 className="mt-5 text-center text-2xl font-extrabold tracking-tight text-white">Create an account</h2>
          <p className="mt-2 text-center text-sm" style={{ color: "#94a3b8" }}>
            Choose your role and start using HomeFeast today.
          </p>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="input-dark w-full rounded-xl px-4 py-3 text-sm"
                placeholder="John Doe"
              />
            </div>

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
                placeholder="Min 6 characters"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>I want to</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange("role", "user")}
                  className="rounded-xl border border-transparent px-4 py-3 text-sm font-semibold transition"
                  style={form.role === "user" ? {
                    background: "rgba(139,92,246,0.15)",
                    border: "1px solid rgba(139,92,246,0.5)",
                    color: "#a78bfa",
                    boxShadow: "0 0 15px rgba(139,92,246,0.3)"
                  } : {
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#94a3b8"
                  }}
                >
                  <span className="mr-1">🍽️</span> Order Food
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("role", "cook")}
                  className="rounded-xl border border-transparent px-4 py-3 text-sm font-semibold transition"
                  style={form.role === "cook" ? {
                    background: "rgba(16,185,129,0.15)",
                    border: "1px solid rgba(16,185,129,0.5)",
                    color: "#34d399",
                    boxShadow: "0 0 15px rgba(16,185,129,0.3)"
                  } : {
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#94a3b8"
                  }}
                >
                  <span className="mr-1">👩‍🍳</span> Cook & Sell
                </button>
              </div>
            </div>

            {message && (
              <div className="rounded-xl px-4 py-3 text-sm font-medium" style={success ? {
                background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399"
              } : {
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171"
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #ec4899, #7c3aed)",
                boxShadow: "0 4px 20px rgba(236,72,153,0.4)"
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "#64748b" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-semibold no-underline" style={{ color: "#ec4899" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
