import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style-4.css';
import '../../../css/style.css';

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:5000";

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
      const response = await fetch(`${API}/api/order/getallorders`);
      const data = await response.json();
      const filtered = data.filter(
        (order) => order.status_id === 4 || order.status_id === 5
      );
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(filtered);
      setFilteredOrders(filtered);
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
    <div className="container-fluid py-4">

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3 className="mb-0">Cancelled / Delivered Orders</h3>
        <button className="btn btn-primary" onClick={fetchOrders}>Refresh</button>
      </div>

      {/* Filters */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">

            {/* Search with field selector */}
            <div className="col-md-4">
              <label className="form-label">Search</label>
              <div className="input-group">
                <select
                  className="form-select flex-grow-0 w-auto"
                  value={searchBy}
                  onChange={(e) => { setSearchBy(e.target.value); setSearch(""); }}
                >
                  <option value="order_id">Order ID</option>
                  <option value="customer_id">Customer ID</option>
                  <option value="status">Status</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  placeholder={
                    searchBy === "order_id" ? "Search by Order ID" :
                    searchBy === "customer_id" ? "Search by Customer ID" :
                    "Search by Status"
                  }
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="col-md-2">
              <label className="form-label">Status Filter</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="4">Delivered</option>
                <option value="5">Cancelled</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="col-md-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="col-md-3">
                <button className="btn btn-secondary" onClick={resetFilters}>
                    Reset Filters
                </button>
            </div>

          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body table-responsive">
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : (
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Customer ID</th>
                  <th>Time Of Order Placed</th>
                  <th>Status Name</th>
                  <th>Order Details</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customer_id}</td>
                      <td>{new Date(order.created_at).toLocaleString()}</td>
                      <td>{order.status_name}</td>
                      <td>
                        <Link
                          to={`/orderdetailpage/${order.id}`}
                          className="btn btn-sm btn-primary"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No Orders Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4 flex-wrap gap-2">
          <button
            className="btn btn-outline-primary"
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`btn ${currentPage === index + 1 ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="btn btn-outline-primary"
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