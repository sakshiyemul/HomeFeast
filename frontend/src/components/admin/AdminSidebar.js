const navItems = [
  { id: "overview",    label: "Dashboard",  icon: "📊" },
  { id: "users",       label: "Users",       icon: "👥" },
  { id: "cooks",       label: "Cooks",       icon: "👩‍🍳" },
  { id: "orders",      label: "Orders",      icon: "📦" },
  { id: "categories",  label: "Categories",  icon: "🏷️" },
  { id: "complaints",  label: "Complaints",  icon: "🚨" }
];

function AdminSidebar({ activeSection, onSelect, loading, onRefresh }) {
  return (
    <aside className="flex h-full w-full flex-col overflow-hidden rounded-2xl" style={{
      background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)",
      border: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
    }}>
      {/* Brand header */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl shadow-lg" style={{
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            boxShadow: "0 0 20px rgba(139,92,246,0.4)"
          }}>
            <span className="text-lg font-black text-white">H</span>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#7c3aed" }}>HomeFeast</p>
            <h2 className="text-sm font-bold text-white leading-tight">Admin Panel</h2>
          </div>
        </div>
        <p className="mt-2.5 text-xs" style={{ color: "#475569" }}>Operations & platform control</p>
      </div>

      <div className="mx-5 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)" }} />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200"
                style={active ? {
                  background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(236,72,153,0.2))",
                  color: "#a78bfa",
                  border: "1px solid rgba(139,92,246,0.35)",
                  boxShadow: "0 0 20px rgba(139,92,246,0.2)"
                } : {
                  color: "rgba(148,163,184,0.8)",
                  border: "1px solid transparent",
                  background: "transparent"
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#e2e8f0"; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(148,163,184,0.8)"; }}}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg text-base" style={{
                  background: active ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)"
                }}>
                  {item.icon}
                </span>
                {item.label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ background: "#a78bfa", boxShadow: "0 0 6px #a78bfa" }} />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Refresh button */}
      <div className="px-3 pb-4">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #059669, #10b981)",
            boxShadow: "0 4px 15px rgba(16,185,129,0.3)"
          }}
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Refreshing...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
