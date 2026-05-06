import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { getUser, persistSession } from "../services/session";
import { toList, toNumber } from "../utils/formatters";

const planOptions = [
  { value: "daily", title: "Daily", emoji: "📅" },
  { value: "weekly", title: "Weekly", emoji: "📆" },
  { value: "monthly", title: "Monthly", emoji: "🗓️" }
];

const emptyCookProfile = {
  businessName: "", tagline: "",
  serviceArea: { city: "", radiusKm: "", pincodes: "", address: "" },
  cuisines: "",
  deliveryTimings: { start: "", end: "", slots: "" },
  deliverySlots: "",
  mealPlans: { daily: "", weekly: "", monthly: "" }
};

const emptyMenuForm = {
  dishName: "", description: "", mealType: "Veg", cuisine: "", price: "", availability: true, tags: ""
};

// Style constants
const glass = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
  backdropFilter: "blur(16px)"
};

const inputDark = {
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

const btnGrad = {
  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "12px",
  width: "100%",
  fontWeight: 700,
  fontSize: "14px",
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(139,92,246,0.35)",
  transition: "all 0.3s ease"
};

const btnGhost = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#a78bfa",
  borderRadius: "12px",
  padding: "8px 16px",
  fontWeight: 600,
  fontSize: "13px",
  cursor: "pointer",
  transition: "all 0.3s ease"
};

