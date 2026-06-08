import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';


const API = import.meta.env.VITE_API_URL;

function OrderSuccessPage() {
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      getLastOrder();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getLastOrder = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `${API}/api/order/lastorder/${user.id}`
      );

      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.log("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <h2 className="loading-text">
        Loading...
      </h2>
    );
  }

  return (
    <div className="order-success-container">

      {/* Success Message */}
      <div className="success-box">
        <h1 className="success-title">
          Order Placed Successfully 
        </h1>

       <p className="success-text d-flex align-items-center gap-2">
  <i className="bi bi-check-circle-fill"></i>
  Your order has been placed successfully.
</p>
      </div>

      {/* Order Details */}
      {order && (
        <div className="order-details-box">

          <h2 className="order-details-title">
            Order Details
          </h2>

          <div className="row">

            <div className="col-md-6 mb-3">
              <strong>Order ID:</strong> #{order.id}
            </div>

            <div className="col-md-6 mb-3">
              <strong>Name:</strong> {order.name}
            </div>

            <div className="col-md-6 mb-3">
              <strong>Phone:</strong> {order.contact_number}
            </div>

            <div className="col-md-6 mb-3">
              <strong>Payment Method:</strong>{" "}
              {order.payment_method}
            </div>

            <div className="col-md-6 mb-3">
              <strong>Payment Status:</strong>{" "}
              {order.payment_status}
            </div>

            <div className="col-md-6 mb-3">
              <strong>Total Amount:</strong> RM 
              {order.total_amount}
            </div>

            <div className="col-md-12 mb-3">
              <strong>Address:</strong>{" "}
              {order.street}, {order.city}{" "}-{" "}
              {order.pincode},{" "}
              {order.state}.
            </div>

            <div className="col-md-12">
              <strong>Order Date:</strong>{" "}
              {order.created_at}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default OrderSuccessPage;