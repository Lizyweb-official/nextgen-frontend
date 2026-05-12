import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style-4.css';
import '../../../css/style.css';

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:5000/api/order";

function IncomingOrders(){
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [custsearch, setCustSearch] = useState("");

    useEffect(() => {
        getOrders();
    }, []);

    useEffect(() => {
        handleSearch(search);
    }, [search, orders]);

    const getOrders = async () => {
        try {
        setLoading(true);

        const response = await fetch(`${API}/getallorders`);
        const data = await response.json();

        // show only status_id 1 and 2
        const filtered = data.filter(
            (order) => order.status_id === 1 || order.status_id === 2
        );

        setOrders(filtered);

        setFilteredOrders(filtered);
        } catch (error) {
        console.log(error);
        } finally {
        setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearch(value);

        const filtered = orders.filter((order) => {
        return (
            order.name.toLowerCase().includes(value.toLowerCase()) ||
            order.id.toString().includes(value) ||
            order.status_name.toLowerCase().includes(value.toLowerCase())
        );
        });

        setFilteredOrders(filtered);
    };

    const handlecustSearch = (value) => {
        setCustSearch(value);

        const filtered = orders.filter((order) => {
        return (
            order.customer_id.toString().includes(value) 
        );
        });

        setFilteredOrders(filtered);
    };

    const updateStatus = async (order_id, status_id) => {
        try {
        const response = await fetch(`${API}/updateOrderStatus`, {
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
                        : "Ready To Dispatch",
                }
                : order
            )
        );


        } catch (error) {
        console.log(error);
        }
    };

    const deleteOrder = async (id) => {
        const confirmDelete = window.confirm(
        "Are you sure you want to delete this order?"
        );

        if (!confirmDelete) return;

        try {
        const response = await fetch(`${API}/deleteOrder/${id}`, {
            method: "DELETE",
        });

        const data = await response.json();

        alert(data.message);

        setOrders((prev) => prev.filter((order) => order.id !== id));
        } catch (error) {
        console.log(error);
        }
    };

    const formatTime = (time) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        });
    };

    // counts
    const preparingCount = orders.filter(
        (order) => order.status_id === 1
    ).length;

    const readyCount = orders.filter(
        (order) => order.status_id === 2
    ).length;

    if (loading) {
        return <h2 className="text-center mt-5">Loading Orders...</h2>;
    }

    

    return (
        <div className=" container mt-4">
        {/* top section */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <h2>Admin Orders</h2>

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
        <div className="mb-4">
            <input
            type="text"
            className="form-control"
            placeholder="Search by order id, customer name, status..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
        {/* customer search */}
        <div className="mb-4">
            <input
            type="text"
            className="form-control"
            placeholder="Search by customer id"
            value={custsearch}
            onChange={(e) => handlecustSearch(e.target.value)}
            />
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

                    <td>₹{order.total_amount}</td>

                    <td>
                        {formatTime(order.start_time)} -{" "}
                        {formatTime(order.end_time)}
                    </td>

                    <td>{formatTime(order.delivery_time)}</td>

                    <td>
                        <select
                        className="form-select"
                        value={order.status_id}
                        onChange={(e) =>
                            updateStatus(order.id, Number(e.target.value))
                        }
                        >
                        <option value={1}>Preparing</option>
                        <option value={2}>Ready To Dispatch</option>
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
                            onClick={() => deleteOrder(order.id)}
                        >
                            Delete
                        </button>
                        </div>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="8" className="text-center">
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

export default IncomingOrders