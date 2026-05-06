import { formatServiceArea } from "../../utils/formatters";
import { SectionHeader, StatusBadge, tableStyle, theadStyle, thStyle, th, td } from "./darkTheme";

function CooksSection({ cooks, onApprove }) {
  return (
    <section id="cooks">
      <SectionHeader eyebrow="Cook Approvals" title="Manage Cooks" count={`${cooks?.length || 0} cooks`} />

      <div style={{ ...tableStyle, overflow: "hidden" }}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead style={theadStyle}>
              <tr>
                {["Business", "Owner", "Service Area", "Meal Plans", "Status", "Actions"].map((h) => (
                  <th key={h} className={th} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cooks?.map((cook, i) => (
                <tr
                  key={cook?._id}
                  className="transition-all duration-200"
                  style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(139,92,246,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td className={td}>
                    <span className="text-sm font-semibold text-white">{cook?.businessName || "—"}</span>
                  </td>
                  <td className={td}>
                    <span className="text-sm text-white">{cook?.user?.name || "—"}</span>
                    <p className="text-xs" style={{ color: "#64748b" }}>{cook?.user?.email || ""}</p>
                  </td>
                  <td className={td} style={{ color: "#94a3b8", fontSize: "13px" }}>{formatServiceArea(cook?.serviceArea)}</td>
                  <td className={td}>
                    <div className="flex flex-wrap gap-1">
                      {["daily", "weekly", "monthly"]
                        .filter((plan) => cook?.mealPlans?.[plan])
                        .map((plan) => (
                          <span key={plan} className="rounded-full px-2 py-0.5 text-xs font-medium" style={{
                            background: "rgba(16,185,129,0.12)",
                            border: "1px solid rgba(16,185,129,0.25)",
                            color: "#34d399"
                          }}>
                            {plan}: ₹{cook.mealPlans[plan]}
                          </span>
                        ))}
                      {!["daily", "weekly", "monthly"].some((p) => cook?.mealPlans?.[p]) && (
                        <span style={{ color: "#334155", fontSize: "12px" }}>—</span>
                      )}
                    </div>
                  </td>
                  <td className={td}>
                    <StatusBadge status={cook?.isApproved ? "approved" : "pending"} />
                  </td>
                  <td className={td}>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onApprove(cook?._id, true)}
                        className="rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200"
                        style={{
                          background: "rgba(16,185,129,0.12)",
                          border: "1px solid rgba(16,185,129,0.25)",
                          color: "#34d399"
                        }}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => onApprove(cook?._id, false)}
                        className="rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200"
                        style={{
                          background: "rgba(239,68,68,0.12)",
                          border: "1px solid rgba(239,68,68,0.25)",
                          color: "#f87171"
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!cooks?.length && (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-sm" style={{ color: "#334155" }}>No cook applications yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default CooksSection;
