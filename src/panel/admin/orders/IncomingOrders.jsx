import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style-4.css';
import '../../../css/style.css';

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { showWebMessage } from "../../../context/webMessageHandler";

const API = import.meta.env.VITE_API_URL;

const PAYMENT_STATUS_OPTIONS = [
    { value: "all", label: "All Status" },
    { value: "paid", label: "Paid" },
    { value: "failed", label: "Failed" },
];

function IncomingOrders() {

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [custsearch, setCustSearch] = useState("");
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("paid");

    // bulk update
    const [selectedSlot, setSelectedSlot] = useState("");

    // bulk update via checkbox selection
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [selectedBulkStatus, setSelectedBulkStatus] = useState("");

    // vehicle options for the selected orders' combined weight — same live
    // Lalamove catalogue used on OrderDetailsPage (GET /api/lalamove/vehicle-services)
    const [vehicleOptions, setVehicleOptions] = useState([]);
    const [vehicleOptionsLoading, setVehicleOptionsLoading] = useState(false);
    const [vehicleOptionsError, setVehicleOptionsError] = useState("");

    // batch "Assign to Lalamove" for checkbox-selected orders — one
    // multi-stop courier for all of them, sized to their combined weight
    const [assigningSelectedToLalamove, setAssigningSelectedToLalamove] = useState(false);

    useEffect(() => {
        getOrders();
        fetchVehicleOptions();
    }, []);

    // Status can change on its own in the background — the Lalamove status
    // poller moving an order to Out For Delivery/Delivered — so this page
    // left open must pick that up without a manual reload. Silent (no
    // loading flicker) so it doesn't disturb whatever the admin is doing.
    useEffect(() => {
        const interval = setInterval(() => getOrders(true), 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        filterOrders();
    }, [search, custsearch, selectedSlot, selectedPaymentStatus, orders]);

    const getOrders = async (silent = false) => {
        try {

            if (!silent) setLoading(true);

            const response = await fetch(`${API}/api/order/getallorders`);
            const data = await response.json();

            // Stay visible through the whole active lifecycle — Preparing,
            // Ready To Dispatch, and Out For Delivery — and drop off only
            // once actually Delivered (or Cancelled). Previously this
            // stopped at Ready To Dispatch, so an order vanished from
            // Incoming Orders the moment it moved to Out For Delivery,
            // well before it was actually delivered.
            const filtered = data.filter(
                (order) =>
                    order.status_id === 1 ||
                    order.status_id === 2 ||
                    order.status_id === 3
            );

            setOrders(filtered);
            setFilteredOrders(filtered);

        } catch (error) {
            console.log(error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    // live Lalamove vehicle/service catalogue — same endpoint OrderDetailsPage
    // uses, nothing about vehicle names/capacities is hard-coded here.
    const fetchVehicleOptions = async () => {
        try {
            setVehicleOptionsLoading(true);
            setVehicleOptionsError("");
            const res = await fetch(`${API}/api/lalamove/vehicle-services`);
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch vehicle options");
            }
            setVehicleOptions(Array.isArray(data.data) ? data.data : []);
        } catch (error) {
            console.log(error);
            setVehicleOptionsError(error.message || "Failed to fetch vehicle options");
        } finally {
            setVehicleOptionsLoading(false);
        }
    };

    // Lalamove's `load` field varies by response shape — GET /v3/cities
    // returns it as { value: "250", unit: "kg" } — so pull the numeric kg
    // value out of whatever Lalamove sends (object, number, or a free-text
    // string like "130kg") rather than assuming one fixed format.
    const parseLoadKg = (load) => {
        if (load == null) return null;
        if (typeof load === "number") return load;
        if (typeof load === "object") return parseLoadKg(load.value);
        const match = String(load).match(/[\d.]+/);
        return match ? parseFloat(match[0]) : null;
    };

    const formatLoadKg = (load) => {
        const kg = parseLoadKg(load);
        return kg == null ? null : `${kg} kg`;
    };

    // Colors the per-row status dropdown by its current value, so the table
    // reads at a glance instead of every row's select looking identical.
    const STATUS_COLORS = {
        1: { bg: "#FFF3CD", color: "#856404" }, // Preparing
        2: { bg: "#CCE5FF", color: "#004085" }, // Ready To Dispatch
        3: { bg: "#D4EDDA", color: "#155724" }, // Out For Delivery
        4: { bg: "#D1ECF1", color: "#0C5460" }, // Delivered
        5: { bg: "#F8D7DA", color: "#721C24" }, // Cancelled
    };

    // format time
    const formatTime = (time) => {

        if (!time) return "-";

        return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // slot label
    const getSlotLabel = (order) => {

        const date = new Date(order.created_at).toLocaleDateString();

        return `${date} | ${formatTime(order.start_time)} - ${formatTime(order.end_time)}`;
    };

    // unique slot options
    const slotOptions = useMemo(() => {

        const uniqueSlots = [];

        orders.forEach((order) => {

            const label = getSlotLabel(order);

            if (!uniqueSlots.includes(label)) {
                uniqueSlots.push(label);
            }
        });

        return uniqueSlots;

    }, [orders]);

    // filter orders
    const filterOrders = () => {

        let filtered = [...orders];

        // search
        if (search) {

            filtered = filtered.filter((order) =>
                order.name?.toLowerCase().includes(search.toLowerCase()) ||
                order.id?.toString().includes(search) ||
                order.status_name?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // customer search
        if (custsearch) {

            filtered = filtered.filter((order) =>
                order.customer_id?.toString().includes(custsearch)
            );
        }

        // slot filter
        if (selectedSlot) {

            filtered = filtered.filter(
                (order) => getSlotLabel(order) === selectedSlot
            );
        }

        // payment status filter
        if (selectedPaymentStatus !== "all") {

            filtered = filtered.filter(
                (order) => order.payment_status === selectedPaymentStatus
            );
        }

        setFilteredOrders(filtered);
    };

    // single status update
    const updateStatus = async (order_id, status_id) => {

        try {

            const response = await fetch(`${API}/api/order/updateOrderStatus`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    order_id,
                    status_id,
                }),
            });

            const data = await response.json();

            showWebMessage(data.message);

            // Delivered/Cancelled no longer belong on this page at all —
            // drop the row immediately instead of leaving it in the list
            // with an updated status_name until the next 30s poll happens
            // to refetch and correct it.
            setOrders((prev) =>
                [1, 2, 3].includes(status_id)
                    ? prev.map((order) =>
                        order.id === order_id
                            ? {
                                ...order,
                                status_id,
                                status_name:
                                    status_id === 1
                                        ? "Preparing"
                                        : status_id === 2
                                        ? "Ready To Dispatch"
                                        : "Out For Delivery",
                            }
                            : order
                    )
                    : prev.filter((order) => order.id !== order_id)
            );

        } catch (error) {
            console.log(error);
        }
    };

    // checkbox selection
    const toggleOrderSelection = (orderId) => {

        setSelectedOrderIds((prev) =>
            prev.includes(orderId)
                ? prev.filter((id) => id !== orderId)
                : [...prev, orderId]
        );
    };

    const selectableOrderIds = filteredOrders
        .filter((order) => order.payment_status !== "failed")
        .map((order) => order.id);

    const isAllSelected =
        selectableOrderIds.length > 0 &&
        selectableOrderIds.every((id) => selectedOrderIds.includes(id));

    const toggleSelectAll = () => {

        if (isAllSelected) {
            setSelectedOrderIds([]);
        } else {
            setSelectedOrderIds(selectableOrderIds);
        }
    };

    // Combined weight of every checked order — order.items comes straight
    // from getAllOrders (order_items rows), and item.quantity is the kg
    // amount per line (same source OrderDetailsPage sums per-order).
    const selectedOrders = orders.filter((order) =>
        selectedOrderIds.includes(order.id)
    );

    const selectedOrdersTotalWeightKg = selectedOrders.reduce(
        (sum, order) =>
            sum +
            (order.items || []).reduce(
                (itemSum, item) => itemSum + (Number(item.quantity) || 0),
                0
            ),
        0
    );

    // Only vehicles whose stated capacity can actually carry the combined
    // weight of the selected orders; an option with no parseable capacity is
    // left in rather than silently hidden.
    const eligibleVehicleOptionsForSelected = vehicleOptions.filter((v) => {
        const capacityKg = parseLoadKg(v.load);
        return capacityKg == null || capacityKg >= selectedOrdersTotalWeightKg;
    });

    // bulk update for checkbox-selected orders
    const applyBulkStatusToSelected = async () => {

        if (selectedOrderIds.length === 0) {
            showWebMessage("Please select at least one order");
            return;
        }

        if (!selectedBulkStatus) {
            showWebMessage("Please select a status");
            return;
        }

        try {

            await Promise.all(
                selectedOrderIds.map((orderId) =>
                    fetch(`${API}/api/order/updateOrderStatus`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            order_id: orderId,
                            status_id: Number(selectedBulkStatus),
                        }),
                    })
                )
            );

            showWebMessage("Selected orders updated successfully");

            setSelectedOrderIds([]);
            setSelectedBulkStatus("");

            await getOrders();

        } catch (error) {
            console.log(error);
        }
    };

    // batch-assign checkbox-selected orders to Lalamove as ONE multi-stop
    // trip — one pickup, one dropoff per selected order, vehicle sized to
    // their combined weight (not each order's own weight).
    const assignSelectedToLalamove = async () => {

        if (selectedOrderIds.length === 0) {
            showWebMessage("Please select at least one order");
            return;
        }

        const confirmAssign = window.confirm(
            `Assign ${selectedOrderIds.length} selected order(s) to Lalamove as one delivery trip? This books a real courier.`
        );
        if (!confirmAssign) return;

        try {

            setAssigningSelectedToLalamove(true);

            const res = await fetch(`${API}/api/lalamove/assign-orders-batch`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    order_ids: selectedOrderIds,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to assign selected orders to Lalamove");
            }

            showWebMessage(
                `Assigned ${selectedOrderIds.length} order(s) to Lalamove (${data.data.serviceType}, ${data.data.totalWeightKg} kg)`
            );

            setSelectedOrderIds([]);

            await getOrders();

        } catch (error) {
            console.log(error);
            showWebMessage(error.message || "Failed to assign selected orders to Lalamove");
        } finally {
            setAssigningSelectedToLalamove(false);
        }
    };

    // reset
    const resetFilters = () => {

        setSearch("");
        setCustSearch("");
        setSelectedSlot("");
        setSelectedPaymentStatus("paid");
        setSelectedOrderIds([]);
        setSelectedBulkStatus("");

        setFilteredOrders(orders);
    };

    // delete
    const deleteOrder = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this order?"
        );

        if (!confirmDelete) return;

        try {

            const response = await fetch(
                `${API}/api/order/deleteOrder/${id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            showWebMessage(data.message);

            setOrders((prev) =>
                prev.filter((order) => order.id !== id)
            );

        } catch (error) {
            console.log(error);
        }
    };

    // counts
    const preparingCount = orders.filter(
        (order) => order.status_id === 1
    ).length;

    const readyCount = orders.filter(
        (order) => order.status_id === 2
    ).length;

    if (loading) {
        return (
            <h2 className="text-center mt-5">
                Loading Orders...
            </h2>
        );
    }

     return (

        <div className="incoming-orders-page container mt-4">

            {/* top */}
            <div className="incoming-orders-top d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <div className="incoming-orders-top-heading">

                    <h2 className="incoming-orders-title">
                        Incoming Orders
                    </h2>

                    <p className="incoming-orders-subtitle">
                        {filteredOrders.length} order{filteredOrders.length === 1 ? "" : "s"} in the active queue
                    </p>

                </div>

                <button
                    className="incoming-orders-refresh-btn btn btn-success"
                    onClick={getOrders}
                >
                    <span className="incoming-orders-refresh-icon" aria-hidden="true">↻</span>
                    Refresh Orders
                </button>

            </div>

            {/* counts */}
            <div className="incoming-orders-stats mb-4">

                <div className="incoming-orders-stat incoming-orders-stat-preparing">
                    <span className="incoming-orders-stat-dot" aria-hidden="true"></span>
                    <span className="incoming-orders-stat-label">Preparing</span>
                    <span className="incoming-orders-stat-count">{preparingCount}</span>
                </div>

                <div className="incoming-orders-stat incoming-orders-stat-ready">
                    <span className="incoming-orders-stat-dot" aria-hidden="true"></span>
                    <span className="incoming-orders-stat-label">Ready To Dispatch</span>
                    <span className="incoming-orders-stat-count">{readyCount}</span>
                </div>

            </div>

            {/* toolbar: search + slot filter, one unified bar */}
            <div className="incoming-orders-toolbar card shadow-sm border-0 mb-4">

                <div className="card-body" >

                    <div className="incoming-orders-toolbar-row">

                        <input
                            type="text"
                            className="incoming-orders-search-input form-control"
                            placeholder="Search by order id, customer name, status..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <input
                            type="text"
                            className="incoming-orders-customer-search-input form-control"
                            placeholder="Search by customer id"
                            value={custsearch}
                            onChange={(e) => setCustSearch(e.target.value)}
                        />

                        <select
                            className="incoming-orders-payment-status-filter form-select"
                            value={selectedPaymentStatus}
                            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                        >
                            {PAYMENT_STATUS_OPTIONS.map((p) => (
                                <option key={p.value} value={p.value}>
                                    {p.label}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="incoming-orders-toolbar-divider"></div>

                    <div className="incoming-orders-toolbar-row incoming-orders-toolbar-row-slot">

                        <span className="incoming-orders-toolbar-label">
                            Bulk update by slot
                        </span>

                        <select
                            className="incoming-orders-slot-select form-select"
                            value={selectedSlot}
                            onChange={(e) =>
                                setSelectedSlot(e.target.value)
                            }
                        >

                            <option value="">
                                Select Slot & Date
                            </option>

                            {slotOptions.map((slot, index) => (

                                <option
                                    key={index}
                                    value={slot}
                                >
                                    {slot}
                                </option>

                            ))}

                        </select>

                        <button
                            className="incoming-orders-reset-btn btn btn-secondary"
                            onClick={resetFilters}
                        >
                            Reset
                        </button>

                    </div>

                </div>

            </div>

            {/* bulk update section for checkbox-selected orders — collapsed to
                a slim hint until something's actually selected, so it doesn't
                take up a big empty-looking card for the common case */}
            <div
                className={`incoming-orders-selection-bar card shadow-sm border-0 mb-4${
                    selectedOrderIds.length > 0 ? " is-active" : ""
                }`}
            >

                <div className="card-body">

                    {selectedOrderIds.length === 0 ? (

                        <div className="incoming-orders-selection-hint">
                            <span className="incoming-orders-selection-hint-icon" aria-hidden="true">☑</span>
                            Select orders using the checkboxes below to update their status in bulk or assign them to Lalamove together.
                        </div>

                    ) : (

                        <>

                            <div className="incoming-orders-selection-header">

                                <h5 className="incoming-orders-bulk-selected-title">
                                    {selectedOrderIds.length} order{selectedOrderIds.length === 1 ? "" : "s"} selected
                                    <span className="incoming-orders-selection-weight">
                                        · {selectedOrdersTotalWeightKg} kg total
                                    </span>
                                </h5>

                                <button
                                    className="incoming-orders-selected-clear-btn btn btn-link"
                                    onClick={() => setSelectedOrderIds([])}
                                >
                                    Clear selection
                                </button>

                            </div>

                            <div className="incoming-orders-selection-vehicles">

                                {vehicleOptionsLoading && (
                                    <span className="text-muted" style={{ fontSize: 12.5 }}>
                                        Loading vehicle options...
                                    </span>
                                )}

                                {!vehicleOptionsLoading && vehicleOptionsError && (
                                    <span className="text-danger" style={{ fontSize: 12.5 }}>
                                        {vehicleOptionsError}
                                    </span>
                                )}

                                {!vehicleOptionsLoading && !vehicleOptionsError && vehicleOptions.length > 0 && (
                                    <>
                                        {/* <div className="d-flex flex-wrap gap-3">
                                            {eligibleVehicleOptionsForSelected.map((v) => (
                                                <span
                                                    key={v.key}
                                                    className="text-body"
                                                    style={{ fontSize: 12.5 }}
                                                    title={v.description || "" }
                                                >
                                                    {v.key}
                                                    {formatLoadKg(v.load) ? ` — up to ${formatLoadKg(v.load)}` : ""}
                                                </span>
                                            ))}
                                        </div> */}

                                        {eligibleVehicleOptionsForSelected.length === 0 && (
                                            <span className="text-danger" style={{ fontSize: 12.5 }}>
                                                No vehicle option has enough capacity for the selected orders' combined weight.
                                            </span>
                                        )}
                                    </>
                                )}

                            </div>

                            <div className="incoming-orders-selection-actions">

                                <select
                                    className="incoming-orders-selected-status-select form-select"
                                    value={selectedBulkStatus}
                                    onChange={(e) =>
                                        setSelectedBulkStatus(e.target.value)
                                    }
                                >

                                    <option value="">
                                        Select Status
                                    </option>

                                    <option value="1">
                                        Preparing
                                    </option>

                                    <option value="2">
                                        Ready To Dispatch
                                    </option>

                                    <option value="5">
                                        Cancel
                                    </option>

                                </select>

                                <button
                                    className="incoming-orders-selected-apply-btn btn btn-primary"
                                    onClick={applyBulkStatusToSelected}
                                >
                                    Update Selected
                                </button>

                                <button
                                    className="incoming-orders-assign-lalamove-btn btn btn-success"
                                    onClick={assignSelectedToLalamove}
                                    disabled={assigningSelectedToLalamove}
                                >
                                    {assigningSelectedToLalamove
                                        ? "Assigning to Lalamove..."
                                        : "Assign Selected to Lalamove"}
                                </button>

                            </div>

                        </>

                    )}

                </div>

            </div>

            {/* table */}
            <div className="incoming-orders-table-wrapper">

                <table className="incoming-orders-table table table-bordered table-striped align-middle">

                    <thead className="incoming-orders-table-head table-dark">

                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    className="incoming-orders-select-all-checkbox"
                                    checked={isAllSelected}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th>Order ID</th>
                            <th>Customer ID</th>
                            <th>Customer Name</th>
                            <th>Order Time</th>
                            <th>Total Amount</th>
                            <th>Slot Time</th>
                            <th>Delivery Time</th>
                            <th>Status</th>
                            <th>Payment Status</th>
                            <th>Invoice Number</th>
                            <th width="220">Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {filteredOrders.length > 0 ? (

                            filteredOrders.map((order) => (

                                <tr
                                    key={order.id}
                                    className="incoming-orders-table-row"
                                >

                                    <td className="incoming-orders-select-column">
                                        <input
                                            type="checkbox"
                                            className="incoming-orders-row-checkbox"
                                            checked={selectedOrderIds.includes(order.id)}
                                            disabled={order.payment_status === "failed"}
                                            title={
                                                order.payment_status === "failed"
                                                    ? "Order status cannot be changed while payment has failed"
                                                    : undefined
                                            }
                                            onChange={() =>
                                                toggleOrderSelection(order.id)
                                            }
                                        />
                                    </td>

                                    <td className="incoming-orders-order-id">
                                        #{order.id}
                                    </td>

                                    <td className="incoming-orders-customer-id">
                                        #{order.customer_id}
                                    </td>

                                    <td className="incoming-orders-customer-name">
                                        {order.name}
                                    </td>

                                    <td className="incoming-orders-order-time">
                                        {new Date(order.created_at).toLocaleString()}
                                    </td>

                                    <td className="incoming-orders-total-amount">
                                        RM {order.total_amount}
                                    </td>

                                    <td className="incoming-orders-slot-time">
                                        {formatTime(order.start_time)} -{" "}
                                        {formatTime(order.end_time)}
                                    </td>

                                    <td className="incoming-orders-delivery-time">
                                        {formatTime(order.delivery_time)+" | "+order.delivery_date}
                                    </td>

                                    <td className="incoming-orders-status-column">

                                        <select
                                            className="incoming-orders-status-dropdown form-select"
                                            value={order.status_id}
                                            disabled={order.payment_status === "failed"}
                                            title={
                                                order.payment_status === "failed"
                                                    ? "Order status cannot be changed while payment has failed"
                                                    : undefined
                                            }
                                            style={{
                                                background: STATUS_COLORS[order.status_id]?.bg,
                                                color: STATUS_COLORS[order.status_id]?.color,
                                                borderColor: STATUS_COLORS[order.status_id]?.color,
                                            }}
                                            onChange={(e) =>
                                                updateStatus(
                                                    order.id,
                                                    Number(e.target.value)
                                                )
                                            }
                                        >

                                            <option value={1}>
                                                Preparing
                                            </option>

                                            <option value={2}>
                                                Ready To Dispatch
                                            </option>

                                            <option value={3}>
                                                Out For Delivery
                                            </option>

                                            <option value={4}>
                                                Delivered
                                            </option>

                                            <option value={5}>
                                                Cancel
                                            </option>

                                        </select>

                                    </td>

                                    <td className="incoming-orders-payment-status-column">

                                        <span
                                            className="incoming-orders-payment-status-badge"
                                            style={{
                                                padding: "3px 10px",
                                                borderRadius: 12,
                                                fontSize: 12,
                                                fontWeight: 600,
                                                display: "inline-block",
                                                whiteSpace: "nowrap",
                                                background:
                                                    order.payment_status === "paid"
                                                        ? "#D1FAE5"
                                                        : order.payment_status === "failed"
                                                        ? "#FEE2E2"
                                                        : "#FEF3C7",
                                                color:
                                                    order.payment_status === "paid"
                                                        ? "#065F46"
                                                        : order.payment_status === "failed"
                                                        ? "#991B1B"
                                                        : "#92400E",
                                            }}
                                        >
                                            {order.payment_status
                                                ? order.payment_status.charAt(0).toUpperCase() +
                                                  order.payment_status.slice(1)
                                                : "-"}
                                        </span>

                                    </td>

                                    <td className="incoming-orders-invoice-number-column">
                                        {order.payment_status === "paid"
                                            ? order.invoice_number || "-"
                                            : "-"}
                                    </td>

                                    <td className="incoming-orders-actions">

                                        <div className="incoming-orders-action-buttons d-flex gap-2">

                                            <Link
                                                to={`/Orderdetailpage/${order.id}`}
                                                className="incoming-orders-view-btn btn btn-primary btn-sm"
                                            >
                                                View Details
                                            </Link>

                                            <button
                                                className="incoming-orders-delete-btn btn btn-danger btn-sm"
                                                onClick={() =>
                                                    deleteOrder(order.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="12"
                                    className="incoming-orders-no-data text-center"
                                >
                                    No Orders Found
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default IncomingOrders;