import { SectionHeader, StatusBadge, tableStyle, theadStyle, thStyle, th, td } from "./darkTheme";

function ComplaintsSection({ complaints, onStatusChange }) {
  return (
    <section id="complaints">
      <SectionHeader eyebrow="Support" title="Complaints" count={`${complaints?.length || 0} complaints`} />

      <div style={{ ...tableStyle, overflow: "hidden" }}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead style={theadStyle}>
              <tr>
                {["User", "Cook", "Message", "Status", "Actions"].map((h) => (
                  <th key={h} className={th} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complaints?.map((complaint, i) => (
                <tr
                  key={complaint?._id}
                  className="transition-all duration-200"
                  style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(139,92,246,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td className={td}>
                    <span className="text-sm font-semibold text-white">{complaint?.user?.name || "User"}</span>
                    <p className="text-xs" style={{ color: "#64748b" }}>{complaint?.user?.email || ""}</p>
                  </td>
                  <td className={td} style={{ color: "#94a3b8", fontSize: "13px" }}>{complaint?.cookId?.businessName || "—"}</td>
                  <td className={`${td} max-w-[220px]`}>
                    <p className="line-clamp-2 text-sm" style={{ color: "#94a3b8" }}>{complaint?.message || "—"}</p>
                  </td>
                  <td className={td}>
                    <StatusBadge status={complaint?.status || "open"} />
                  </td>
                  <td className={td}>
                    <div className="flex flex-wrap items-center gap-2">
                      {complaint?.status !== "in review" && complaint?.status !== "resolved" && (
                        <button
                          type="button"
                          onClick={() => onStatusChange(complaint?._id, "in review")}
                          className="rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200"
                          style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa" }}
                        >
                          Review
                        </button>
                      )}
                      {complaint?.status !== "resolved" && (
                        <button
                          type="button"
                          onClick={() => onStatusChange(complaint?._id, "resolved")}
                          className="rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200"
                          style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" }}
                        >
                          Resolve
                        </button>
                      )}
                      {complaint?.status === "resolved" && (
                        <span className="text-xs" style={{ color: "#334155" }}>Done</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!complaints?.length && (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-sm" style={{ color: "#334155" }}>No complaints filed.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ComplaintsSection;
