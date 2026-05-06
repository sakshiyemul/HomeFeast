import { StatusBadge, tableStyle, theadStyle, thStyle, th, td } from "./darkTheme";

const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#e2e8f0",
  borderRadius: "12px",
  padding: "10px 16px",
  fontSize: "14px",
  width: "100%",
  outline: "none",
  transition: "all 0.3s ease"
};

function CategoriesSection({ categories, form, onFormChange, onSubmit, onDelete }) {
  return (
    <section id="categories">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Master Data</span>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white">Categories & Cuisines</h2>
        <p className="mt-1 text-sm" style={{ color: "#64748b" }}>{categories?.length || 0} saved items</p>
      </div>

      {/* Add form */}
      <div className="mb-6 rounded-2xl p-5" style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)"
      }}>
        <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Add New</h3>
        <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={onSubmit}>
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Name</label>
            <input
              type="text"
              placeholder="e.g. South Indian"
              value={form.name}
              onChange={(e) => onFormChange("name", e.target.value)}
              required
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = "rgba(139,92,246,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          <div className="w-full sm:w-40">
            <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Type</label>
            <select
              value={form.type}
              onChange={(e) => onFormChange("type", e.target.value)}
              style={{ ...inputStyle, background: "#1e293b", cursor: "pointer" }}
            >
              <option value="cuisine">Cuisine</option>
              <option value="category">Category</option>
            </select>
          </div>
          <button
            type="submit"
            className="rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              boxShadow: "0 4px 15px rgba(139,92,246,0.4)"
            }}
          >
            Add
          </button>
        </form>
      </div>

      {/* List */}
      <div style={{ ...tableStyle, overflow: "hidden" }}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead style={theadStyle}>
              <tr>
                {["Name", "Type", "Actions"].map((h) => (
                  <th key={h} className={th} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories?.map((category, i) => (
                <tr
                  key={category?._id}
                  className="transition-all duration-200"
                  style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(139,92,246,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td className={td}>
                    <span className="text-sm font-semibold text-white">{category?.name || "—"}</span>
                  </td>
                  <td className={td}>
                    <StatusBadge status={category?.type} />
                  </td>
                  <td className={td}>
                    <button
                      type="button"
                      onClick={() => onDelete(category?._id)}
                      className="rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200"
                      style={{
                        background: "rgba(239,68,68,0.10)",
                        border: "1px solid rgba(239,68,68,0.22)",
                        color: "#f87171"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!categories?.length && (
                <tr>
                  <td colSpan="3" className="py-16 text-center text-sm" style={{ color: "#334155" }}>No categories yet. Add one above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
