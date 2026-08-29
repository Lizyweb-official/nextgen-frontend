import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style-4.css';
import '../../css/style.css';

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

const STATUS = {
  1: { label: "Preparing", step: 1 },
  2: { label: "Ready to Dispatch", step: 2 },
  3: { label: "Out for Delivery", step: 3 },
  4: { label: "Delivered", step: 4 },
};

const STEPS = [
  { id: 1, label: "Preparing" },
  { id: 2, label: "Ready to Dispatch" },
  { id: 3, label: "Out for Delivery" },
  { id: 4, label: "Delivered" },
];

const updateStatus = async (order_id, status_id) => {
  const response = await fetch(`${API}/api/order/updateOrderStatus`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ order_id, status_id }),
  });

  return response.json();
};

function ProgressBar({ statusId }) {
  const currentStep = STATUS[statusId]?.step || 1;

  return (
    <div className="osx-progress-container">
      {STEPS.map((step, idx) => (
        <div
          key={step.id}
          className={`osx-progress-step-wrapper ${
            idx < STEPS.length - 1 ? "osx-grow" : ""
          }`}
        >
          <div className="osx-progress-step">
            <div
              className={`osx-step-circle ${
                step.id <= currentStep ? "osx-done" : ""
              } ${step.id === currentStep ? "osx-active" : ""}`}
            />

            <span
              className={`osx-step-label ${
                step.id <= currentStep ? "osx-done" : ""
              } ${step.id === currentStep ? "osx-active" : ""}`}
            >
              {step.label}
            </span>
          </div>

          {idx < STEPS.length - 1 && (
            <div
              className={`osx-step-line ${
                currentStep > step.id ? "osx-completed" : ""
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function OrderCard({ order, onCancelled }) {
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canCancel = order.status_id === 1 || order.status_id === 2;

  const handleCancel = async () => {
    setCancelling(true);

    try {
      await updateStatus(order.id, 5);
      onCancelled(order.id);
    } catch (error) {
      console.error(error);
    } finally {
      setCancelling(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="osx-order-card">
      <div className="osx-order-card-top"></div>

      <div className="osx-order-header">
        <div>
          <span className="osx-order-id">
            Order #{order.id}
          </span>

          <div className="osx-order-date">
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <span className="osx-order-status-badge">
          {STATUS[order.status_id]?.label}
        </span>
      </div>

      <ProgressBar statusId={order.status_id} />

      <div className="osx-order-info-grid">
        <div className="osx-order-info-item">
          <div className="osx-info-title">Slot</div>
          <div className="osx-info-value">
            {order.slot_name} · {order.start_time?.slice(0, 5)} –{" "}
            {order.end_time?.slice(0, 5)}
          </div>
        </div>

        <div className="osx-order-info-item">
          <div className="osx-info-title">Delivery By</div>
          <div className="osx-info-value">
            {order.delivery_time?.slice(0, 5)+" | "+order.delivery_date}
          </div>
        </div>

        <div className="osx-order-info-item">
          <div className="osx-info-title">Total</div>
          <div className="osx-info-total">
            RM {parseFloat(order.total_amount).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="osx-order-meta">
        {order.items.length} item
        {order.items.length > 1 ? "s" : ""} ·{" "}
        {order.payment_method.toUpperCase()} · Payment :
        <span
          className={
            order.payment_status === "paid"
              ? "osx-payment-paid"
              : "osx-payment-pending"
          }
        >
          {" "}
          {order.payment_status}
        </span>
      </div>

      <div className="osx-order-actions">
        <Link
          to={`/orderdetailpage/${order.id}`}
          className="osx-btn-view"
        >
          View Details
        </Link>

        {canCancel && !showConfirm && (
          <button
            className="osx-btn-cancel"
            onClick={() => setShowConfirm(true)}
          >
            Cancel Order
          </button>
        )}

        {showConfirm && (
          <>
            <button
              className="osx-btn-keep"
              onClick={() => setShowConfirm(false)}
            >
              Keep Order
            </button>

            <button
              className="osx-btn-confirm"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling
                ? "Cancelling..."
                : "Yes, Cancel"}
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
        const response = await fetch(
          `${API}/api/order/getorderbycustomerid/${user?.id}`
        );

        const data = await response.json();

        // Hide orders whose online payment failed — they were never
        // actually placed, so there's nothing for the customer to track.
        const activeOrders = data.filter((order) =>
          [1, 2, 3].includes(order.status_id) && order.payment_status !== "failed"
        );

        setOrders(activeOrders);
      } catch (error) {
        setError(
          "Failed to load orders. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  const handleCancelled = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.filter(
        (order) => order.id !== orderId
      )
    );
  };

  return (
    <div className="osx-orders-page">
      <div className="osx-orders-header">
        <h2 className="osx-page-title">
          Active Orders
        </h2>

        <p className="osx-page-subtitle">
          Track your orders in real-time
        </p>
      </div>

      {loading && (
        <div className="osx-loading-container">
          <div className="osx-spinner"></div>

          <p className="osx-loading-text">
            Loading your orders...
          </p>
        </div>
      )}

      {error && (
        <div className="osx-error-box">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        orders.length === 0 && (
          <div className="osx-empty-orders">
            <div className="osx-empty-icon">
              🎉
            </div>

            <p className="osx-empty-title">
              No active orders
            </p>

            <p className="osx-empty-subtitle">
              All your orders have been delivered!
            </p>
          </div>
        )}

      {!loading &&
        orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onCancelled={handleCancelled}
          />
        ))}
    </div>
  );
}