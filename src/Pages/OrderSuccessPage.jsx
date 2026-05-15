import { useEffect, useState } from "react";
import {useAuth} from "../context/AuthContext"

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
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  return (
    <div className="container py-5">
      {/* Success Message */}
      <div
        style={{
          background: "#e8fff0",
          border: "1px solid #b7f0c2",
          borderRadius: "12px",
          padding: "30px",
          textAlign: "center",
          marginBottom: "30px"
        }}
      >
        <h1
          style={{
            color: "#198754",
            marginBottom: "10px"
          }}
        >
          Order Placed Successfully 🎉
        </h1>

        <p
          style={{
            fontSize: "18px",
            marginBottom: "0"
          }}
        >
          Your order has been placed successfully.
        </p>
      </div>

      {/* Order Details */}
      {order && (
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "25px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>
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

            {/* <div className="col-md-6 mb-3">
              <strong>Email:</strong> {order.email_address}
            </div> */}

            <div className="col-md-6 mb-3">
              <strong>Payment Method:</strong>{" "}
              {order.payment_method}
            </div>

            <div className="col-md-6 mb-3">
              <strong>Payment Status:</strong>{" "}
              {order.payment_status}
            </div>

            <div className="col-md-6 mb-3">
              <strong>Total Amount:</strong> ₹
              {order.total_amount}
            </div>

            <div className="col-md-12 mb-3">
              <strong>Address:</strong>{" "}
              {order.street}, {order.city},{" "}
              {order.district}, {order.state} -{" "}
              {order.pincode}
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