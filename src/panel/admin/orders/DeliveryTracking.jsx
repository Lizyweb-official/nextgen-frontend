import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style-4.css';
import '../../../css/style.css';

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

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
   
    <div className="delivery-tracking-container container mt-4">

      {/* TOP BAR */}

      <div className="delivery-tracking-topbar d-flex justify-content-between align-items-center mb-4">

        {/* SEARCH BOX ONLY FOR TOP TABLE */}

        <div className="delivery-tracking-search-wrapper">

          <input
            type="text"
            className="delivery-tracking-search-input form-control"
            placeholder="Search by Delivery Partner ID"
            value={searchDpId}
            onChange={(e) => setSearchDpId(e.target.value)}
          />

        </div>

        {/* REFRESH BUTTON FOR BOTH TABLES */}

        <button
          className="delivery-tracking-refresh-btn btn btn-primary"
          onClick={fetchOrders}
        >
          Refresh
        </button>

      </div>


      {/* OUT FOR DELIVERY TABLE */}

      <div className="delivery-tracking-card card mb-5">

        <div className="delivery-tracking-card-header card-header">

          <h3 className="delivery-tracking-title">
            Out For Delivery Orders
          </h3>

        </div>

        <div className="delivery-tracking-card-body card-body table-responsive">

          <table className="delivery-tracking-table table table-bordered">

            <thead className="delivery-tracking-thead">

              <tr>

                <th>Order ID</th>
                <th>Delivery Partner ID</th>
                <th>Slot Time</th>
                <th>Delivery Time</th>
                <th>Delivery Status</th>
                <th>View Details</th>

              </tr>

            </thead>

            <tbody className="delivery-tracking-tbody">

              {filteredOutForDeliveryOrders.length > 0 ? (

                filteredOutForDeliveryOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="delivery-tracking-row"
                  >

                    <td className="delivery-tracking-td">
                      {order.id}
                    </td>

                    <td className="delivery-tracking-td">
                      {order.dp_id}
                    </td>

                    <td className="delivery-tracking-td">
                      {order.start_time}-{order.end_time}
                    </td>

                    <td className="delivery-tracking-td">
                      {order.delivery_time}
                    </td>

                    <td className="delivery-tracking-td">
                      <span className="delivery-tracking-status out-for-delivery">
                        {getStatusText(order.status_id)}
                      </span>
                    </td>

                    <td className="delivery-tracking-td">

                      <Link
                        to={`/Orderdetailpage/${order.id}`}
                        className="delivery-tracking-view-btn btn btn-primary btn-sm"
                      >
                        View Details
                      </Link>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="delivery-tracking-empty text-center"
                  >
                    No Out For Delivery Orders
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* DELIVERED / CANCELLED TABLE */}

      <div className="delivery-tracking-card card">

        <div className="delivery-tracking-card-header card-header">

          <h3 className="delivery-tracking-title">
            Last Orders
          </h3>

        </div>

        <div className="delivery-tracking-card-body card-body table-responsive">

          <table className="delivery-tracking-table table table-bordered">

            <thead className="delivery-tracking-thead">

              <tr>

                <th>Order ID</th>
                <th>Delivery Partner ID</th>
                <th>Slot Time</th>
                <th>Delivery Time</th>
                <th>Delivery Status</th>
                <th>View Details</th>

              </tr>

            </thead>

            <tbody className="delivery-tracking-tbody">

              {completedOrders.length > 0 ? (

                completedOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="delivery-tracking-row"
                  >

                    <td className="delivery-tracking-td">
                      {order.id}
                    </td>

                    <td className="delivery-tracking-td">
                      {order.dp_id}
                    </td>

                    <td className="delivery-tracking-td">
                      {order.start_time}-{order.end_time}
                    </td>

                    <td className="delivery-tracking-td">
                      {order.delivery_time}
                    </td>

                    <td className="delivery-tracking-td">

                      <span
                        className={`delivery-tracking-status ${
                          order.status_id === 4
                            ? "delivered"
                            : "cancelled"
                        }`}
                      >
                        {getStatusText(order.status_id)}
                      </span>

                    </td>

                    <td className="delivery-tracking-td">

                      <Link
                        to={`/Orderdetailpage/${order.id}`}
                        className="delivery-tracking-view-btn success btn btn-success btn-sm"
                      >
                        View Details
                      </Link>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="delivery-tracking-empty text-center"
                  >
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