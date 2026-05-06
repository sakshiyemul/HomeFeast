import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import CookCard from "../components/CookCard";

const featuredStats = [
  { label: "Cities Served", value: "12+", icon: "🏙️", grad: "linear-gradient(135deg,#7c3aed,#a855f7)" },
  { label: "Home Cooks", value: "210+", icon: "👩‍🍳", grad: "linear-gradient(135deg,#059669,#10b981)" },
  { label: "Meals Delivered", value: "45k+", icon: "🍱", grad: "linear-gradient(135deg,#d97706,#f59e0b)" },
  { label: "Happy Customers", value: "8k+", icon: "😊", grad: "linear-gradient(135deg,#be185d,#ec4899)" }
];

const features = [
  {
    icon: "🛡️",
    title: "Verified Cooks",
    desc: "Every cook is background-checked and approved by our team.",
    grad: "linear-gradient(135deg,#7c3aed,#a855f7)"
  },
  {
    icon: "⏰",
    title: "Flexible Plans",
    desc: "Daily, weekly, or monthly subscriptions — cancel anytime.",
    grad: "linear-gradient(135deg,#0891b2,#06b6d4)"
  },
  {
    icon: "🛒",
    title: "Easy Ordering",
    desc: "Browse menus, pick dishes, and get doorstep delivery.",
    grad: "linear-gradient(135deg,#059669,#10b981)"
  }
];

const inputDark = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  color: "#e2e8f0",
  borderRadius: "12px",
  padding: "10px 14px",
  fontSize: "13px",
  width: "100%",
  outline: "none"
};

