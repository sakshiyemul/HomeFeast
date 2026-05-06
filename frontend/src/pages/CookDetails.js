import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import { getToken, getUser } from "../services/session";
import { formatDeliveryTimings, formatServiceArea, toList, toNumber } from "../utils/formatters";

const planLabels = { daily: "Daily", weekly: "Weekly", monthly: "Monthly" };

function CookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const token = getToken();
  const [cook, setCook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("info");
  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
  const [orderForm, setOrderForm] = useState({ quantity: 1, deliverySlot: "", deliveryDate: "" });
  const [subscriptionPlan, setSubscriptionPlan] = useState("daily");
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  const showMessage = (text, type = "info") => { setMessage(text); setMsgType(type); };

  const loadCook = async () => {
    try {
      setLoading(true);
      const [cookRes, reviewsRes] = await Promise.all([
        API.get(`/cooks/${id}`),
        API.get(`/reviews/cook/${id}`)
      ]);
      setCook({ ...cookRes.data, reviews: reviewsRes.data });
      setSelectedMenuItemId(cookRes.data.menu?.[0]?._id || "");
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Unable to load cook profile", "error");
    } finally {
      setLoading(false);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadCook(); }, [id]);

  const selectedItem = useMemo(
    () => cook?.menu?.find((item) => item._id === selectedMenuItemId) || null,
    [cook, selectedMenuItemId]
  );

  if (!id) return <Navigate to="/" replace />;

  const handleOrder = async (event) => {
    event.preventDefault();
    if (!token) { navigate("/login"); return; }
    if (!selectedItem) { showMessage("Please choose a menu item first", "error"); return; }
    try {
      setMessage("");
      await API.post("/orders", {
        cookId: cook._id,
        items: [{ menuItemId: selectedItem._id, dishName: selectedItem.dishName, price: selectedItem.price, quantity: toNumber(orderForm.quantity, 1) }],
        deliverySlot: orderForm.deliverySlot,
        deliveryDate: orderForm.deliveryDate
      });
      showMessage("Order placed successfully! 🎉", "success");
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Unable to place order", "error");
    }
  };

  const handleSubscription = async (event) => {
    event.preventDefault();
    if (!token) { navigate("/login"); return; }
    try {
      setMessage("");
      await API.post("/subscriptions", { cookId: cook._id, plan: subscriptionPlan });
      showMessage("Subscription started! 🎉", "success");
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Unable to subscribe", "error");
    }
  };

  const handleReview = async (event) => {
    event.preventDefault();
    if (!token) { navigate("/login"); return; }
    try {
      setMessage("");
      await API.post("/reviews", { cookId: cook._id, rating: toNumber(reviewForm.rating, 5), comment: reviewForm.comment });
      setReviewForm({ rating: 5, comment: "" });
      await loadCook();
      showMessage("Review saved! Thank you 🙏", "success");
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Unable to submit review", "error");
    }
  };

  const msgClasses = msgType === "success"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : msgType === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-slate-900 via-brand-900 to-slate-800 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link to="/" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 no-underline transition hover:bg-white/20">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to cooks
          </Link>

          {loading ? (
            <div className="mt-8 flex items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-300 border-t-white" />
              <span className="text-white/70">Loading cook profile...</span>
            </div>
          ) : cook ? (
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{cook.businessName}</h1>
                <p className="mt-2 max-w-lg text-sm text-slate-300">{cook.tagline || "Homemade meals made with care."}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 rounded-full bg-amber-400/20 px-3 py-1 text-sm font-bold text-amber-300">
                    ⭐ {toNumber(cook.rating, 0).toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400">{cook.reviewsCount || 0} reviews</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cook.isApproved ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                    {cook.isApproved ? "✓ Verified" : "Pending approval"}
                  </span>
                </div>
              </div>
              {!user && (
                <Link className="inline-flex rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white no-underline shadow-lg transition hover:bg-brand-700" to="/login">
                  Login to Order
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {message && (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className={`rounded-xl border px-5 py-3 text-sm font-medium ${msgClasses}`}>{message}</div>
        </div>
      )}

      {cook && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Info cards */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                <svg className="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                About
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-800">Area:</span> {formatServiceArea(cook.serviceArea)}</p>
                <p><span className="font-semibold text-slate-800">Delivery:</span> {formatDeliveryTimings(cook.deliveryTimings, cook.deliverySlots)}</p>
                <p><span className="font-semibold text-slate-800">Cuisines:</span> {toList(cook.cuisines).join(", ") || "Multi-cuisine"}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Meal Plans
              </h3>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {["daily", "weekly", "monthly"].map((plan) => (
                  <div key={plan} className="rounded-xl bg-slate-50 p-3 text-center">
                    <p className="text-xs font-semibold uppercase text-slate-400">{planLabels[plan]}</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {cook.mealPlans?.[plan] ? `₹${cook.mealPlans[plan]}` : "—"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
                <svg className="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                Rating
              </h3>
              <div className="mt-4 text-center">
                <p className="text-4xl font-extrabold text-slate-900">{toNumber(cook.rating, 0).toFixed(1)}</p>
                <div className="mt-1 flex items-center justify-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`h-5 w-5 ${star <= Math.round(cook.rating || 0) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-2 text-sm text-slate-500">{cook.reviewsCount || 0} reviews</p>
              </div>
            </div>
          </div>

          {/* Menu + Order section */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Menu */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="text-lg font-bold text-slate-900">🍽️ Full Menu</h3>
              <div className="mt-4 space-y-2">
                {cook.menu?.length ? (
                  cook.menu.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => setSelectedMenuItemId(item._id)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                        selectedMenuItemId === item._id
                          ? "border-brand-300 bg-brand-50 shadow-sm"
                          : "border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white"
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{item.dishName}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {item.mealType} · {item.cuisine || "Cuisine"} · {item.availability ? "✓ Available" : "Unavailable"}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-brand-600">₹{item.price}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">Menu will be updated soon.</p>
                )}
              </div>
            </div>

            {/* Order + Subscribe */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <h3 className="text-lg font-bold text-slate-900">🛒 Place Order</h3>
                <form className="mt-4 space-y-4" onSubmit={handleOrder}>
                  <select required value={selectedMenuItemId} onChange={(e) => setSelectedMenuItemId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white">
                    <option value="">Choose menu item</option>
                    {cook.menu?.map((item) => (
                      <option key={item._id} value={item._id}>{item.dishName} — ₹{item.price}</option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" min="1" placeholder="Qty" value={orderForm.quantity}
                      onChange={(e) => setOrderForm((p) => ({ ...p, quantity: e.target.value }))}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white" />
                    <input type="text" placeholder="Delivery slot" value={orderForm.deliverySlot}
                      onChange={(e) => setOrderForm((p) => ({ ...p, deliverySlot: e.target.value }))}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white" />
                  </div>
                  <input type="date" value={orderForm.deliveryDate}
                    onChange={(e) => setOrderForm((p) => ({ ...p, deliveryDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white" />
                  <button className="w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-lg shadow-brand-200 transition hover:-translate-y-0.5 hover:bg-brand-700" type="submit">
                    Place Order
                  </button>
                </form>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <h3 className="text-lg font-bold text-slate-900">📅 Subscribe</h3>
                <form className="mt-4 space-y-4" onSubmit={handleSubscription}>
                  <div className="grid grid-cols-3 gap-2">
                    {["daily", "weekly", "monthly"].map((plan) => (
                      <button key={plan} type="button" onClick={() => setSubscriptionPlan(plan)}
                        className={`rounded-xl border-2 py-3 text-sm font-semibold capitalize transition ${
                          subscriptionPlan === plan
                            ? "border-brand-500 bg-brand-50 text-brand-700"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}>
                        {plan}
                      </button>
                    ))}
                  </div>
                  <button className="w-full rounded-xl border-2 border-brand-600 bg-white py-3 text-sm font-bold text-brand-600 transition hover:bg-brand-50" type="submit">
                    Start Subscription
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Reviews section */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="text-lg font-bold text-slate-900">✍️ Leave a Review</h3>
              <form className="mt-4 space-y-4" onSubmit={handleReview}>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                      className={`text-2xl transition ${star <= reviewForm.rating ? "text-amber-400" : "text-slate-200 hover:text-amber-300"}`}>
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-slate-500">{reviewForm.rating}/5</span>
                </div>
                <textarea placeholder="Share your experience..." value={reviewForm.comment}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand-500 focus:bg-white" rows={3} />
                <button className="w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700" type="submit">
                  Submit Review
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="text-lg font-bold text-slate-900">💬 Customer Reviews</h3>
              <div className="mt-4 space-y-3">
                {cook.reviews?.length ? (
                  cook.reviews.map((review) => (
                    <div key={review._id} className="rounded-xl bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                            {review.user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <span className="text-sm font-semibold text-slate-800">{review.user?.name || "Customer"}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <svg key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{review.comment || "No comment"}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No reviews yet. Be the first!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CookDetails;
