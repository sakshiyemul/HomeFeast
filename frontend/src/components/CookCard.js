import { Link } from "react-router-dom";
import { formatServiceArea, toList, toNumber } from "../utils/formatters";

function CookCard({ cook, onSubscribe }) {
  const rating = toNumber(cook.rating, 0);
  const cuisines = toList(cook.cuisines);
  const mealPlans = cook.mealPlans || {};

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1" style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      backdropFilter: "blur(16px)"
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 15px 40px rgba(139,92,246,0.15)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      {/* Card top accent bar */}
      <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899, #06b6d4)" }} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="truncate text-lg font-bold text-white">{cook.businessName}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs" style={{ color: "#94a3b8" }}>
              <svg className="h-3.5 w-3.5" style={{ color: "#a78bfa" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{formatServiceArea(cook.serviceArea)}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold" style={{
              background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.3)"
            }}>
              <svg className="h-3.5 w-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {rating.toFixed(1)}
            </span>
            <span className="text-[10px]" style={{ color: "#64748b" }}>{cook.reviewsCount || 0} reviews</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="line-clamp-2 text-sm" style={{ color: "#cbd5e1" }}>{cook.tagline || "Home-cooked comfort food made with love"}</p>

        {/* Cuisines */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {cuisines.length > 0 ? (
            cuisines.slice(0, 3).map((c) => (
              <span key={c} className="rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={{
                background: "rgba(139,92,246,0.15)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.3)"
              }}>
                {c}
              </span>
            ))
          ) : (
            <span className="rounded-full px-2.5 py-0.5 text-[11px]" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>Multi-cuisine</span>
          )}
          {cuisines.length > 3 && (
            <span className="rounded-full px-2 py-0.5 text-[11px]" style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>+{cuisines.length - 3}</span>
          )}
        </div>

        {/* Menu preview */}
        <div className="mt-1 space-y-1.5 rounded-xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#64748b" }}>Popular Dishes</p>
          {cook.menu?.length ? (
            cook.menu.slice(0, 3).map((item) => (
              <div key={item._id} className="flex items-center justify-between text-sm">
                <span style={{ color: "#cbd5e1" }}>{item.dishName}</span>
                <span className="font-semibold text-white">₹{item.price}</span>
              </div>
            ))
          ) : (
            <p className="text-[11px]" style={{ color: "#64748b" }}>Menu coming soon</p>
          )}
        </div>

        {/* Meal plan pills */}
        <div className="flex flex-wrap gap-1.5">
          {["daily", "weekly", "monthly"].map((plan) =>
            mealPlans[plan] ? (
              <span key={plan} className="capitalize rounded-lg px-2 py-0.5 text-[11px] font-semibold" style={{
                background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)"
              }}>
                {plan}: ₹{mealPlans[plan]}
              </span>
            ) : null
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-2">
          <Link
            to={`/cooks/${cook._id}`}
            className="flex-1 rounded-xl py-2.5 text-center text-sm font-semibold no-underline transition"
            style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,0.15)"; e.currentTarget.style.color = "#a78bfa"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#e2e8f0"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            View Profile
          </Link>
          <button
            className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
            type="button"
            onClick={() => onSubscribe(cook)}
            style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              boxShadow: "0 4px 15px rgba(139,92,246,0.35)",
              border: "none"
            }}
          >
            Subscribe
          </button>
        </div>

        {/* Verified badge */}
        <div className="flex items-center justify-center pt-1.5">
          {cook.isApproved ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified Cook
            </span>
          ) : (
            <span className="text-[11px] tracking-wider text-amber-500 uppercase font-semibold">Pending Approval</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default CookCard;
