import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style-4.css';
import '../../../css/style.css';

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function OrderHistory() {

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("order_id");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

 const fetchOrders = async () => {
  try {
    setLoading(true);

    // Get orders
    const response = await fetch(`${API}/api/order/getallorders`);
    const data = await response.json();

    // Filter orders
    const filtered = data.filter(
      (order) => order.status_id === 4 || order.status_id === 5
    );

    // Fetch dp_id for each order
    const ordersWithDP = await Promise.all(
      filtered.map(async (order) => {
        try {
          const dpRes = await fetch(
            `${API}/api/order/getdpbyorderid/${order.id}`
          );

          const dpData = await dpRes.json();

          return {
            ...order,
            delivery_partner_id: dpData.success ? dpData.dp_id : null
          };
        } catch (err) {
          console.error(`DP fetch failed for order ${order.id}`, err);

          return {
            ...order,
            delivery_partner_id: null
          };
        }
      })
    );

    // Sort latest first
    ordersWithDP.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    setOrders(ordersWithDP);
    setFilteredOrders(ordersWithDP);

  } catch (error) {
    console.error("Error fetching orders:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let temp = [...orders];

    // search by selected field
    if (search.trim() !== "") {
      temp = temp.filter((order) => {
        if (searchBy === "order_id")
          return order.id.toString().includes(search.trim());
        if (searchBy === "customer_id")
          return order.customer_id.toString().includes(search.trim());
        if (searchBy === "status")
          return order.status_name.toLowerCase().includes(search.trim().toLowerCase());
        return true;
      });
    }

    // status filter
    if (statusFilter !== "all") {
      temp = temp.filter(
        (order) => order.status_id.toString() === statusFilter
      );
    }

    // date range filter
    if (startDate) {
      temp = temp.filter((order) => {
        const orderDate = new Date(order.created_at).toISOString().split("T")[0];
        return orderDate >= startDate;
      });
    }
    if (endDate) {
      temp = temp.filter((order) => {
        const orderDate = new Date(order.created_at).toISOString().split("T")[0];
        return orderDate <= endDate;
      });
    }

    setFilteredOrders(temp);
    setCurrentPage(1);
  }, [search, searchBy, statusFilter, startDate, endDate, orders]);

  const resetFilters = () => {
        setSearch("");
        setSearchBy("order_id");
        setStatusFilter("all");
        setStartDate("");
        setEndDate("");
    };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (

    <div className="container-fluid py-4 order-history-page">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2 order-history-header">

        <h3 className="mb-0 order-history-title">
          Cancelled / Delivered Orders
        </h3>

        <button
          className="btn btn-primary order-history-refresh-btn"
          onClick={fetchOrders}
        >
          Refresh
        </button>

      </div>

      {/* Filter Section */}
      <div className="card shadow-sm border-0 mb-4 order-history-filter-card">

        <div className="card-body order-history-filter-body">

          <div className="row g-3 order-history-filter-row">

            {/* Search */}
            <div className="col-md-4 order-history-search-col">

              <label className="form-label order-history-label">
                Search
              </label>

              <div className="input-group order-history-search-group">

                <select
                  className="form-select flex-grow-0 w-auto order-history-search-select"
                  value={searchBy}
                  onChange={(e) => {
                    setSearchBy(e.target.value);
                    setSearch("");
                  }}
                >

                  <option value="order_id">
                    Order ID
                  </option>

                  <option value="customer_id">
                    Customer ID
                  </option>

                  <option value="status">
                    Status
                  </option>

                </select>

                <input
                  type="text"
                  className="form-control order-history-search-input"
                  placeholder={
                    searchBy === "order_id"
                      ? "Search by Order ID"
                      : searchBy === "customer_id"
                      ? "Search by Customer ID"
                      : "Search by Status"
                  }
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

            </div>

            {/* Status Filter */}
            <div className="col-md-2 order-history-status-col">

              <label className="form-label order-history-label">
                Status Filter
              </label>

              <select
                className="form-select order-history-status-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >

                <option value="all">
                  All
                </option>

                <option value="4">
                  Delivered
                </option>

                <option value="5">
                  Cancelled
                </option>

              </select>

            </div>

            {/* Start Date */}
            <div className="col-md-3 order-history-date-col">

              <label className="form-label order-history-label">
                Start Date
              </label>

              <input
                type="date"
                className="form-control order-history-date-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

            </div>

            {/* End Date */}
            <div className="col-md-3 order-history-date-col">

              <label className="form-label order-history-label">
                End Date
              </label>

              <input
                type="date"
                className="form-control order-history-date-input"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

            </div>

            {/* Reset Button */}
            <div className="col-md-3 order-history-reset-col d-flex align-items-end">

              <button
                className="btn btn-secondary w-100 order-history-reset-btn"
                onClick={resetFilters}
              >
                Reset Filters
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Table Section */}
      <div className="card shadow-sm border-0 order-history-table-card">

        <div className="card-body table-responsive order-history-table-wrapper">

          {loading ? (

            <div className="text-center py-5 order-history-loading">
              Loading...
            </div>

          ) : (

            <table className="table table-bordered table-hover align-middle order-history-table">

              <thead className="table-dark order-history-table-head">

                <tr className="order-history-head-row">

                  <th className="order-history-th">
                    Order ID
                  </th>

                  <th className="order-history-th">
                    Customer ID
                  </th>

                  <th className="order-history-th">
                    Delivery Partner ID
                  </th>

                  <th className="order-history-th">
                    Time Of Order Placed
                  </th>

                  <th className="order-history-th">
                    Status Name
                  </th>

                  <th className="order-history-th">
                    Order Details
                  </th>

                </tr>

              </thead>

              <tbody className="order-history-table-body">

                {currentOrders.length > 0 ? (

                  currentOrders.map((order) => (

                    <tr
                      key={order.id}
                      className="order-history-table-row"
                    >

                      <td className="order-history-td order-history-order-id">
                        #{order.id}
                      </td>

                      <td className="order-history-td order-history-customer-id">
                        {order.customer_id}
                      </td>
                      <td className="order-history-td order-history-customer-id">
                        {order.delivery_partner_id}
                      </td>

                      <td className="order-history-td order-history-date">
                        {new Date(order.created_at).toLocaleString()}
                      </td>

                      <td className="order-history-td order-history-status">

                        <span
                          className={`order-history-status-badge ${
                            order.status_id === 4
                              ? "order-history-delivered"
                              : "order-history-cancelled"
                          }`}
                        >
                          {order.status_name}
                        </span>

                      </td>

                      <td className="order-history-td order-history-action">

                        <Link
                          to={`/orderdetailpage/${order.id}`}
                          className="btn btn-sm btn-primary order-history-view-btn"
                        >
                          View Details
                        </Link>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr className="order-history-empty-row">

                    <td
                      colSpan="5"
                      className="text-center py-4 order-history-empty-text"
                    >
                      No Orders Found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          )}

        </div>

      </div>

      {/* Pagination */}
      {totalPages > 1 && (

        <div className="d-flex justify-content-center mt-4 flex-wrap gap-2 order-history-pagination">

          <button
            className="btn btn-outline-primary order-history-page-btn"
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (

            <button
              key={index}
              className={`btn ${
                currentPage === index + 1
                  ? "btn-primary order-history-page-active"
                  : "btn-outline-primary order-history-page-btn"
              }`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>

          ))}

          <button
            className="btn btn-outline-primary order-history-page-btn"
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
          >
            Next
          </button>

        </div>

      )}

    </div>

  );
}

export default OrderHistory;