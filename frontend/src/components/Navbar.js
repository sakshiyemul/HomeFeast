import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearSession, getUser } from "../services/session";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16" style={{
      background: "rgba(15,23,42,0.85)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.07)"
    }}>
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-lg" style={{
            background: "linear-gradient(135deg, #7c3aed, #ec4899)"
          }}>
            <span className="text-base font-black text-white">H</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Home<span style={{background:"linear-gradient(135deg,#a78bfa,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Feast</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { path: "/", label: "Explore" },
            { path: "/dashboard", label: "Dashboard" },
            ...(user?.role === "admin" ? [{ path: "/admin", label: "Admin" }] : []),
            ...(!user ? [{ path: "/login", label: "Login" }] : [])
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className="no-underline"
              style={{
                padding: "6px 14px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 500,
                transition: "all 0.2s ease",
                color: isActive(path) ? "#a78bfa" : "rgba(203,213,225,0.8)",
                background: isActive(path) ? "rgba(139,92,246,0.15)" : "transparent",
                border: isActive(path) ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent"
              }}
            >
              {label}
            </Link>
          ))}
          {!user && (
            <Link
              to="/register"
              className="ml-2 no-underline"
              style={{
                padding: "8px 20px",
                borderRadius: "50px",
                fontSize: "13px",
                fontWeight: 700,
                color: "white",
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                boxShadow: "0 4px 15px rgba(139,92,246,0.4)",
                transition: "all 0.3s ease"
              }}
            >
              Get Started
            </Link>
          )}
        </nav>

        {/* User panel */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-2 rounded-xl px-3 py-1.5" style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)"
              }}>
                <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)"
                }}>
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-semibold text-white">{user.name}</p>
                  <p className="text-[10px] capitalize" style={{ color: "#a78bfa" }}>{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171"
                }}
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="animate-slide-up border-t px-4 pb-4 pt-2 md:hidden" style={{
          background: "rgba(15,23,42,0.97)",
          borderColor: "rgba(255,255,255,0.07)"
        }}>
          <nav className="flex flex-col gap-1">
            {[
              { path: "/", label: "Explore" },
              { path: "/dashboard", label: "Dashboard" },
              ...(user?.role === "admin" ? [{ path: "/admin", label: "Admin" }] : []),
              ...(!user ? [{ path: "/login", label: "Login" }, { path: "/register", label: "Register" }] : [])
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className="no-underline rounded-lg px-4 py-2.5 text-sm font-medium"
                style={{ color: isActive(path) ? "#a78bfa" : "#94a3b8" }}
              >
                {label}
              </Link>
            ))}
            {user && (
              <div className="mt-2 flex items-center justify-between rounded-xl px-4 py-3" style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)"
              }}>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}>
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-semibold text-white">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}>
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
