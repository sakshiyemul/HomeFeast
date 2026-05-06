import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { getUser } from "../services/session";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminOverview from "../components/admin/AdminOverview";
import UsersSection from "../components/admin/UsersSection";
import CooksSection from "../components/admin/CooksSection";
import OrdersSection from "../components/admin/OrdersSection";
import CategoriesSection from "../components/admin/CategoriesSection";
import ComplaintsSection from "../components/admin/ComplaintsSection";
function AdminDashboard() {
  const currentUser = getUser();
  const [overview, setOverview] = useState({});
  const [users, setUsers] = useState([]);
  const [cooks, setCooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: "", type: "cuisine" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sectionIds = useMemo(() => ["overview", "users", "cooks", "orders", "categories", "complaints"], []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const [overviewRes, usersRes, cooksRes, ordersRes, complaintsRes, categoriesRes] = await Promise.all([
        API.get("/admin/overview"), API.get("/admin/users"), API.get("/admin/cooks"),
        API.get("/admin/orders"), API.get("/admin/complaints"), API.get("/categories")
      ]);
      setOverview(overviewRes.data || {});
      setUsers(usersRes.data || []);
      setCooks(cooksRes.data || []);
      setOrders(ordersRes.data || []);
      setComplaints(complaintsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err) {
      console.error("Admin dashboard load failed", err);
      setError(err.response?.data?.message || "Unable to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const next = window.location.hash.replace("#", "");
      if (sectionIds.includes(next)) setActiveSection(next);
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [sectionIds]);

  const jumpToSection = (id) => {
    setActiveSection(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const handleCookApproval = async (cookId, approved) => {
    try { await API.patch(`/admin/approve-cook/${cookId}`, { approved }); await loadDashboard(); }
    catch (err) { setError(err.response?.data?.message || "Unable to update cook approval"); }
  };

  const handleUserChange = async (userId, role) => {
    try { await API.patch(`/admin/users/${userId}`, { role }); await loadDashboard(); }
    catch (err) { setError(err.response?.data?.message || "Unable to update user"); }
  };

  const handleUserDelete = async (userId) => {
    try { await API.delete(`/admin/users/${userId}`); await loadDashboard(); }
    catch (err) { setError(err.response?.data?.message || "Unable to delete user"); }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;
    try { await API.post("/categories", categoryForm); setCategoryForm({ name: "", type: "cuisine" }); await loadDashboard(); }
    catch (err) { setError(err.response?.data?.message || "Unable to add category"); }
  };

  const handleCategoryDelete = async (id) => {
    try { await API.delete(`/categories/${id}`); await loadDashboard(); }
    catch (err) { setError(err.response?.data?.message || "Unable to delete category"); }
  };

  const handleComplaintStatus = async (id, status) => {
    try { await API.patch(`/admin/complaints/${id}`, { status }); await loadDashboard(); }
    catch (err) { setError(err.response?.data?.message || "Unable to update complaint"); }
  };

  const overviewData = useMemo(() => ({
    users: overview?.users ?? 0,
    cooks: overview?.cooks ?? 0,
    orders: overview?.orders ?? 0,
    subscriptions: overview?.subscriptions ?? 0,
    pendingCooks: overview?.pendingCooks ?? 0,
    pendingOrders: overview?.pendingOrders ?? 0
  }), [overview]);

  const renderSection = () => {
    switch (activeSection) {
      case "users":       return <UsersSection users={users} currentUser={currentUser} onRoleChange={handleUserChange} onDelete={handleUserDelete} />;
      case "cooks":       return <CooksSection cooks={cooks} onApprove={handleCookApproval} />;
      case "orders":      return <OrdersSection orders={orders} />;
      case "categories":  return (
        <CategoriesSection
          categories={categories} form={categoryForm}
          onFormChange={(field, value) => setCategoryForm((prev) => ({ ...prev, [field]: value }))}
          onSubmit={handleCategorySubmit} onDelete={handleCategoryDelete}
        />
      );
      case "complaints":  return <ComplaintsSection complaints={complaints} onStatusChange={handleComplaintStatus} />;
      default:            return <AdminOverview overview={overviewData} />;
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#0f172a" }}>
      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{ position: "absolute", width: 600, height: 600, top: "-100px", left: "-100px", background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", width: 400, height: 400, bottom: "10%", right: "-50px", background: "radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", width: 300, height: 300, top: "40%", left: "40%", background: "radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)", borderRadius: "50%" }} />
      </div>

      <div className="relative flex min-h-screen">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-16 bottom-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:flex md:p-4`}
        >
          <div className="h-full w-full bg-[#0f172a] shadow-2xl md:bg-transparent md:shadow-none">
            <AdminSidebar
              activeSection={activeSection}
              onSelect={(id) => { jumpToSection(id); setIsSidebarOpen(false); }}
              loading={loading}
              onRefresh={loadDashboard}
            />
          </div>
        </div>

        <main className="flex-1 w-full transition-all duration-300 ml-0 md:ml-64 pt-16 overflow-x-hidden">
          <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">

            {/* Header card */}
            <header className="mb-6 rounded-2xl p-5" style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.07)"
            }}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl md:hidden"
                    style={{
                      background: "rgba(139,92,246,0.1)",
                      border: "1px solid rgba(139,92,246,0.3)",
                      color: "#a78bfa"
                    }}
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Admin Dashboard</span>
                    <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                      HomeFeast{" "}
                      <span style={{ background: "linear-gradient(135deg,#a78bfa,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        Control Center
                      </span>
                    </h1>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{
                  background: "rgba(139,92,246,0.08)",
                  border: "1px solid rgba(139,92,246,0.2)"
                }}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white" style={{
                    background: "linear-gradient(135deg, #7c3aed, #ec4899)"
                  }}>
                    {currentUser?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7c3aed" }}>Signed in as</p>
                    <p className="text-sm font-bold text-white">{currentUser?.name || "Admin"}</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>{currentUser?.email || "—"}</p>
                  </div>
                </div>
              </div>

              {loading && (
                <div className="mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5" style={{
                  background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)"
                }}>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-400" />
                  <span className="text-sm" style={{ color: "#60a5fa" }}>Loading admin data...</span>
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-xl px-4 py-2.5 text-sm font-medium" style={{
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171"
                }}>
                  {error}
                </div>
              )}
            </header>

            {/* Section content */}
            <div className="animate-fade-in">
              {renderSection()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
