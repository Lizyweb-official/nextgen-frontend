import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API = "http://localhost:5000";

// Status config
const STATUS = {
  1: { label: "Preparing", color: "#F59E0B", bg: "#FEF3C7", icon: "🍳", step: 1 },
  2: { label: "Ready to Dispatch", color: "#3B82F6", bg: "#DBEAFE", icon: "📦", step: 2 },
  3: { label: "Out for Delivery", color: "#8B5CF6", bg: "#EDE9FE", icon: "🛵", step: 3 },
};

const STEPS = [
  { id: 1, label: "Preparing", icon: "" },
  { id: 2, label: "Ready to Dispatch", icon: "" },
  { id: 3, label: "Out for Delivery", icon: "" },
];

const updateStatus = async (order_id, status_id) => {
  const response = await fetch(`${API}/api/order/updateOrderStatus`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id, status_id }),
  });
  return response.json();
};

function ProgressBar({ statusId }) {
  const currentStep = STATUS[statusId]?.step || 1;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "16px 0 8px" }}>
      {STEPS.map((step, idx) => {
        const done = step.id <= currentStep;
        const active = step.id === currentStep;
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center", flex: idx < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 64,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: done ? STATUS[step.id].color : "#E5E7EB",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, transition: "all 0.4s",
                boxShadow: active ? `0 0 0 4px ${STATUS[step.id].color}33` : "none",
                transform: active ? "scale(1.15)" : "scale(1)",
              }}>
                {step.icon}
              </div>
              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 500,
                color: done ? STATUS[step.id].color : "#9CA3AF",
                textAlign: "center", whiteSpace: "nowrap",
                fontFamily: "'DM Sans', sans-serif",
              }}>{step.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 3, borderRadius: 2, margin: "0 4px", marginBottom: 20,
                background: currentStep > step.id
                  ? `linear-gradient(90deg, ${STATUS[step.id].color}, ${STATUS[step.id + 1].color})`
                  : "#E5E7EB",
                transition: "background 0.5s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, onCancelled }) {
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const status = STATUS[order.status_id];
  const canCancel = order.status_id === 1 || order.status_id === 2;

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await updateStatus(order.id, 5);
      onCancelled(order.id);
    } catch (e) {
      console.error(e);
    } finally {
      setCancelling(false);
      setShowConfirm(false);
    }
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      padding: "20px 24px",
      marginBottom: 16,
      boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      border: `1.5px solid ${status.color}22`,
      position: "relative",
      overflow: "hidden",
      animation: "slideIn 0.35s cubic-bezier(.4,0,.2,1)",
    }}>
      {/* Top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${status.color}, ${status.color}88)`,
        borderRadius: "20px 20px 0 0",
      }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827",
          }}>
            Order #{order.id}
          </span>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1, fontFamily: "'DM Sans', sans-serif" }}>
            {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
        <span style={{
          background: status.bg, color: status.color,
          fontSize: 11, fontWeight: 700, padding: "4px 12px",
          borderRadius: 20, fontFamily: "'DM Sans', sans-serif",
          letterSpacing: 0.3,
        }}>
          {status.icon} {status.label}
        </span>
      </div>

      {/* Progress */}
      <ProgressBar statusId={order.status_id} />

      {/* Delivery slot */}
      <div style={{
        display: "flex", gap: 12, margin: "12px 0 0",
        background: "#F9FAFB", borderRadius: 12, padding: "10px 14px",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Slot</div>
          <div style={{ fontSize: 13, color: "#374151", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
            {order.slot_name} · {order.start_time?.slice(0, 5)}–{order.end_time?.slice(0, 5)}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Delivery by</div>
          <div style={{ fontSize: 13, color: "#374151", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
            {order.delivery_time?.slice(0, 5)}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Total</div>
          <div style={{ fontSize: 13, color: "#111827", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
            ₹{parseFloat(order.total_amount).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Items count */}
      <div style={{ fontSize: 12, color: "#6B7280", margin: "10px 0 0", fontFamily: "'DM Sans', sans-serif" }}>
        {order.items.length} item{order.items.length > 1 ? "s" : ""} · {order.payment_method.toUpperCase()} · Payment: <span style={{ color: order.payment_status === "paid" ? "#10B981" : "#F59E0B", fontWeight: 600 }}>{order.payment_status}</span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <Link
          to={`/orderdetailpage/${order.id}`}
          style={{
            flex: 1, padding: "9px 0", borderRadius: 12, textAlign: "center",
            background: "#F3F4F6", color: "#374151", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, fontSize: 13, textDecoration: "none",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#E5E7EB"}
          onMouseLeave={e => e.currentTarget.style.background = "#F3F4F6"}
        >
          View Details
        </Link>

        {canCancel && !showConfirm && (
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              flex: 1, padding: "9px 0", borderRadius: 12,
              background: "#FEF2F2", color: "#EF4444", border: "none",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
              cursor: "pointer", transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#FEE2E2"}
            onMouseLeave={e => e.currentTarget.style.background = "#FEF2F2"}
          >
            Cancel Order
          </button>
        )}

        {showConfirm && (
          <>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                flex: 1, padding: "9px 0", borderRadius: 12,
                background: "#F3F4F6", color: "#6B7280", border: "none",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer",
              }}
            >
              Keep
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              style={{
                flex: 1, padding: "9px 0", borderRadius: 12,
                background: "#EF4444", color: "#fff", border: "none",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                cursor: cancelling ? "not-allowed" : "pointer", opacity: cancelling ? 0.7 : 1,
              }}
            >
              {cancelling ? "Cancelling…" : "Yes, Cancel"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function OrderStatus() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/api/order/getorderbycustomerid/${user?.id}`);
        const data = await res.json();
        // Only show orders with status 1, 2, or 3
        const active = data.filter(o => [1, 2, 3].includes(o.status_id));
        setOrders(active);
      } catch (e) {
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.id]);

  const handleCancelled = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        maxWidth: "100%", margin: "0 auto", padding: "24px 16px",
      }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 22, fontWeight: 700, color: "#111827", margin: 0,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Active Orders
          </h2>
          <p style={{ fontSize: 13, color: "#9CA3AF", margin: "4px 0 0" }}>
            Track your orders in real-time
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{
              width: 36, height: 36, border: "3px solid #E5E7EB",
              borderTopColor: "#3B82F6", borderRadius: "50%",
              animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
            }} />
            <p style={{ color: "#9CA3AF", fontSize: 14 }}>Loading your orders…</p>
          </div>
)}

        {error && (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FCA5A5",
            borderRadius: 12, padding: "14px 16px", color: "#EF4444",
            fontSize: 14, textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div style={{
            textAlign: "center", padding: "48px 24px",
            background: "#F9FAFB", borderRadius: 20,
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <p style={{ fontWeight: 700, fontSize: 16, color: "#111827", margin: 0 }}>No active orders</p>
            <p style={{ color: "#9CA3AF", fontSize: 13, marginTop: 4 }}>All your orders have been delivered!</p>
          </div>
        )}

        {!loading && orders.map(order => (
          <OrderCard key={order.id} order={order} onCancelled={handleCancelled} />
        ))}
      </div>
    </>
  );
}