function Home() {
  const [cooks, setCooks] = useState([]);
  const [filters, setFilters] = useState({ mealType: "", cuisine: "", mealPlan: "", minPrice: "", maxPrice: "", search: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCook, setSelectedCook] = useState(null);

  const fetchCooks = async () => {
    try {
      setLoading(true);
      const params = {};
      Object.entries(filters).forEach(([key, value]) => { if (value) params[key] = value; });
      const { data } = await API.get("/cooks", { params });
      setCooks(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load cooks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCooks(); }, []); // eslint-disable-line

  const handleFilterChange = (field, value) => setFilters((prev) => ({ ...prev, [field]: value }));
  const handleSubscribe = (cook) => {
    setSelectedCook(cook);
    document.getElementById("subscribe-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="animate-fade-in" style={{ background: "#0f172a", minHeight: "100vh" }}>
      {/* Fixed ambient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{ position: "absolute", width: 700, height: 700, top: "-200px", left: "-200px", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", width: 500, height: 500, top: "30%", right: "-150px", background: "radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", width: 400, height: 400, bottom: "10%", left: "20%", background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #0f172a 100%)"
      }}>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-slide-up">
              <span className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest" style={{
                background: "rgba(139,92,246,0.15)",
                border: "1px solid rgba(139,92,246,0.3)",
                color: "#a78bfa"
              }}>
                ✨ Trusted homemade meals
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Home-cooked food,{" "}
                <span style={{
                  background: "linear-gradient(135deg, #a78bfa, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  delivered fresh
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: "#94a3b8" }}>
                Order hygienic homemade meals on daily, weekly, or monthly subscription plans. Stop compromising on flavour and nutrition.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#cook-list"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white no-underline transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                    boxShadow: "0 4px 20px rgba(139,92,246,0.4)"
                  }}
                >
                  Browse Cooks
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <a
                  href="#subscribe-section"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white no-underline transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(12px)"
                  }}
                >
                  Subscribe Now
                </a>
              </div>
            </div>

            {/* Hero card */}
            <div className="hidden lg:block animate-float">
              <div className="rounded-3xl p-8" style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 60px rgba(139,92,246,0.15)"
              }}>
                <div className="rounded-2xl p-6" style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.15))",
                  border: "1px solid rgba(139,92,246,0.2)"
                }}>
                  <h3 className="text-xl font-bold text-white">🍽️ Home-style comfort</h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                    Freshly cooked, balanced meals powered by verified home cooks in your neighbourhood. From traditional thalis to regional specialties.
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {["South Indian", "North Indian", "Punjabi"].map((cuisine) => (
                      <span key={cuisine} className="rounded-lg py-2 text-center text-xs font-medium text-white" style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.08)"
                      }}>
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mini stat row */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    { label: "Verified Cooks", value: "210+" },
                    { label: "Happy Customers", value: "8k+" }
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-3 text-center" style={{
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)"
                    }}>
                      <p className="text-xl font-black" style={{ color: "#a78bfa" }}>{s.value}</p>
                      <p className="mt-0.5 text-xs" style={{ color: "#475569" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-10 -mt-8 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {featuredStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(12px)"
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 15px 40px rgba(139,92,246,0.2)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-lg" style={{ background: stat.grad }}>
                {stat.icon}
              </div>
              <p className="mt-3 text-2xl font-black text-white">{stat.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-widest" style={{ color: "#475569" }}>{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Why HomeFeast</span>
          <h2 className="mt-3 text-3xl font-extrabold text-white">Better than restaurant delivery</h2>
          <p className="mt-2 text-sm" style={{ color: "#64748b" }}>Real home kitchens. Real care. Real food.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)"
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 20px 50px rgba(139,92,246,0.15)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110" style={{ background: feature.grad }}>
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#64748b" }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FILTERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-5" style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)"
        }}>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white">Find your perfect cook</h3>
              <p className="text-xs" style={{ color: "#64748b" }}>Filter by cuisine, meal type, price, and more</p>
            </div>
            <button
              type="button"
              onClick={fetchCooks}
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                boxShadow: "0 4px 15px rgba(139,92,246,0.3)"
              }}
            >
              {loading ? "Searching..." : "Apply Filters"}
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>Search</label>
              <input type="text" placeholder="Cook name..." value={filters.search} onChange={(e) => handleFilterChange("search", e.target.value)} style={inputDark} className="input-dark" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>Meal Type</label>
              <select value={filters.mealType} onChange={(e) => handleFilterChange("mealType", e.target.value)} style={{ ...inputDark, background: "#1e293b" }}>
                <option value="">Any</option>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>Cuisine</label>
              <input type="text" placeholder="e.g. South Indian" value={filters.cuisine} onChange={(e) => handleFilterChange("cuisine", e.target.value)} style={inputDark} className="input-dark" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>Meal Plan</label>
              <select value={filters.mealPlan} onChange={(e) => handleFilterChange("mealPlan", e.target.value)} style={{ ...inputDark, background: "#1e293b" }}>
                <option value="">Any</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>Min Price</label>
              <input type="number" placeholder="₹" value={filters.minPrice} onChange={(e) => handleFilterChange("minPrice", e.target.value)} style={inputDark} className="input-dark" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>Max Price</label>
              <input type="number" placeholder="₹" value={filters.maxPrice} onChange={(e) => handleFilterChange("maxPrice", e.target.value)} style={inputDark} className="input-dark" />
            </div>
          </div>
        </div>
      </section>

      {/* COOK LISTING */}
      <section id="cook-list" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Discover</span>
          <h2 className="mt-2 text-3xl font-extrabold text-white">Approved Cooks Near You</h2>
          <p className="mt-2 text-sm" style={{ color: "#64748b" }}>Handpicked cooks who serve fresh homemade meals every day.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-400">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-purple-500" style={{ borderColor: "rgba(139,92,246,0.2)", borderTopColor: "#a78bfa" }} />
          </div>
        )}

        {!loading && cooks.length === 0 && (
          <div className="rounded-2xl py-16 text-center" style={{
            background: "rgba(255,255,255,0.02)",
            border: "2px dashed rgba(255,255,255,0.07)"
          }}>
            <p className="text-lg font-semibold" style={{ color: "#475569" }}>No cooks matched your filters yet.</p>
            <p className="mt-2 text-sm" style={{ color: "#334155" }}>Try adjusting your filters or check back later.</p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cooks.map((cook) => (
            <CookCard key={cook._id} cook={cook} onSubscribe={handleSubscribe} />
          ))}
        </div>
      </section>

      {/* SUBSCRIBE CTA */}
      <section id="subscribe-section" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl" style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(236,72,153,0.2) 50%, rgba(8,145,178,0.15) 100%)",
          border: "1px solid rgba(139,92,246,0.25)",
          backdropFilter: "blur(20px)"
        }}>
          <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Ready to eat healthy?</span>
              <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">Plan your meals today</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                {selectedCook
                  ? `You selected ${selectedCook.businessName}. Log in to start your subscription!`
                  : "Select a cook from the list above and we'll take care of the rest."}
              </p>
            </div>
            <div className="rounded-2xl p-6" style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(16px)"
            }}>
              <h3 className="text-lg font-bold text-white">🍛 Subscription Plans</h3>
              <p className="mt-2 text-sm" style={{ color: "#94a3b8" }}>Daily / Weekly / Monthly — fresh from the cook's kitchen.</p>
              <ul className="mt-4 space-y-2">
                {["Personalized service area delivery", "Track orders from dashboard", "Easy upgrade or pause anytime"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-white">
                    <svg className="h-4 w-4 flex-shrink-0" style={{ color: "#34d399" }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="rounded-full px-6 py-2.5 text-sm font-bold text-white no-underline transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                    boxShadow: "0 4px 15px rgba(139,92,246,0.3)"
                  }}
                >
                  Get Started
                </Link>
                <Link
                  to="/register"
                  className="rounded-full px-6 py-2.5 text-sm font-semibold text-white no-underline transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)"
                  }}
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
