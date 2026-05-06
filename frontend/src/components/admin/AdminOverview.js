function AdminOverview({ overview }) {
  const cards = [
    { label: "Total Users",    value: overview?.users ?? 0,         icon: "👥", grad: "linear-gradient(135deg,#7c3aed,#a855f7)", glow: "rgba(139,92,246,0.35)" },
    { label: "Total Cooks",    value: overview?.cooks ?? 0,         icon: "👩‍🍳", grad: "linear-gradient(135deg,#059669,#10b981)", glow: "rgba(16,185,129,0.35)" },
    { label: "Total Orders",   value: overview?.orders ?? 0,        icon: "📦", grad: "linear-gradient(135deg,#d97706,#f59e0b)", glow: "rgba(245,158,11,0.35)" },
    { label: "Subscriptions",  value: overview?.subscriptions ?? 0, icon: "🔄", grad: "linear-gradient(135deg,#0891b2,#06b6d4)", glow: "rgba(6,182,212,0.35)" },
    { label: "Pending Cooks",  value: overview?.pendingCooks ?? 0,  icon: "⏳", grad: "linear-gradient(135deg,#c2410c,#f97316)", glow: "rgba(249,115,22,0.35)" },
    { label: "Pending Orders", value: overview?.pendingOrders ?? 0, icon: "🕐", grad: "linear-gradient(135deg,#be185d,#ec4899)", glow: "rgba(236,72,153,0.35)" }
  ];

  return (
    <section id="overview">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Dashboard</span>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white">Platform Overview</h2>
        <p className="mt-1 text-sm" style={{ color: "#64748b" }}>Quick summary of users, cooks, orders, and activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="group relative rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)"
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 15px 40px ${card.glow}`; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>{card.label}</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-transform duration-300 group-hover:scale-110" style={{
                background: card.grad,
                boxShadow: `0 4px 15px ${card.glow}`
              }}>
                {card.icon}
              </div>
            </div>
            <p className="mt-4 text-4xl font-black text-white">{card.value}</p>
            <div className="mt-3 h-0.5 rounded-full" style={{ background: card.grad, opacity: 0.4 }} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default AdminOverview;
