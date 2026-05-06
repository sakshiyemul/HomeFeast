import { SectionHeader, StatusBadge, tableStyle, theadStyle, thStyle, th, td } from "./darkTheme";

function OrdersSection({ orders }) {
  return (
    <section id="orders">
      <SectionHeader eyebrow="Transactions" title="All Orders" count={`${orders?.length || 0} orders`} />

      <div style={{ ...tableStyle, overflow: "hidden" }}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead style={theadStyle}>
              <tr>
                {["Customer", "Cook", "Items", "Total", "Status", "Payment"].map((h) => (
                  <th key={h} className={th} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders?.map((order, i) => (
                <tr
                  key={order?._id}
                  className="transition-all duration-200"
                  style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(139,92,246,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td className={td}>
                    <span className="text-sm font-semibold text-white">{order?.user?.name || "Customer"}</span>
                    <p className="text-xs" style={{ color: "#64748b" }}>{order?.user?.email || ""}</p>
                  </td>
                  <td className={td} style={{ color: "#94a3b8", fontSize: "13px" }}>{order?.cookId?.businessName || "Cook"}</td>
                  <td className={`${td} max-w-[180px] truncate`} style={{ color: "#94a3b8", fontSize: "13px" }}>
                    {order?.items?.map((i) => `${i.dishName} x${i.quantity}`).join(", ") || "—"}
                  </td>
                  <td className={td}>
                    <span className="text-sm font-bold" style={{ color: "#a78bfa" }}>₹{order?.total ?? 0}</span>
                  </td>
                  <td className={td}><StatusBadge status={order?.status} /></td>
                  <td className={td}><StatusBadge status={order?.paymentStatus || "pending"} /></td>
                </tr>
              ))}
              {!orders?.length && (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-sm" style={{ color: "#334155" }}>No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default OrdersSection;