function StatusBadge({ status }) {
  const map = {
    delivered: { bg: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" },
    accepted:  { bg: "rgba(59,130,246,0.15)",  color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" },
    rejected:  { bg: "rgba(239,68,68,0.15)",   color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" },
    pending:   { bg: "rgba(245,158,11,0.15)",  color: "#fbbf24", border: "1px solid rgba(245,158,11,0.3)" },
    active:    { bg: "rgba(16,185,129,0.15)",  color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" },
    cancelled: { bg: "rgba(239,68,68,0.15)",   color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" },
    resolved:  { bg: "rgba(16,185,129,0.15)",  color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" },
    "in review": { bg: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" }
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ background: s.bg, color: s.color, border: s.border, borderRadius: "50px", padding: "3px 10px", fontSize: "11px", fontWeight: 600 }}>
      {status}
    </span>
  );
}

function Dashboard() {
  const [user, setUser] = useState(getUser());
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [cooks, setCooks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [msgType, setMsgType] = useState("info");
  const [cookSummary, setCookSummary] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [orderForm, setOrderForm] = useState({ cookId: "", dishName: "", quantity: 1, price: "", deliverySlot: "", deliveryDate: "" });
  const [subscriptionForm, setSubscriptionForm] = useState({ cookId: "", plan: "daily" });
  const [complaintForm, setComplaintForm] = useState({ cookId: "", orderId: "", message: "" });
  const [cookProfile, setCookProfile] = useState(emptyCookProfile);
  const [menuForm, setMenuForm] = useState(emptyMenuForm);

  const isCook = user?.role === "cook";
  const showMsg = (text, type = "info") => {
    setStatusMessage(text); setMsgType(type);
    setTimeout(() => setStatusMessage(""), 5000);
  };

  const stats = useMemo(() => {
    const activeSubs = subscriptions.filter((s) => s.status !== "cancelled").length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    return { orders: orders.length, subscriptions: subscriptions.length, activeSubs, pendingOrders };
  }, [orders, subscriptions]);

  const loadCommonData = async () => {
    try {
      const [profileRes, ordersRes, subsRes, cooksRes, complaintsRes] = await Promise.all([
        API.get("/auth/me"), API.get("/orders"), API.get("/subscriptions"), API.get("/cooks"), API.get("/complaints")
      ]);
      setUser(profileRes.data.user); persistSession({ user: profileRes.data.user });
      setOrders(ordersRes.data); setSubscriptions(subsRes.data); setCooks(cooksRes.data); setComplaints(complaintsRes.data);
    } catch (err) { console.error("Dashboard reload failed", err); }
  };

  const loadCookData = async () => {
    try {
      const [{ data: summary }, { data: menu }] = await Promise.all([
        API.get("/cooks/dashboard/summary"), API.get("/menu", { params: { cookOnly: true } })
      ]);
      setCookSummary(summary); setMenuItems(menu);
      const profile = summary.profile;
      if (profile) {
        setCookProfile({
          businessName: profile.businessName || "", tagline: profile.tagline || "",
          serviceArea: { city: profile.serviceArea?.city || "", radiusKm: profile.serviceArea?.radiusKm || "", pincodes: toList(profile.serviceArea?.pincodes).join(", "), address: profile.serviceArea?.address || "" },
          cuisines: toList(profile.cuisines).join(", "),
          deliveryTimings: { start: profile.deliveryTimings?.start || "", end: profile.deliveryTimings?.end || "", slots: toList(profile.deliveryTimings?.slots).join(", ") },
          deliverySlots: toList(profile.deliverySlots).join(", "),
          mealPlans: { daily: profile.mealPlans?.daily || "", weekly: profile.mealPlans?.weekly || "", monthly: profile.mealPlans?.monthly || "" }
        });
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadCommonData(); }, []);
  useEffect(() => { if (isCook) loadCookData(); }, [isCook]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/orders", { cookId: orderForm.cookId, deliverySlot: orderForm.deliverySlot, deliveryDate: orderForm.deliveryDate, items: [{ dishName: orderForm.dishName, quantity: Number(orderForm.quantity), price: Number(orderForm.price) }] });
      showMsg("Order placed successfully! 🎉", "success"); 
      setOrderForm({ cookId: "", dishName: "", quantity: 1, price: "", deliverySlot: "", deliveryDate: "" });
      await loadCommonData();
    } catch (err) { showMsg(err.response?.data?.message || "Unable to place order.", "error"); }
  };

  const handleSubscriptionSubmit = async (e) => {
    e.preventDefault();
    try { 
      await API.post("/subscriptions", subscriptionForm); 
      showMsg("Subscription activated! 🎉", "success"); 
      setSubscriptionForm({ cookId: "", plan: "daily" });
      await loadCommonData(); 
    }
    catch (err) { showMsg(err.response?.data?.message || "Unable to subscribe.", "error"); }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/complaints", complaintForm);
      setComplaintForm({ cookId: "", orderId: "", message: "" });
      showMsg("Complaint submitted.", "success"); await loadCommonData();
    } catch (err) { showMsg(err.response?.data?.message || "Unable to submit complaint.", "error"); }
  };

  const handleCookProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/cooks", {
        businessName: cookProfile.businessName, tagline: cookProfile.tagline,
        serviceArea: { city: cookProfile.serviceArea.city, radiusKm: cookProfile.serviceArea.radiusKm ? Number(cookProfile.serviceArea.radiusKm) : undefined, pincodes: toList(cookProfile.serviceArea.pincodes), address: cookProfile.serviceArea.address },
        cuisines: toList(cookProfile.cuisines),
        deliveryTimings: { start: cookProfile.deliveryTimings.start, end: cookProfile.deliveryTimings.end, slots: toList(cookProfile.deliveryTimings.slots) },
        deliverySlots: toList(cookProfile.deliverySlots),
        mealPlans: { daily: toNumber(cookProfile.mealPlans.daily, 0), weekly: toNumber(cookProfile.mealPlans.weekly, 0), monthly: toNumber(cookProfile.mealPlans.monthly, 0) }
      });
      showMsg("Profile saved. Awaiting admin approval.", "success"); await loadCommonData(); await loadCookData();
    } catch (err) { showMsg(err.response?.data?.message || "Unable to save profile.", "error"); }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...menuForm, price: Number(menuForm.price) };
      if (editingMenuId) { await API.put(`/menu/${editingMenuId}`, payload); showMsg("Menu item updated.", "success"); }
      else { await API.post("/menu", payload); showMsg("Menu item added.", "success"); }
      setMenuForm(emptyMenuForm); setEditingMenuId(null); await loadCookData();
    } catch (err) { showMsg(err.response?.data?.message || "Unable to update menu.", "error"); }
  };

  const startEditingMenu = (item) => {
    setEditingMenuId(item._id);
    setMenuForm({ dishName: item.dishName || "", description: item.description || "", mealType: item.mealType || "Veg", cuisine: item.cuisine || "", price: item.price || "", availability: item.availability !== false, tags: toList(item.tags).join(", ") });
  };

  const deleteMenuItem = async (id) => {
    try { await API.delete(`/menu/${id}`); if (editingMenuId === id) { setEditingMenuId(null); setMenuForm(emptyMenuForm); } await loadCookData(); }
    catch (err) { showMsg(err.response?.data?.message || "Unable to delete.", "error"); }
  };

  const handleOrderStatus = async (orderId, status) => {
    try { await API.patch(`/orders/${orderId}/status`, { status }); await loadCommonData(); if (isCook) await loadCookData(); }
    catch (err) { console.error(err); }
  };

  const handleCancelSubscription = async (subId) => {
    try { await API.patch(`/subscriptions/${subId}/cancel`); await loadCommonData(); }
    catch (err) { showMsg(err.response?.data?.message || "Unable to cancel.", "error"); }
  };

  const msgStyle = msgType === "success"
    ? { background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" }
    : msgType === "error"
    ? { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }
    : { background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#fbbf24" };

  const tabs = isCook
    ? [{ id: "overview", label: "Overview" }, { id: "orders", label: "Orders" }, { id: "profile", label: "Cook Profile" }, { id: "menu", label: "Menu" }]
    : [{ id: "overview", label: "Overview" }, { id: "order", label: "New Order" }, { id: "subscribe", label: "Subscribe" }, { id: "orders", label: "History" }, { id: "complaints", label: "Complaints" }];

  const statCards = [
    { label: "Total Orders", value: stats.orders, icon: "📦", grad: "linear-gradient(135deg,#7c3aed,#a855f7)", glow: "rgba(139,92,246,0.3)" },
    { label: "Subscriptions", value: stats.subscriptions, icon: "🔄", grad: "linear-gradient(135deg,#059669,#10b981)", glow: "rgba(16,185,129,0.3)" },
    { label: "Active Plans", value: stats.activeSubs, icon: "✅", grad: "linear-gradient(135deg,#d97706,#f59e0b)", glow: "rgba(245,158,11,0.3)" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: "⏳", grad: "linear-gradient(135deg,#be185d,#ec4899)", glow: "rgba(236,72,153,0.3)" }
  ];

  return (
    <div className="min-h-screen" style={{ background: "#0f172a" }}>
      {/* Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{ position:"absolute", width:500, height:500, top:"-100px", left:"-100px", background:"radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", borderRadius:"50%" }} />
        <div style={{ position:"absolute", width:400, height:400, bottom:"5%", right:"-80px", background:"radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)", borderRadius:"50%" }} />
      </div>

      {/* Header */}
      <div className="relative" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Dashboard</span>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Hi, {user?.name || "Foodie"} 👋
              </h1>
              <p className="mt-1 text-sm" style={{ color: "#64748b" }}>Manage your cooks, orders, subscriptions, and profile.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start rounded-full px-4 py-1.5 text-xs font-semibold capitalize" style={{
              background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa"
            }}>
              {user?.role === "cook" ? "👩‍🍳" : "🍽️"} {user?.role}
            </span>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-1 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                style={activeTab === tab.id ? {
                  background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.2))",
                  color: "#a78bfa",
                  border: "1px solid rgba(139,92,246,0.35)"
                } : {
                  color: "#64748b",
                  border: "1px solid transparent",
                  background: "transparent"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-xl px-5 py-3 text-sm font-medium" style={msgStyle}>{statusMessage}</div>
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="animate-fade-in space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((card) => (
                <div key={card.label}
                  className="group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                  style={glass}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 15px 40px ${card.glow}`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>{card.label}</p>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-transform duration-300 group-hover:scale-110" style={{ background: card.grad }}>
                      {card.icon}
                    </div>
                  </div>
                  <p className="mt-4 text-4xl font-black text-white">{card.value}</p>
                </div>
              ))}
            </div>

            {isCook && cookSummary?.stats && (
              <div className="rounded-2xl p-6" style={glass}>
                <h3 className="text-lg font-bold text-white">👩‍🍳 Cook Dashboard</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-4">
                  {[
                    { label: "Earnings", value: `₹${cookSummary.stats.earnings || 0}`, color: "#34d399" },
                    { label: "Total Orders", value: cookSummary.stats.ordersCount || 0, color: "#a78bfa" },
                    { label: "Pending", value: cookSummary.stats.pending || 0, color: "#fbbf24" },
                    { label: "Delivered", value: cookSummary.stats.delivered || 0, color: "#34d399" }
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>{item.label}</p>
                      <p className="mt-2 text-2xl font-extrabold" style={{ color: item.color }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent orders */}
            <div className="rounded-2xl" style={glass}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <h3 className="text-lg font-bold text-white">Recent Orders</h3>
                <button onClick={() => setActiveTab("orders")} className="text-sm font-semibold transition" style={{ color: "#a78bfa" }}>View All →</button>
              </div>
              <div>
                {orders.slice(0, 5).map((order, i) => (
                  <div key={order._id}
                    className="flex items-center justify-between px-6 py-4 transition-all duration-200"
                    style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(139,92,246,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{order.cookId?.businessName || "Cook"}</p>
                      <p className="text-xs" style={{ color: "#64748b" }}>{order.items?.map((i) => i.dishName).join(", ") || "Order"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold" style={{ color: "#a78bfa" }}>₹{order.total}</span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
                {!orders.length && <p className="px-6 py-8 text-center text-sm" style={{ color: "#334155" }}>No orders yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* NEW ORDER */}
        {activeTab === "order" && (
          <div className="animate-fade-in mx-auto max-w-lg">
            <div className="rounded-2xl p-6" style={glass}>
              <h3 className="text-lg font-bold text-white">🛒 Place an Order</h3>
              <form onSubmit={handleOrderSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Choose Cook</label>
                  <select required value={orderForm.cookId} onChange={(e) => setOrderForm((p) => ({ ...p, cookId: e.target.value }))} style={{ ...inputDark, background: "#1e293b" }}>
                    <option value="">Select cook</option>
                    {cooks.map((c) => <option key={c._id} value={c._id}>{c.businessName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Dish Name</label>
                  <input type="text" required placeholder="e.g. Paneer Thali" value={orderForm.dishName} onChange={(e) => setOrderForm((p) => ({ ...p, dishName: e.target.value }))} style={inputDark} className="input-dark" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Qty</label>
                    <input type="number" min={1} required value={orderForm.quantity} onChange={(e) => setOrderForm((p) => ({ ...p, quantity: e.target.value }))} style={inputDark} className="input-dark" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Price/meal</label>
                    <input type="number" required placeholder="₹" value={orderForm.price} onChange={(e) => setOrderForm((p) => ({ ...p, price: e.target.value }))} style={inputDark} className="input-dark" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Delivery Slot</label>
                    <input type="text" placeholder="12-1 PM" value={orderForm.deliverySlot} onChange={(e) => setOrderForm((p) => ({ ...p, deliverySlot: e.target.value }))} style={inputDark} className="input-dark" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Date</label>
                    <input type="date" value={orderForm.deliveryDate} onChange={(e) => setOrderForm((p) => ({ ...p, deliveryDate: e.target.value }))} style={inputDark} className="input-dark" />
                  </div>
                </div>
                <button type="submit" style={btnGrad}>Place Order</button>
              </form>
            </div>
          </div>
        )}

        {/* SUBSCRIBE */}
        {activeTab === "subscribe" && (
          <div className="animate-fade-in mx-auto max-w-lg space-y-6">
            <div className="rounded-2xl p-6" style={glass}>
              <h3 className="text-lg font-bold text-white">📅 Start a Subscription</h3>
              <form onSubmit={handleSubscriptionSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Choose Cook</label>
                  <select required value={subscriptionForm.cookId} onChange={(e) => setSubscriptionForm((p) => ({ ...p, cookId: e.target.value }))} style={{ ...inputDark, background: "#1e293b" }}>
                    <option value="">Select cook</option>
                    {cooks.map((c) => <option key={c._id} value={c._id}>{c.businessName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Plan</label>
                  <div className="grid grid-cols-3 gap-3">
                    {planOptions.map((opt) => (
                      <button key={opt.value} type="button" onClick={() => setSubscriptionForm((p) => ({ ...p, plan: opt.value }))}
                        className="rounded-xl py-4 text-center transition-all duration-200"
                        style={subscriptionForm.plan === opt.value ? {
                          background: "rgba(139,92,246,0.2)", border: "2px solid rgba(139,92,246,0.5)", boxShadow: "0 0 15px rgba(139,92,246,0.2)"
                        } : {
                          background: "rgba(255,255,255,0.03)", border: "2px solid rgba(255,255,255,0.07)"
                        }}
                      >
                        <p className="text-xl">{opt.emoji}</p>
                        <p className="mt-1 text-sm font-semibold" style={{ color: subscriptionForm.plan === opt.value ? "#a78bfa" : "#64748b" }}>{opt.title}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" style={btnGrad}>Start Subscription</button>
              </form>
            </div>

            <div className="rounded-2xl" style={glass}>
              <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <h3 className="text-lg font-bold text-white">Your Subscriptions</h3>
              </div>
              <div>
                {subscriptions.map((sub, i) => (
                  <div key={sub._id} className="flex items-center justify-between px-6 py-4" style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div>
                      <p className="text-sm font-semibold text-white">{sub.cookId?.businessName || "Cook"}</p>
                      <p className="text-xs capitalize" style={{ color: "#64748b" }}>{sub.plan} plan</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={sub.status} />
                      {sub.status !== "cancelled" && (
                        <button onClick={() => handleCancelSubscription(sub._id)} className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>Cancel</button>
                      )}
                    </div>
                  </div>
                ))}
                {!subscriptions.length && <p className="px-6 py-8 text-center text-sm" style={{ color: "#334155" }}>No subscriptions yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS HISTORY */}
        {activeTab === "orders" && (
          <div className="animate-fade-in space-y-4">
            <h3 className="text-lg font-bold text-white">📦 Order History</h3>
            <div className="overflow-hidden rounded-2xl" style={glass}>
              <div className="hidden border-b px-6 py-3 sm:grid sm:grid-cols-5 sm:gap-4" style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(139,92,246,0.06)" }}>
                {["Cook", "Items", "Total", "Status", "Actions"].map((h) => (
                  <span key={h} className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7c3aed" }}>{h}</span>
                ))}
              </div>
              <div>
                {orders.map((order, i) => (
                  <div key={order._id}
                    className="grid items-center gap-3 px-6 py-4 transition-all duration-200 sm:grid-cols-5 sm:gap-4"
                    style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(139,92,246,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{order.cookId?.businessName || "Cook"}</p>
                      {order.user?.name && <p className="text-xs" style={{ color: "#64748b" }}>by {order.user.name}</p>}
                    </div>
                    <p className="truncate text-sm" style={{ color: "#94a3b8" }}>{order.items?.map((i) => `${i.dishName} x${i.quantity}`).join(", ") || "—"}</p>
                    <p className="text-sm font-bold" style={{ color: "#a78bfa" }}>₹{order.total}</p>
                    <StatusBadge status={order.status} />
                    <div className="flex gap-2">
                      {isCook && order.status === "pending" && (
                        <>
                          <button onClick={() => handleOrderStatus(order._id, "accepted")} className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" }}>Accept</button>
                          <button onClick={() => handleOrderStatus(order._id, "rejected")} className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>Reject</button>
                        </>
                      )}
                      {isCook && order.status === "accepted" && (
                        <button onClick={() => handleOrderStatus(order._id, "delivered")} className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa" }}>Mark Delivered</button>
                      )}
                    </div>
                  </div>
                ))}
                {!orders.length && <p className="px-6 py-12 text-center text-sm" style={{ color: "#334155" }}>No orders yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* COMPLAINTS */}
        {activeTab === "complaints" && user?.role === "user" && (
          <div className="animate-fade-in mx-auto max-w-2xl space-y-6">
            <div className="rounded-2xl p-6" style={glass}>
              <h3 className="text-lg font-bold text-white">🚨 Raise a Complaint</h3>
              <form onSubmit={handleComplaintSubmit} className="mt-5 space-y-4">
                <select value={complaintForm.cookId} onChange={(e) => setComplaintForm((p) => ({ ...p, cookId: e.target.value }))} style={{ ...inputDark, background: "#1e293b" }}>
                  <option value="">Select cook</option>
                  {cooks.map((c) => <option key={c._id} value={c._id}>{c.businessName}</option>)}
                </select>
                <select value={complaintForm.orderId} onChange={(e) => setComplaintForm((p) => ({ ...p, orderId: e.target.value }))} style={{ ...inputDark, background: "#1e293b" }}>
                  <option value="">Link to order (optional)</option>
                  {orders.map((o) => <option key={o._id} value={o._id}>{o.cookId?.businessName || "Order"} — {o.status}</option>)}
                </select>
                <textarea placeholder="Describe the issue..." required value={complaintForm.message} onChange={(e) => setComplaintForm((p) => ({ ...p, message: e.target.value }))} style={{ ...inputDark, minHeight: "100px", resize: "vertical" }} className="input-dark" />
                <button type="submit" style={btnGrad}>Submit Complaint</button>
              </form>
            </div>
            <div className="rounded-2xl" style={glass}>
              <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <h3 className="text-lg font-bold text-white">Your Complaints</h3>
              </div>
              <div>
                {complaints.map((c, i) => (
                  <div key={c._id} className="px-6 py-4" style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{c.cookId?.businessName || "Cook"}</p>
                        <p className="mt-1 text-sm" style={{ color: "#94a3b8" }}>{c.message}</p>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                ))}
                {!complaints.length && <p className="px-6 py-8 text-center text-sm" style={{ color: "#334155" }}>No complaints yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* COOK PROFILE */}
        {activeTab === "profile" && isCook && (
          <div className="animate-fade-in mx-auto max-w-2xl">
            <div className="rounded-2xl p-6" style={glass}>
              <h3 className="text-lg font-bold text-white">👩‍🍳 Cook Profile</h3>
              <form onSubmit={handleCookProfileSubmit} className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Business Name *</label>
                    <input type="text" required placeholder="Your kitchen name" value={cookProfile.businessName} onChange={(e) => setCookProfile((p) => ({ ...p, businessName: e.target.value }))} style={inputDark} className="input-dark" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Tagline</label>
                    <input type="text" placeholder="e.g. Healthy meals daily" value={cookProfile.tagline} onChange={(e) => setCookProfile((p) => ({ ...p, tagline: e.target.value }))} style={inputDark} className="input-dark" />
                  </div>
                </div>
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="mb-3 text-sm font-semibold" style={{ color: "#a78bfa" }}>📍 Service Area</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input type="text" required placeholder="City" value={cookProfile.serviceArea.city} onChange={(e) => setCookProfile((p) => ({ ...p, serviceArea: { ...p.serviceArea, city: e.target.value } }))} style={inputDark} className="input-dark" />
                    <input type="number" min="0" placeholder="Radius (km)" value={cookProfile.serviceArea.radiusKm} onChange={(e) => setCookProfile((p) => ({ ...p, serviceArea: { ...p.serviceArea, radiusKm: e.target.value } }))} style={inputDark} className="input-dark" />
                    <input type="text" placeholder="Address" value={cookProfile.serviceArea.address} onChange={(e) => setCookProfile((p) => ({ ...p, serviceArea: { ...p.serviceArea, address: e.target.value } }))} style={{ ...inputDark, gridColumn: "span 2" }} className="input-dark" />
                    <input type="text" placeholder="Pincodes (comma separated)" value={cookProfile.serviceArea.pincodes} onChange={(e) => setCookProfile((p) => ({ ...p, serviceArea: { ...p.serviceArea, pincodes: e.target.value } }))} style={{ ...inputDark, gridColumn: "span 2" }} className="input-dark" />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Cuisines (comma separated)</label>
                  <input type="text" placeholder="South Indian, North Indian" value={cookProfile.cuisines} onChange={(e) => setCookProfile((p) => ({ ...p, cuisines: e.target.value }))} style={inputDark} className="input-dark" />
                </div>
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="mb-3 text-sm font-semibold" style={{ color: "#a78bfa" }}>🕐 Delivery Timings</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input type="text" placeholder="Start time" value={cookProfile.deliveryTimings.start} onChange={(e) => setCookProfile((p) => ({ ...p, deliveryTimings: { ...p.deliveryTimings, start: e.target.value } }))} style={inputDark} className="input-dark" />
                    <input type="text" placeholder="End time" value={cookProfile.deliveryTimings.end} onChange={(e) => setCookProfile((p) => ({ ...p, deliveryTimings: { ...p.deliveryTimings, end: e.target.value } }))} style={inputDark} className="input-dark" />
                    <input type="text" placeholder="Slots (comma separated)" value={cookProfile.deliveryTimings.slots} onChange={(e) => setCookProfile((p) => ({ ...p, deliveryTimings: { ...p.deliveryTimings, slots: e.target.value } }))} style={{ ...inputDark, gridColumn: "span 2" }} className="input-dark" />
                  </div>
                </div>
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <p className="mb-3 text-sm font-semibold" style={{ color: "#a78bfa" }}>💰 Meal Plan Pricing</p>
                  <div className="grid grid-cols-3 gap-3">
                    {["daily", "weekly", "monthly"].map((plan) => (
                      <div key={plan}>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>{plan}</label>
                        <input type="number" placeholder="₹" value={cookProfile.mealPlans[plan]} onChange={(e) => setCookProfile((p) => ({ ...p, mealPlans: { ...p.mealPlans, [plan]: e.target.value } }))} style={inputDark} className="input-dark" />
                      </div>
                    ))}
                  </div>
                </div>
                <button type="submit" style={btnGrad}>Save Profile</button>
              </form>
            </div>
          </div>
        )}

        {/* MENU */}
        {activeTab === "menu" && isCook && (
          <div className="animate-fade-in space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl p-6" style={glass}>
                <h3 className="text-lg font-bold text-white">{editingMenuId ? "✏️ Edit Menu Item" : "➕ Add Menu Item"}</h3>
                <form onSubmit={handleMenuSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Dish Name *</label>
                    <input type="text" required placeholder="e.g. Dal Chawal" value={menuForm.dishName} onChange={(e) => setMenuForm((p) => ({ ...p, dishName: e.target.value }))} style={inputDark} className="input-dark" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Description</label>
                    <textarea placeholder="Describe the dish..." value={menuForm.description} onChange={(e) => setMenuForm((p) => ({ ...p, description: e.target.value }))} style={{ ...inputDark, minHeight: "80px", resize: "vertical" }} className="input-dark" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Type</label>
                      <select value={menuForm.mealType} onChange={(e) => setMenuForm((p) => ({ ...p, mealType: e.target.value }))} style={{ ...inputDark, background: "#1e293b" }}>
                        <option value="Veg">🟢 Veg</option>
                        <option value="Non-Veg">🔴 Non-Veg</option>
                        <option value="Vegan">🌿 Vegan</option>
                        <option value="Special">⭐ Special</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Cuisine</label>
                      <input type="text" placeholder="e.g. Punjabi" value={menuForm.cuisine} onChange={(e) => setMenuForm((p) => ({ ...p, cuisine: e.target.value }))} style={inputDark} className="input-dark" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Price *</label>
                      <input type="number" required placeholder="₹" value={menuForm.price} onChange={(e) => setMenuForm((p) => ({ ...p, price: e.target.value }))} style={inputDark} className="input-dark" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold" style={{ color: "#cbd5e1" }}>Tags</label>
                    <input type="text" placeholder="Tags (comma separated)" value={menuForm.tags} onChange={(e) => setMenuForm((p) => ({ ...p, tags: e.target.value }))} style={inputDark} className="input-dark" />
                  </div>
                  <label className="flex items-center gap-2 text-sm" style={{ color: "#94a3b8", cursor: "pointer" }}>
                    <input type="checkbox" checked={menuForm.availability} onChange={(e) => setMenuForm((p) => ({ ...p, availability: e.target.checked }))} />
                    Available now
                  </label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => { setEditingMenuId(null); setMenuForm(emptyMenuForm); }} style={btnGhost}>Reset</button>
                    <button type="submit" style={{ ...btnGrad, flex: 1 }}>{editingMenuId ? "Update Item" : "Add Item"}</button>
                  </div>
                </form>
              </div>

              <div className="rounded-2xl" style={glass}>
                <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 className="text-lg font-bold text-white">📋 Menu Catalog ({menuItems.length} items)</h3>
                </div>
                <div>
                  {menuItems.map((item, i) => (
                    <div key={item._id}
                      className="flex items-center justify-between px-6 py-4 transition-all duration-200"
                      style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(139,92,246,0.05)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full" style={{ background: item.mealType === "Veg" ? "#10b981" : item.mealType === "Non-Veg" ? "#ef4444" : "#f59e0b" }} />
                          <p className="text-sm font-semibold text-white">{item.dishName}</p>
                        </div>
                        <p className="mt-0.5 text-xs" style={{ color: "#64748b" }}>{item.mealType} · {item.cuisine || "—"} · {item.availability ? "Available" : "Unavailable"}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold" style={{ color: "#a78bfa" }}>₹{item.price}</span>
                        <button onClick={() => startEditingMenu(item)} className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa" }}>Edit</button>
                        <button onClick={() => deleteMenuItem(item._id)} className="rounded-lg px-3 py-1.5 text-xs font-semibold" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>Delete</button>
                      </div>
                    </div>
                  ))}
                  {!menuItems.length && <p className="px-6 py-12 text-center text-sm" style={{ color: "#334155" }}>Add a menu item to start taking orders.</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
