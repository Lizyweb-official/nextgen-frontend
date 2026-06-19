
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from 'react-router-dom';

import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

const API = import.meta.env.VITE_API_URL;

const formatTime = (t) => {
  if (!t) return "-";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

function OrderSuccessPage() {
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const width = useWindowWidth();
  const isMobile = width < 640;
  const isTablet = width < 900;

  useEffect(() => {
    if (user?.id) getLastOrder();
    else setLoading(false);
  }, [user]);

  const getLastOrder = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API}/api/order/lastorder/${user.id}`);
      const data = await res.json();
      if (data.success) setOrder(data.order);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={s.loadingWrap}>
        <div style={s.spinner} />
        <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>Loading your order…</p>
      </div>
    );
  }

  return (
    <div style={s.page}>

      {/* Success banner */}
      <div className="success-box" style={s.banner}>
        <h1 className="success-title">
          Order Placed Successfully 
        </h1>

       <p className="success-text text-center gap-2">
        <i className="bi bi-check-circle-fill"></i>
        Your order has been placed successfully.
      </p>
      </div>

      {order && (
        <div style={{ ...s.content, maxWidth: 920 }}>

          {/* Status strip */}
          <div style={{
            ...s.statusStrip,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 12 : 0,
            padding: isMobile ? "16px" : "16px 24px",
          }}>
            {[
              { label: "Order ID", value: `#${order.id}`, valueStyle: { fontSize: 15, fontWeight: 600, color: "#111827" } },
              {
                label: "Status", value: order.status_name, valueStyle: {
                  fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 20,
                  background: "#FEF3C7", color: "#92400E", display: "inline-block",
                }
              },
              {
                label: "Payment", value: order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1),
                valueStyle: {
                  fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 20,
                  background: order.payment_status === "paid" ? "#DCFCE7" : "#FEF3C7",
                  color: order.payment_status === "paid" ? "#166534" : "#92400E",
                  display: "inline-block",
                }
              },
              {
                label: "Total", value: `₹${parseFloat(order.total_amount).toFixed(2)}`,
                valueStyle: { fontSize: 15, fontWeight: 600, color: "#2563EB" }
              },
            ].map((item, idx, arr) => (
              <div key={idx} style={{ display: "contents" }}>
                <div style={{
                  ...s.statusItem,
                  flexDirection: isMobile ? "row" : "column",
                  justifyContent: isMobile ? "space-between" : "center",
                  alignItems: isMobile ? "center" : "center",
                  width: isMobile ? "100%" : undefined,
                  paddingBottom: isMobile ? 12 : 0,
                  borderBottom: isMobile && idx < arr.length - 1 ? "0.5px solid #E2E4E9" : "none",
                }}>
                  <span style={s.statusLabel}>{item.label}</span>
                  <span style={item.valueStyle}>{item.value}</span>
                </div>
                {!isMobile && idx < arr.length - 1 && (
                  <div style={s.stripDivider} />
                )}
              </div>
            ))}
          </div>

          {/* Two-column grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr",
            gap: 16,
            marginBottom: 16,
          }}>

            {/* Left: order info + delivery */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              <div style={s.card}>
                <h3 style={s.cardTitle}>📋 Order info</h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "14px 20px",
                }}>
                  <InfoRow label="Name" value={order.name} />
                  <InfoRow label="Phone" value={order.contact_number} />
                  <InfoRow label="Payment method" value={order.payment_method} />
                  <InfoRow label="Order date" value={order.created_at?.replace("T", " ").slice(0, 16)} />
                </div>
              </div>

              <div style={s.card}>
                <h3 style={s.cardTitle}>🚚 Delivery details</h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "14px 20px",
                }}>
                  <InfoRow label="Slot" value={order.slot_name} />
                  <InfoRow label="Slot time" value={`${formatTime(order.start_time)} – ${formatTime(order.end_time)}`} />
                  <InfoRow label="Delivery by" value={formatTime(order.delivery_time)} />
                  <InfoRow
                    label="Address"
                    value={`${order.street}, ${order.city} – ${order.pincode}, ${order.state}`}
                    full
                  />
                </div>
              </div>

            </div>

            {/* Right: items */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>🛒 Items ordered</h3>

              {order.items?.length > 0 ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {order.items.map((item, idx) => (
                      <div key={item.id} style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 0",
                        borderBottom: idx < order.items.length - 1 ? "0.5px solid #F1F2F4" : "none",
                      }}>
                        <div style={s.itemThumb}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                          </svg>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={s.itemName}>
                            {item.product_name || `Product #${item.product_id}`}
                          </div>
                          {item.custom_pieces ? (
                            <div style={s.itemMeta}>Custom: {item.custom_pieces}</div>
                          ) : null}
                          <div style={{ ...s.itemMeta, marginTop: 2 }}>
                            ₹{parseFloat(item.price).toFixed(2)} × {item.quantity}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <span style={s.qtyBadge}>×{item.quantity}</span>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827", marginTop: 4 }}>
                            ₹{parseFloat(item.q_price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div style={s.totalsBox}>
                    <div style={s.totalRow}>
                      <span style={{ color: "#6B7280" }}>Subtotal</span>
                      <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>
                    <div style={s.totalRow}>
                      <span style={{ color: "#6B7280" }}>Delivery</span>
                      <span style={{ color: "#16A34A" }}>Free</span>
                    </div>
                    <div style={{
                      ...s.totalRow,
                      borderTop: "0.5px solid #E2E4E9",
                      paddingTop: 10, marginTop: 4,
                    }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>Total</span>
                      <span style={{ fontWeight: 600, fontSize: 15, color: "#2563EB" }}>
                        ₹{parseFloat(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p style={{ color: "#9CA3AF", fontSize: 13, padding: "12px 0" }}>No items found.</p>
              )}
            </div>

          </div>

          {/* CTA buttons */}
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "center",
            gap: 12,
          }}>
            <Link style={{
              ...s.btnOutline,
              width: isMobile ? "100%" : "auto",
            }} to="/Shop">
              ← Continue shopping
            </Link>
            <Link style={{
              ...s.btnPrimary,
              width: isMobile ? "100%" : "auto",
            }} to="/">
              Home
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, full }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : undefined }}>
      <div style={{
        fontSize: 11, fontWeight: 500, color: "#9CA3AF",
        textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3,
      }}>
        {label}
      </div>
      <div style={{ fontSize: 13.5, color: "#1A1D23" }}>{value || "—"}</div>
    </div>
  );
}

