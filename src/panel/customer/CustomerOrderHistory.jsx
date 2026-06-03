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
            <div className="order-history-container container py-4">

    <div className="order-history-card card shadow-sm border-0">

        <div className="order-history-header card-header bg-white">
            <h4 className="order-history-title mb-0">
                Order History
            </h4>
        </div>

        <div className="order-history-body card-body">

            {loading ? (
                <div className="order-history-loading text-center py-5">
                    <h5>Loading orders...</h5>
                </div>
            ) : currentOrders.length === 0 ? (
                <div className="order-history-empty text-center py-5">
                    <h5>No order history found</h5>
                </div>
            ) : (
                <>
                    <div className="order-history-table-wrapper table-responsive">

                        <table className="order-history-table table table-bordered align-middle">

                            <thead className="order-history-thead table-light">
                                <tr>
                                    <th>Order ID</th>
                                    <th>When Order Placed</th>
                                    <th>Order Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {currentOrders.map((order) => (

                                    <tr
                                        key={order.id}
                                        className="order-history-row"
                                    >

                                        <td className="order-history-id">
                                            #{order.id}
                                        </td>

                                        <td className="order-history-date">
                                            {formatDate(order.created_at)}
                                        </td>

                                        <td className="order-history-status">
                                            <span className="order-history-status-text">
                                                {Number(order.status_id) === 4
                                                    ? 'Delivered'
                                                    : Number(order.status_id) === 5
                                                    ? 'Cancelled'
                                                    : order.status_name}
                                            </span>
                                        </td>

                                        <td className="order-history-action">
                                            <Link
                                                to={`/orderdetailpage/${order.id}`}
                                                className="order-history-view-btn btn btn-primary btn-sm"
                                            >
                                                View Details
                                            </Link>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                    {totalPages > 1 && (

                        <div className="order-history-pagination-wrapper d-flex justify-content-center mt-4">

                            <nav className="order-history-pagination-nav">

                                <ul className="order-history-pagination pagination">

                                    <li
                                        className={`order-history-page-item page-item ${
                                            currentPage === 1 ? 'disabled' : ''
                                        }`}
                                    >
                                        <button
                                            className="order-history-page-link page-link"
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                        >
                                            Previous
                                        </button>
                                    </li>

                                    {[...Array(totalPages)].map((_, index) => (
                                        <li
                                            key={index}
                                            className={`order-history-page-item page-item ${
                                                currentPage === index + 1 ? 'active' : ''
                                            }`}
                                        >
                                            <button
                                                className="order-history-page-link page-link"
                                                onClick={() => setCurrentPage(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}

                                    <li
                                        className={`order-history-page-item page-item ${
                                            currentPage === totalPages ? 'disabled' : ''
                                        }`}
                                    >
                                        <button
                                            className="order-history-page-link page-link"
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