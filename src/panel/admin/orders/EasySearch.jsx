import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const STATUS_OPTIONS = [
  { id: 1, label: "Preparing" },
  { id: 2, label: "Ready to Dispatch" },
  { id: 3, label: "Out for Delivery" },
  { id: 4, label: "Delivered" },
  { id: 5, label: "Cancelled" },
];

const FILTER_BY_OPTIONS = [
  { value: "customer_id", label: "Customer ID" },
  { value: "phone_number", label: "Phone Number" },
  { value: "delivery_partner_id", label: "Delivery Partner ID" },
  { value: "order_id", label: "Order ID" },
];

function formatAddress(order) {
  return [order.street, order.city, order.district, order.state, order.pincode]
    .filter(Boolean)
    .join(", ");
}

function formatTime(t) {
  if (!t) return "-";
  return t.slice(0, 5);
}

function StatusBadge({ statusId }) {
  const colors = {
    1: { bg: "#FFF3CD", color: "#856404", label: "Preparing" },
    2: { bg: "#CCE5FF", color: "#004085", label: "Ready to Dispatch" },
    3: { bg: "#D4EDDA", color: "#155724", label: "Out for Delivery" },
    4: { bg: "#D1ECF1", color: "#0C5460", label: "Delivered" },
    5: { bg: "#F8D7DA", color: "#721C24", label: "Cancelled" },
  };
  const s = colors[statusId] || { bg: "#eee", color: "#333", label: "Unknown" };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "3px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

function StatusUpdateSelect({ orderId, currentStatusId, onUpdated }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const newStatusId = parseInt(e.target.value);
    if (newStatusId === currentStatusId) return;
    setLoading(true);
    try {
        console.log(orderId,newStatusId);
      const res = await fetch(`${API}/api/order/updateOrderStatus`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, status_id: newStatusId }),
      });
      if (res.ok) onUpdated(orderId, newStatusId);
    } catch (err) {
      console.error("Status update failed", err);
    }
    setLoading(false);
  };

  return (
    <select
      value={currentStatusId}
      onChange={handleChange}
      disabled={loading}
      style={{
        padding: "4px 8px",
        borderRadius: 6,
        border: "1px solid #ccc",
        fontSize: 12,
        cursor: "pointer",
        background: "#fff",
      }}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

export default function EasySearch() {
  const [filterBy, setFilterBy] = useState("customer_id");
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [phoneMap, setPhoneMap] = useState({});
  const [dpMap, setDpMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // Fetch all customer logins for phone number mapping
  const fetchPhoneMap = async () => {
    try {
      const res = await fetch(`${API}/api/customerlogins`);
      const data = await res.json();
      const map = {};
      data.forEach((c) => { map[c.id] = c.phone; });
      return map;
    } catch {
      return {};
    }
  };


  const loadAllOrders = async () => {
  setLoading(true);

  try {
    const phones = await fetchPhoneMap();
    setPhoneMap(phones);

    const res = await fetch(`${API}/api/order/getallorders`);
    let fetchedOrders = await res.json();

    if (!Array.isArray(fetchedOrders)) {
      fetchedOrders = [];
    }

    const filtered = applyClientFilters(fetchedOrders, phones);

    const dpIds = await enrichWithDp(filtered);

    setDpMap(dpIds);
    setOrders(filtered);
    setSearched(true);
  } catch (err) {
    console.error(err);
    setError("Failed to load orders");
  }

  setLoading(false);
};


useEffect(() => {
  loadAllOrders();
}, []);

  // Fetch dp_id for a single order
  const fetchDpId = async (orderId) => {
    try {
      const res = await fetch(`${API}/api/order/getdpbyorderid/${orderId}`);
      const data = await res.json();
      return data.success ? data.dp_id : null;
    } catch {
      return null;
    }
  };

  // Fetch dp ids for all orders in bulk
  const enrichWithDp = async (orderList) => {
    const map = {};
    await Promise.all(
      orderList.map(async (o) => {
        const dp = await fetchDpId(o.id);
        map[o.id] = dp;
      })
    );
    return map;
  };

  // Apply status and date filters on the client side
  const applyClientFilters = (orderList, phones) => {
    let result = [...orderList];

    if (selectedStatus !== "") {
      result = result.filter((o) => o.status_id === parseInt(selectedStatus));
    }

    if (startDate) {
      const sd = new Date(startDate);
      result = result.filter((o) => new Date(o.created_at) >= sd);
    }

    if (endDate) {
      const ed = new Date(endDate);
      ed.setHours(23, 59, 59, 999);
      result = result.filter((o) => new Date(o.created_at) <= ed);
    }

    return result;
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setOrders([]);
    setSearched(true);

    try {
      const phones = await fetchPhoneMap();
      setPhoneMap(phones);

      let fetchedOrders = [];

      const hasText = searchText.trim() !== "";
      const hasStatus = selectedStatus !== "";
      const hasDate = startDate !== "" || endDate !== "";

      // Determine fetch strategy
      if (!hasText && !hasStatus && !hasDate) {
  await loadAllOrders();
  return;
}

      if (hasText) {
        if (filterBy === "customer_id") {
          const res = await fetch(
            `${API}/api/order/getorderbycustomerid/${searchText.trim()}`
          );
          fetchedOrders = await res.json();
        } else if (filterBy === "phone_number") {
          const res = await fetch(`${API}/api/getidbyphonecustomer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: searchText.trim() }),
          });
          const idData = await res.json();
          console.log(idData);
          if (idData && idData.userId) {
            const res2 = await fetch(
              `${API}/api/order/getorderbycustomerid/${idData.userId}`
            );
            fetchedOrders = await res2.json();
          }
        } else if (filterBy === "delivery_partner_id") {
          const res = await fetch(
            `${API}/api/order/getorderbydp/${searchText.trim()}`
          );
          const dpOrders = await res.json();
          fetchedOrders = await Promise.all(
            dpOrders.map(async (d) => {
              const r = await fetch(`${API}/api/order/getorderbyid/${d.order_id}`);
              return r.json();
            })
          );
        } else if (filterBy === "order_id") {
          const res = await fetch(
            `${API}/api/order/getorderbyid/${searchText.trim()}`
          );
          const single = await res.json();
          fetchedOrders = single && single.id ? [single] : [];
        }
      } else {
        // No text filter, fetch all
        const res = await fetch(`${API}/api/order/getallorders`);
        fetchedOrders = await res.json();
      }

      // Ensure array
      if (!Array.isArray(fetchedOrders)) {
        fetchedOrders = fetchedOrders && fetchedOrders.id ? [fetchedOrders] : [];
      }

      const filtered = applyClientFilters(fetchedOrders, phones);
      const dpIds = await enrichWithDp(filtered);
      setDpMap(dpIds);
      setOrders(filtered);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setFilterBy("customer_id");
    setSearchText("");
    setSelectedStatus("");
    setStartDate("");
    setEndDate("");
    setOrders([]);
    setError("");
    setSearched(false);
    setPhoneMap({});
    setDpMap({});
  };

  const handleRefresh = () => {
    if (searched) handleSearch();
  };

  const handleStatusUpdated = (orderId, newStatusId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status_id: newStatusId } : o
      )
    );
  };

  const styles = {
     container: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "24px",
    background: "#F4F5F7",
    minHeight: "100vh",
    color: "#1A1D23",
  },
  header: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 20,
    color: "#1A1D23",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "18px 20px",
    border: "0.5px solid #E2E4E9",
    marginBottom: 18,
  },
  filterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    alignItems: "flex-end",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: 500,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },
  select: {
    padding: "8px 11px",
    border: "0.5px solid #D1D5DB",
    borderRadius: 8,
    fontSize: 13.5,
    background: "#fff",
    color: "#1A1D23",
    outline: "none",
    cursor: "pointer",
    minWidth: 155,
    transition: "border 0.15s, box-shadow 0.15s",
  },
  input: {
    padding: "8px 11px",
    border: "0.5px solid #D1D5DB",
    borderRadius: 8,
    fontSize: 13.5,
    background: "#fff",
    color: "#1A1D23",
    outline: "none",
    minWidth: 175,
    transition: "border 0.15s, box-shadow 0.15s",
  },
  dateInput: {
    padding: "8px 11px",
    border: "0.5px solid #D1D5DB",
    borderRadius: 8,
    fontSize: 13.5,
    background: "#fff",
    color: "#1A1D23",
    outline: "none",
    width: 145,
  },
  divider: {
    width: "0.5px",
    background: "#E2E4E9",
    alignSelf: "stretch",
    margin: "0 2px",
  },
  btnPrimary: {
    padding: "8px 18px",
    background: "var(--sub)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13.5,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "background 0.15s",
  },
  btnSecondary: {
    padding: "8px 14px",
    background: "#F4F5F7",
    color: "#bc1919",
    border: "0.5px solid #D1D5DB",
    borderRadius: 8,
    fontSize: 13.5,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "background 0.15s, color 0.15s",
  },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: 12,
    border: "0.5px solid #E2E4E9",
    background: "#fff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  },
  th: {
    padding: "11px 14px",
    textAlign: "left",
    fontWeight: 500,
    color: "#ffffff",
    background: "var(--sub)",
    borderBottom: "0.5px solid #E2E4E9",
    whiteSpace: "nowrap",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    width: "180px !important",
  },
  td: {
    padding: "11px 14px",
    borderBottom: "0.5px solid #F1F2F4",
    color: "#374151",
    verticalAlign: "middle",
    width: "180px !important",
  },
  viewBtn: {
    padding: "5px 12px",
    background: "var(--sub)",
    color: "white",
    border: "0.5px solid #C7D4FD",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    whiteSpace: "nowrap",
    transition: "background 0.15s",
  },
  emptyState: {
    textAlign: "center",
    padding: "52px 20px",
    color: "#9CA3AF",
  },
  errorMsg: {
    background: "#FFF0F0",
    color: "#C0392B",
    padding: "10px 14px",
    borderRadius: 8,
    marginBottom: 14,
    fontSize: 13,
    border: "0.5px solid #F5A5A5",
  },
  resultCount: {
    fontSize: 12.5,
    color: "#6B7280",
    marginBottom: 10,
    paddingLeft: 2,
  },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Order Search</div>

      <div style={styles.card}>
        <div style={styles.filterRow}>
          {/* Filter By + Search Text */}
          <div style={styles.filterGroup}>
            <span style={styles.label}>Filter By</span>
            <select
              style={styles.select}
              value={filterBy}
              onChange={(e) => { setFilterBy(e.target.value); setSearchText(""); }}
            >
              {FILTER_BY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.label}>Search Value</span>
            <input
              style={styles.input}
              placeholder={
                filterBy === "customer_id" ? "Enter Customer ID" :
                filterBy === "phone_number" ? "Enter Phone Number" :
                filterBy === "delivery_partner_id" ? "Enter Delivery Partner ID" :
                "Enter Order ID"
              }
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <div style={styles.divider} />

          {/* Status Filter */}
          <div style={styles.filterGroup}>
            <span style={styles.label}>Order Status</span>
            <select
              style={styles.select}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div style={styles.divider} />

          {/* Date Range */}
          <div style={styles.filterGroup}>
            <span style={styles.label}>Start Date</span>
            <input
              type="date"
              style={styles.dateInput}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.label}>End Date</span>
            <input
              type="date"
              style={styles.dateInput}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div style={styles.divider} />

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 8, alignSelf: "flex-end" }}>
            <button style={styles.btnPrimary} onClick={handleSearch} disabled={loading}>
              {loading ? "⏳ Searching..." : "🔍 Search"}
            </button>
            <button style={styles.btnSecondary} onClick={handleRefresh} disabled={loading}>
              🔄 Refresh
            </button>
            <button style={styles.btnSecondary} onClick={handleReset}>
              ✕ Reset
            </button>
          </div>
        </div>
      </div>

      {error && <div style={styles.errorMsg}>{error}</div>}

      {searched && !loading && (
        <div style={styles.resultCount}>
          {orders.length === 0
            ? "No orders found."
            : `Showing ${orders.length} order${orders.length > 1 ? "s" : ""}`}
        </div>
      )}

      {orders.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {[
                  "Order ID", "Customer ID", "Order Time", "Phone (Login)",
                  "Name", "Address", "Contact No.", "Slot Time",
                  "Delivery Time", "Order Status", "Payment Status",
                  "Delivery Partner", "Total Amount", "Action"
                ].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  <td style={{ ...styles.td, fontWeight: 600, color: "#2563EB" }}>#{order.id}</td>
                  <td style={styles.td}>{order.customer_id}</td>
                  <td style={{ ...styles.td, whiteSpace: "nowrap", fontSize: 12 }}>
                    {order.created_at ? order.created_at.replace("T", " ").slice(0, 16) : "-"}
                  </td>
                  <td style={styles.td}>{phoneMap[order.customer_id] || "-"}</td>
                  <td style={styles.td}>{order.name || "-"}</td>
                  <td style={{ ...styles.td, fontSize: 12 }}>{formatAddress(order) || "-"}</td>
                  <td style={styles.td}>{order.contact_number || "-"}</td>
                  <td style={{ ...styles.td, whiteSpace: "nowrap", fontSize: 12 }}>
                    {formatTime(order.start_time)} – {formatTime(order.end_time)}
                  </td>
                  <td style={{ ...styles.td, whiteSpace: "nowrap", fontSize: 12 }}>
                    {formatTime(order.delivery_time)}
                  </td>
                  <td style={styles.td}>
                    <StatusUpdateSelect
                      orderId={order.id}
                      currentStatusId={order.status_id}
                      onUpdated={handleStatusUpdated}
                    />
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      padding: "3px 10px",
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600,
                      background: order.payment_status === "paid" ? "#D1FAE5" : "#FEF3C7",
                      color: order.payment_status === "paid" ? "#065F46" : "#92400E",
                    }}>
                      {order.payment_status ? order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) : "-"}
                    </span>
                  </td>
                  <td style={styles.td}>{dpMap[order.id] ?? "-"}</td>
                  <td style={{ ...styles.td, fontWeight: 600 }}>
                    ₹{parseFloat(order.total_amount || 0).toFixed(2)}
                  </td>
                  <td style={styles.td}>
                    <Link to={`/orderdetailpage/${order.id}`} style={styles.viewBtn}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {searched && !loading && orders.length === 0 && !error && (
        <div style={styles.emptyState}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>No orders found</div>
          <div style={{ fontSize: 14 }}>Try adjusting your filters or search criteria.</div>
        </div>
      )}
    </div>
  );
}