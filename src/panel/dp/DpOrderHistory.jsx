import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style-4.css';
import '../../css/style.css';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API = "http://localhost:5000";

function DpOrderHistory() {

    const { user } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    const fetchOrders = async () => {

        try {

            setLoading(true);

            // get dp orders
            const dpResponse = await fetch(
                `${API}/api/order/getorderbydp/${user.id}`
            );

            const dpData = await dpResponse.json();

            if (!Array.isArray(dpData) || dpData.length === 0) {
                setOrders([]);
                setLoading(false);
                return;
            }

            // get full order details using order_id
            const orderRequests = dpData.map(async (item) => {

                const res = await fetch(
                    `${API}/api/order/getorderbyid/${item.order_id}`
                );

                return await res.json();
            });

            const orderResults = await Promise.all(orderRequests);

            // filter only status_id 4 and 5
            const filteredOrders = orderResults.filter(
                (order) =>
                    order &&
                    (order.status_id === 4 || order.status_id === 5)
            );

            // latest orders first
            filteredOrders.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );

            setOrders(filteredOrders);

        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (user?.id) {
            fetchOrders();
        }

    }, [user]);

    // pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

    const currentOrders = orders.slice(
        indexOfFirstOrder,
        indexOfLastOrder
    );

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    return (
        <>

            <div className="container-fluid mt-4">

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="mb-0">Order History</h3>

                    <button
                        className="btn btn-primary"
                        onClick={fetchOrders}
                    >
                        Refresh
                    </button>
                </div>

                <div className="card shadow-sm">
                    <div className="card-body">

                        {loading ? (
                            <div className="text-center py-5">
                                <h5>Loading...</h5>
                            </div>
                        ) : currentOrders.length === 0 ? (
                            <div className="text-center py-5">
                                <h5>No Orders Found</h5>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-hover align-middle">

                                        <thead className="table-dark">
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Order Placed Time</th>
                                                <th>Order Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {currentOrders.map((order) => (

                                                <tr key={order.id}>

                                                    <td>
                                                        #{order.id}
                                                    </td>

                                                    <td>
                                                        {new Date(order.created_at).toLocaleString()}
                                                    </td>

                                                    <td>
                                                        <span className="">
                                                            {order.status_name}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <Link
                                                            to={`/Orderdetailpage/${order.id}`}
                                                            className="btn btn-sm btn-primary"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>

                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="d-flex justify-content-center align-items-center mt-3 gap-2">

                                    <button
                                        className="btn btn-secondary"
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage(currentPage - 1)
                                        }
                                    >
                                        Previous
                                    </button>

                                    <span>
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        className="btn btn-secondary"
                                        disabled={currentPage === totalPages}
                                        onClick={() =>
                                            setCurrentPage(currentPage + 1)
                                        }
                                    >
                                        Next
                                    </button>

                                </div>
                            </>
                        )}

                    </div>
                </div>

            </div>

        </>
    );
}

export default DpOrderHistory;