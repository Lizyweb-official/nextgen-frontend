import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style-4.css';
import '../../css/style.css';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

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

            <div className="container-fluid mt-4 dp-order-history-container">

                <div className="d-flex justify-content-between align-items-center mb-3 dp-order-history-header">
                    
                    <h3 className="mb-0 dp-order-history-title">
                        Order History
                    </h3>

                    <button
                        className="btn btn-primary dp-order-history-refresh-btn"
                        onClick={fetchOrders}
                    >
                        Refresh
                    </button>

                </div>

                <div className="card shadow-sm dp-order-history-card">
                    
                    <div className="card-body dp-order-history-card-body">

                        {loading ? (

                            <div className="text-center py-5 dp-order-history-loading">
                                <h5>Loading...</h5>
                            </div>

                        ) : currentOrders.length === 0 ? (

                            <div className="text-center py-5 dp-order-history-empty">
                                <h5>No Orders Found</h5>
                            </div>

                        ) : (

                            <>
                                <div className="table-responsive dp-order-history-table-wrapper">
                                    
                                    <table className="table table-bordered table-hover align-middle dp-order-history-table">

                                        <thead className="table-dark dp-order-history-thead">
                                            
                                            <tr>
                                                <th className="dp-order-history-th">
                                                    Order ID
                                                </th>

                                                <th className="dp-order-history-th">
                                                    Order Placed Time
                                                </th>

                                                <th className="dp-order-history-th">
                                                    Order Status
                                                </th>

                                                <th className="dp-order-history-th">
                                                    Action
                                                </th>
                                            </tr>

                                        </thead>

                                        <tbody className="dp-order-history-tbody">

                                            {currentOrders.map((order) => (

                                                <tr
                                                    key={order.id}
                                                    className="dp-order-history-row"
                                                >

                                                    <td className="dp-order-history-order-id">
                                                        #{order.id}
                                                    </td>

                                                    <td className="dp-order-history-date">
                                                        {new Date(order.created_at).toLocaleString()}
                                                    </td>

                                                    <td className="dp-order-history-status">
                                                        
                                                        <span className="dp-order-history-status-text">
                                                            {order.status_name}
                                                        </span>

                                                    </td>

                                                    <td className="dp-order-history-action">
                                                        
                                                        <Link
                                                            to={`/Orderdetailpage/${order.id}`}
                                                            className="btn btn-sm btn-primary dp-order-history-view-btn"
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
                                <div className="d-flex justify-content-center align-items-center mt-3 gap-2 dp-order-history-pagination">

                                    <button
                                        className="btn btn-secondary dp-order-history-prev-btn"
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage(currentPage - 1)
                                        }
                                    >
                                        Previous
                                    </button>

                                    <span className="dp-order-history-page-text">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        className="btn btn-secondary dp-order-history-next-btn"
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