// Shared dark table styles
const th = "px-5 py-4 text-left text-xs font-semibold uppercase tracking-widest";
const td = "px-5 py-4";

const tableStyle = {
  background: "rgba(255,255,255,0.02)",
  borderRadius: "1rem",
  border: "1px solid rgba(255,255,255,0.06)",
  overflow: "hidden"
};

const theadStyle = {
  background: "rgba(139,92,246,0.08)",
  borderBottom: "1px solid rgba(139,92,246,0.2)"
};

const thStyle = { color: "#7c3aed" };
const dividerStyle = { borderColor: "rgba(255,255,255,0.04)" };

function SectionHeader({ eyebrow, title, count }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a78bfa" }}>{eyebrow}</span>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white">{title}</h2>
      </div>
      {count !== undefined && (
        <span className="rounded-full px-4 py-1.5 text-sm font-semibold text-white" style={{
          background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)"
        }}>
          {count}
        </span>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    delivered:  "badge-success",
    accepted:   "badge-info",
    active:     "badge-success",
    approved:   "badge-success",
    resolved:   "badge-success",
    "in review":"badge-info",
    rejected:   "badge-error",
    cancelled:  "badge-error",
    pending:    "badge-warning",
    open:       "badge-warning",
    paid:       "badge-success",
    failed:     "badge-error",
    cuisine:    "badge-purple",
    category:   "badge-info"
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${map[status] || "badge-warning"}`}>
      {status || "pending"}
    </span>
  );
}

export { SectionHeader, StatusBadge, tableStyle, theadStyle, thStyle, dividerStyle, th, td };
