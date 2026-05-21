import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style-4.css';
import '../../css/style.css';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

function CustomerOrderHistory() {
    
    const { user } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const ordersPerPage = 10;

    useEffect(() => {
        if (user?.id) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {

            setLoading(true);

            const response = await fetch(
                `${API}/api/order/getorderbycustomerid/${user.id}`
            );

            const data = await response.json();

            // Filter only Delivered (4) and Cancelled (5)
            const filteredOrders = data.filter(
                (order) => order.status_id === 4 || order.status_id === 5
            );

            // Latest orders first
            filteredOrders.sort((a, b) => b.id - a.id);

            setOrders(filteredOrders);

        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <div className="container py-4">

                <div className="card shadow-sm border-0">

                    <div className="card-header bg-white">
                        <h4 className="mb-0">
                            Order History
                        </h4>
                    </div>

                    <div className="card-body">

                        {loading ? (
                            <div className="text-center py-5">
                                <h5>Loading orders...</h5>
                            </div>
                        ) : currentOrders.length === 0 ? (
                            <div className="text-center py-5">
                                <h5>No order history found</h5>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">

                                    <table className="table table-bordered align-middle">

                                        <thead className="table-light">
                                            <tr>
                                                <th>Order ID</th>
                                                <th>When Order Placed</th>
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
                                                        {formatDate(order.created_at)}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className=""
                                                        >
                                                            {Number(order.status_id) === 4
                                                                ? 'Delivered'
                                                                : Number(order.status_id) === 5
                                                                ? 'Cancelled'
                                                                : order.status_name}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <Link
                                                            to={`/orderdetailpage/${order.id}`}
                                                            className="btn btn-primary btn-sm"
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

                                {totalPages > 1 && (

                                    <div className="d-flex justify-content-center mt-4">

                                        <nav>
                                            <ul className="pagination">

                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setCurrentPage(currentPage - 1)}
                                                    >
                                                        Previous
                                                    </button>
                                                </li>

                                                {[...Array(totalPages)].map((_, index) => (
                                                    <li
                                                        key={index}
                                                        className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                                    >
                                                        <button
                                                            className="page-link"
                                                            onClick={() => setCurrentPage(index + 1)}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    </li>
                                                ))}

                                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setCurrentPage(currentPage + 1)}
                                                    >
                                                        Next
                                                    </button>
                                                </li>

                                            </ul>
                                        </nav>

                                    </div>

                                )}

                            </>
                        )}

                    </div>

                </div>

            </div>
        </>
    );
}

export default CustomerOrderHistory;