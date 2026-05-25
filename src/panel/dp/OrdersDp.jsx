import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style-4.css';
import '../../css/style.css';

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

function OrdersDp() {
  const [readyOrders, setReadyOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const ordersRes = await fetch(`${API}/api/order/getallorders`);
      const ordersData = await ordersRes.json();

      const allOrders = Array.isArray(ordersData)
        ? ordersData
        : ordersData.data || [];

      const ready = allOrders.filter(
        (order) => order.status_id === 2
      );

      const dpRes = await fetch(
        `${API}/api/order/getorderbydp/${user.id}`
      );

      const dpJson = await dpRes.json();

      const dpData = Array.isArray(dpJson)
        ? dpJson
        : dpJson.data || dpJson.result || [];

      const dpOrderIds = dpData.map(
        (item) => item.order_id
      );

      const active = allOrders.filter(
        (order) =>
          order.status_id === 3 &&
          dpOrderIds.includes(order.id)
      );

      setReadyOrders(ready);
      setActiveOrders(active);
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const addDeliveryPartnerOrder = async (orderId) => {
    try {
      const res = await fetch(
        `${API}/api/order/adddeliverypartnerorder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dp_id: user.id,
            order_id: orderId,
          }),
        }
      );

      return await res.json();
    } catch (err) {
      console.log(err);
    }
  };

  const takeOrder = async (orderId) => {
    try {
      await addDeliveryPartnerOrder(orderId);

      const res = await fetch(
        `${API}/api/order/updateOrderStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            status_id: 3,
          }),
        }
      );

      const data = await res.json();

      alert(data.message);
      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const deliverOrder = async (orderId) => {
    try {
      const res = await fetch(
        `${API}/api/order/updateOrderStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            status_id: 4,
          }),
        }
      );

      const data = await res.json();

      alert(data.message);
      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const cancelledorder = async (orderId) => {
    try {
      const res = await fetch(
        `${API}/api/order/updateOrderStatus`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            status_id: 5,
          }),
        }
      );

      const data = await res.json();

      alert(data.message);
      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dp_db_order_tab_wrapper">

      {/* ACTIVE ORDERS */}
      <div className="dp_db_order_tab_section">

        <div className="dp_db_order_tab_header">
          <div className="dp_db_order_tab_title_group">

            <span className="dp_db_order_tab_dot dp_db_order_tab_dot_active"></span>

            <h2 className="dp_db_order_tab_title">
              Active Orders
            </h2>

            <span className="dp_db_order_tab_badge dp_db_order_tab_badge_active">
              {activeOrders.length} Orders
            </span>

          </div>

          <button
            className="dp_db_order_tab_refresh_btn"
            onClick={fetchOrders}
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        <table className="dp_db_order_tab_table">

          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Delivery Time</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {activeOrders.length > 0 ? (
              activeOrders.map((order) => (
                <tr key={order.id}>

                  <td className="dp_db_order_tab_order_id">
                    #{order.id}
                  </td>

                  <td className="dp_db_order_tab_name">
                    {order.name}
                  </td>

                  <td>
                    <div className="dp_db_order_tab_time_cell">
                      🕐 {order.delivery_time}
                    </div>
                  </td>

                  <td className="dp_db_order_tab_contact">
                    {order.contact_number}
                  </td>

                  <td>
                    <div className="dp_db_order_tab_actions">

                      <button
                        className="dp_db_order_tab_btn dp_db_order_tab_btn_delivered"
                        onClick={() => deliverOrder(order.id)}
                      >
                        Update to Delivered
                      </button>

                      <button
                        className="dp_db_order_tab_btn dp_db_order_tab_btn_cancel"
                        onClick={() => cancelledorder(order.id)}
                      >
                        Cancelled
                      </button>

                      <Link to={`/Orderdetailpage/${order.id}`}>
                        <button className="dp_db_order_tab_btn dp_db_order_tab_btn_view">
                          View Details
                        </button>
                      </Link>

                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr className="dp_db_order_tab_empty">
                <td colSpan="5">
                  No active orders found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* READY TO DISPATCH */}
      <div className="dp_db_order_tab_section">

        <div className="dp_db_order_tab_header">

          <div className="dp_db_order_tab_title_group">

            <span className="dp_db_order_tab_dot dp_db_order_tab_dot_ready"></span>

            <h2 className="dp_db_order_tab_title">
              Orders Ready To Dispatch
            </h2>

            <span className="dp_db_order_tab_badge dp_db_order_tab_badge_ready">
              {readyOrders.length} Orders
            </span>

          </div>

          <button
            className="dp_db_order_tab_refresh_btn"
            onClick={fetchOrders}
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>

        </div>

        <table className="dp_db_order_tab_table">

          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Delivery Time</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {readyOrders.length > 0 ? (
              readyOrders.map((order) => (
                <tr key={order.id}>

                  <td className="dp_db_order_tab_order_id">
                    #{order.id}
                  </td>

                  <td className="dp_db_order_tab_name">
                    {order.name}
                  </td>

                  <td>
                    <div className="dp_db_order_tab_time_cell">
                      🕐 {order.delivery_time}
                    </div>
                  </td>

                  <td className="dp_db_order_tab_contact">
                    {order.contact_number}
                  </td>

                  <td>
                    <div className="dp_db_order_tab_actions">

                      <button
                        className="dp_db_order_tab_btn dp_db_order_tab_btn_take"
                        onClick={() => takeOrder(order.id)}
                      >
                        📦 Take Order
                      </button>

                      <Link to={`/Orderdetailpage/${order.id}`}>
                        <button className="dp_db_order_tab_btn dp_db_order_tab_btn_view">
                          View Details
                        </button>
                      </Link>

                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr className="dp_db_order_tab_empty">
                <td colSpan="5">
                  No ready orders found
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}

export default OrdersDp;