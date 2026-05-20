import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style-4.css';
import '../../../css/style.css';

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:5000";

function DeliveryTracking() {

  const [outForDeliveryOrders, setOutForDeliveryOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // SEARCH STATE FOR TOP TABLE
  const [searchDpId, setSearchDpId] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {

    setLoading(true);

    try {

      const response = await fetch(`${API}/api/order/getallorders`);
      const orders = await response.json();

      // get dp_id for each order
      const ordersWithDp = await Promise.all(
        orders.map(async (order) => {
          try {

            const dpResponse = await fetch(
              `${API}/api/order/getdporderbyorderid/${order.id}`
            );

            const dpData = await dpResponse.json();

            return {
              ...order,
              dp_id: dpData?.[0]?.dp_id || "-"
            };

          } catch (error) {

            return {
              ...order,
              dp_id: "-"
            };

          }
        })
      );

      // Out For Delivery => status_id = 3
      const outForDelivery = ordersWithDp.filter(
        (order) => order.status_id === 3
      );

      // Delivered or Cancelled => status_id = 4 or 5
      const deliveredCancelled = ordersWithDp
        .filter(
          (order) =>
            order.status_id === 4 || order.status_id === 5
        )
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 10);

      setOutForDeliveryOrders(outForDelivery);
      setCompletedOrders(deliveredCancelled);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const getStatusText = (statusId) => {

    switch (statusId) {

      case 3:
        return "Out For Delivery";

      case 4:
        return "Delivered";

      case 5:
        return "Cancelled";

      default:
        return "Unknown";

    }
  };

  // FILTER ONLY FOR TOP TABLE
  const filteredOutForDeliveryOrders = outForDeliveryOrders.filter((order) =>
    String(order.dp_id)
      .toLowerCase()
      .includes(searchDpId.toLowerCase())
  );

  if (loading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="container mt-4">

      {/* TOP BAR */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        {/* SEARCH BOX ONLY FOR TOP TABLE */}

        <div style={{ width: "300px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by Delivery Partner ID"
            value={searchDpId}
            onChange={(e) => setSearchDpId(e.target.value)}
          />
        </div>

        {/* REFRESH BUTTON FOR BOTH TABLES */}

        <button
          className="btn btn-primary"
          onClick={fetchOrders}
        >
          Refresh
        </button>

      </div>


      {/* OUT FOR DELIVERY TABLE */}

      <div className="card mb-5">

        <div className="card-header">
          <h3>Out For Delivery Orders</h3>
        </div>

        <div className="card-body table-responsive">

          <table className="table table-bordered">

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Delivery Partner ID</th>
                <th>Slot Time</th>
                <th>Delivery Time</th>
                <th>Delivery Status</th>
                <th>View Details</th>
              </tr>
            </thead>

            <tbody>

              {filteredOutForDeliveryOrders.length > 0 ? (

                filteredOutForDeliveryOrders.map((order) => (

                  <tr key={order.id}>

                    <td>{order.id}</td>

                    <td>{order.dp_id}</td>

                    <td>{order.start_time}-{order.end_time}</td>

                    <td>{order.delivery_time}</td>

                    <td>{getStatusText(order.status_id)}</td>

                    <td>
                      <Link
                        to={`/Orderdetailpage/${order.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View Details
                      </Link>
                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="4" className="text-center">
                    No Out For Delivery Orders
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* DELIVERED / CANCELLED TABLE */}

      <div className="card">

        <div className="card-header">
          <h3>Last 10 Delivered / Cancelled Orders</h3>
        </div>

        <div className="card-body table-responsive">

          <table className="table table-bordered">

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Delivery Partner ID</th>
                <th>Slot Time</th>
                <th>Delivery Time</th>
                <th>Delivery Status</th>
                <th>View Details</th>
              </tr>
            </thead>

            <tbody>

              {completedOrders.length > 0 ? (

                completedOrders.map((order) => (

                  <tr key={order.id}>

                    <td>{order.id}</td>

                    <td>{order.dp_id}</td>

                    <td>{order.start_time}-{order.end_time}</td>

                    <td>{order.delivery_time}</td>

                    <td>{getStatusText(order.status_id)}</td>

                    <td>
                      <Link
                        to={`/Orderdetailpage/${order.id}`}
                        className="btn btn-success btn-sm"
                      >
                        View Details
                      </Link>
                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="4" className="text-center">
                    No Delivered or Cancelled Orders
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default DeliveryTracking;