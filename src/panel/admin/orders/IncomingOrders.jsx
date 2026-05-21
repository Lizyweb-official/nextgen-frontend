import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style-4.css';
import '../../../css/style.css';

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function IncomingOrders() {

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [custsearch, setCustSearch] = useState("");

    // bulk update
    const [selectedSlot, setSelectedSlot] = useState("");
    const [bulkStatus, setBulkStatus] = useState("");

    useEffect(() => {
        getOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [search, custsearch, selectedSlot, orders]);

    const getOrders = async () => {
        try {

            setLoading(true);

            const response = await fetch(`${API}/api/order/getallorders`);
            const data = await response.json();

            // only preparing + ready to dispatch
            const filtered = data.filter(
                (order) =>
                    order.status_id === 1 ||
                    order.status_id === 2
            );

            setOrders(filtered);
            setFilteredOrders(filtered);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
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

            alert(data.message);

            setOrders((prev) =>
                prev.map((order) =>
                    order.id === order_id
                        ? {
                            ...order,
                            status_id,
                            status_name:
                                status_id === 1
                                    ? "Preparing"
                                    : status_id === 2
                                    ? "Ready To Dispatch"
                                    : "Cancelled",
                        }
                        : order
                )
            );

        } catch (error) {
            console.log(error);
        }
    };

    // bulk update
    const applyBulkStatus = async () => {

        if (!selectedSlot) {
            alert("Please select a slot");
            return;
        }

        if (!bulkStatus) {
            alert("Please select a status");
            return;
        }

        const selectedOrders = orders.filter(
            (order) => getSlotLabel(order) === selectedSlot
        );

        if (selectedOrders.length === 0) {
            alert("No orders found");
            return;
        }

        try {

            await Promise.all(

                selectedOrders.map((order) =>

                    fetch(`${API}/api/order/updateOrderStatus`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            order_id: order.id,
                            status_id: Number(bulkStatus),
                        }),
                    })

                )
            );

            alert("Bulk status updated successfully");

            // refresh orders
            await getOrders();

            setOrders((prev) =>
                prev.map((order) =>
                    getSlotLabel(order) === selectedSlot
                        ? {
                            ...order,
                            status_id: Number(bulkStatus),
                            status_name:
                                Number(bulkStatus) === 1
                                    ? "Preparing"
                                    : Number(bulkStatus) === 2
                                    ? "Ready To Dispatch"
                                    : Number(bulkStatus) === 5
                                    ? "Cancelled"
                                    : "",
                        }
                        : order
                )
            );

        } catch (error) {
            console.log(error);
        }
    };

    // reset
    const resetFilters = () => {

        setSearch("");
        setCustSearch("");
        setSelectedSlot("");
        setBulkStatus("");

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

            alert(data.message);

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
        <div className="container mt-4">

            {/* top */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <h2>Incoming Orders</h2>

                <button
                    className="btn btn-success"
                    onClick={getOrders}
                >
                    Refresh Orders
                </button>

            </div>

            {/* counts */}
            <div className="row mb-4">

                <div className="col-md-6 mb-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5>Preparing Orders</h5>
                            <h2>{preparingCount}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5>Ready To Dispatch</h5>
                            <h2>{readyCount}</h2>
                        </div>
                    </div>
                </div>

            </div>

            {/* search */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by order id, customer name, status..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* customer search */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by customer id"
                    value={custsearch}
                    onChange={(e) => setCustSearch(e.target.value)}
                />
            </div>

            {/* bulk update section */}
            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h5 className="mb-3">
                        Bulk Update Orders By Slot
                    </h5>

                    <div className="row g-3">

                        {/* slot */}
                        <div className="col-md-5">

                            <select
                                className="form-select"
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

                        </div>

                        {/* status */}
                        <div className="col-md-3">

                            <select
                                className="form-select"
                                value={bulkStatus}
                                onChange={(e) =>
                                    setBulkStatus(e.target.value)
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

                        </div>

                        {/* buttons */}
                        <div className="col-md-4 d-flex gap-2">

                            <button
                                className="btn btn-primary w-100"
                                onClick={applyBulkStatus}
                            >
                                Apply
                            </button>

                            <button
                                className="btn btn-secondary w-100"
                                onClick={resetFilters}
                            >
                                Reset
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            {/* table */}
            <div className="table-responsive">

                <table className="table table-bordered table-striped align-middle">

                    <thead className="table-dark">

                        <tr>
                            <th>Order ID</th>
                            <th>Customer ID</th>
                            <th>Customer Name</th>
                            <th>Order Time</th>
                            <th>Total Amount</th>
                            <th>Slot Time</th>
                            <th>Delivery Time</th>
                            <th>Status</th>
                            <th width="220">Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {filteredOrders.length > 0 ? (

                            filteredOrders.map((order) => (

                                <tr key={order.id}>

                                    <td>#{order.id}</td>

                                    <td>#{order.customer_id}</td>

                                    <td>{order.name}</td>

                                    <td>
                                        {new Date(order.created_at).toLocaleString()}
                                    </td>

                                    <td>
                                        ₹{order.total_amount}
                                    </td>

                                    <td>
                                        {formatTime(order.start_time)} -{" "}
                                        {formatTime(order.end_time)}
                                    </td>

                                    <td>
                                        {formatTime(order.delivery_time)}
                                    </td>

                                    <td>

                                        <select
                                            className="form-select"
                                            value={order.status_id}
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

                                            <option value={5}>
                                                Cancel
                                            </option>

                                        </select>

                                    </td>

                                    <td>

                                        <div className="d-flex gap-2">

                                            <Link
                                                to={`/Orderdetailpage/${order.id}`}
                                                className="btn btn-primary btn-sm"
                                            >
                                                View Details
                                            </Link>

                                            <button
                                                className="btn btn-danger btn-sm"
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
                                    colSpan="9"
                                    className="text-center"
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