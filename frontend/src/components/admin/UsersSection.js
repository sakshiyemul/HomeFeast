import { SectionHeader, tableStyle, theadStyle, thStyle, th, td } from "./darkTheme";

function UsersSection({ users, currentUser, onRoleChange, onDelete }) {
  return (
    <section id="users">
      <SectionHeader eyebrow="People" title="Manage Users" count={`${users?.length || 0} users`} />

      <div style={{ ...tableStyle, overflow: "hidden" }}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead style={theadStyle}>
              <tr>
                {["Name", "Email", "Role", "Actions"].map((h) => (
                  <th key={h} className={th} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users?.map((user, i) => {
                const isSelf = currentUser?._id === user?._id;
                return (
                  <tr
                    key={user?._id}
                    className="transition-all duration-200"
                    style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(139,92,246,0.06)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{
                          background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                          boxShadow: "0 0 12px rgba(139,92,246,0.3)"
                        }}>
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <span className="text-sm font-semibold text-white">{user?.name || "—"}</span>
                      </div>
                    </td>
                    <td className={td} style={{ color: "#64748b", fontSize: "13px" }}>{user?.email || "—"}</td>
                    <td className={td}>
                      <select
                        className="rounded-lg px-3 py-2 text-sm font-medium capitalize transition-all duration-200"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#a78bfa",
                          maxWidth: "140px"
                        }}
                        value={user?.role || "user"}
                        disabled={isSelf}
                        onChange={(e) => onRoleChange(user?._id, e.target.value)}
                      >
                        <option value="user">user</option>
                        <option value="cook">cook</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className={`${td} text-right`}>
                      <button
                        type="button"
                        disabled={isSelf}
                        onClick={() => onDelete(user?._id)}
                        className="rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                        style={{
                          background: "rgba(239,68,68,0.12)",
                          border: "1px solid rgba(239,68,68,0.25)",
                          color: "#f87171"
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!users?.length && (
                <tr>
                  <td colSpan="4" className="py-16 text-center text-sm" style={{ color: "#334155" }}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default UsersSection;