const s = {
  page: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    minHeight: "100vh",
    background: "#F4F5F7",
    padding: "28px 16px 52px",
  },
  loadingWrap: {
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    minHeight: "60vh", gap: 16,
  },
  spinner: {
    width: 30, height: 30,
    border: "3px solid #E5E7EB",
    borderTop: "3px solid #4F7EF7",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  banner: {
    maxWidth: '60%', margin: "0 auto 24px",
    textAlign: "center", padding: "20px 12px",
  },
  iconCircle: {
    width: 60, height: 60, borderRadius: "50%",
    background: "#DCFCE7",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 14px",
  },
  bannerTitle: {
    fontWeight: 600, color: "#111827", margin: "0 0 8px",
  },
  bannerSub: {
    fontSize: 14, color: "#6B7280", margin: 0,
  },
  content: {
    margin: "0 auto",
  },
  statusStrip: {
    background: "#fff",
    border: "0.5px solid #E2E4E9",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  statusItem: {
    flex: 1, minWidth: 100,
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 6,
  },
  stripDivider: {
    width: "0.5px", background: "#E2E4E9",
    alignSelf: "stretch", margin: "0 4px",
  },
  statusLabel: {
    fontSize: 11, fontWeight: 500, color: "#9CA3AF",
    textTransform: "uppercase", letterSpacing: "0.5px",
  },
  card: {
    background: "#fff",
    border: "0.5px solid #E2E4E9",
    borderRadius: 12,
    padding: "18px 20px",
  },
  cardTitle: {
    fontSize: 14, fontWeight: 600, color: "#111827",
    margin: "0 0 14px",
    display: "flex", alignItems: "center", gap: 6,
  },
  itemThumb: {
    width: 40, height: 40, borderRadius: 8,
    background: "#F4F5F7", border: "0.5px solid #E2E4E9",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  itemName: {
    fontSize: 13.5, fontWeight: 500, color: "#111827",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  itemMeta: { fontSize: 12, color: "#9CA3AF", marginTop: 1 },
  qtyBadge: {
    background: "#EEF2FF", color: "#4F7EF7",
    fontSize: 12, fontWeight: 600,
    padding: "2px 8px", borderRadius: 6,
  },
  totalsBox: {
    borderTop: "0.5px solid #E2E4E9",
    marginTop: 12, paddingTop: 12,
    display: "flex", flexDirection: "column", gap: 8,
  },
  totalRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: 13.5, color: "#111827",
  },
  btnPrimary: {
    padding: "10px 28px",
    background: "var(--sub)", color: "#fff",
    border: "none", borderRadius: 8,
    fontSize: 14, fontWeight: 500, cursor: "pointer",
  },
  btnOutline: {
    padding: "10px 28px",
    background: "#fff", color: "#374151",
    border: "0.5px solid #D1D5DB", borderRadius: 8,
    fontSize: 14, fontWeight: 500, cursor: "pointer",
  },
};

export default OrderSuccessPage;