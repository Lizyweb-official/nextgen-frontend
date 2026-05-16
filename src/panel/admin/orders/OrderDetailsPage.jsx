import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style-4.css';
import '../../../css/style.css';
 
import React, { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
 
const API = import.meta.env.VITE_API_URL;
 
function OrderDetailsPage() {
 
    const { id } = useParams();
 
    const [order, setOrder] = useState(null);
    const [statusHistory, setStatusHistory] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restoring, setRestoring] = useState(false); // ✅ loading state for restore
 
    const allStatuses = [
        { id: 1, name: "Preparing" },
        { id: 2, name: "Ready To Dispatch" },
        { id: 3, name: "Out For Delivery" },
        { id: 4, name: "Delivered" },
        { id: 5, name: "Cancelled" },
    ];
 
    const fetchOrderDetails = async () => {
        try {
            const res = await fetch(`${API}/api/order/getorderbyid/${id}`);
            const data = await res.json();
            setOrder(data);
 
            if (data.items && data.items.length > 0) {
                const productPromises = data.items.map(async (item) => {
                    const productRes = await fetch(`${API}/api/product/getproduct/${item.product_id}`);
                    const productData = await productRes.json();
                    return {
                        ...productData,
                        quantity: item.quantity,
                        order_price: item.price,
                        total_price: item.q_price,
                        custom_pieces:item.custom_pieces
                    };
                });
                const allProducts = await Promise.all(productPromises);
                setProducts(allProducts);
            }
        } catch (error) {
            console.error("ORDER FETCH ERROR:", error);
        }
    };
 
    const fetchStatusHistory = async () => {
        try {
            const res = await fetch(`${API}/api/order/getorderstatushistory/${id}`);
            const data = await res.json();
            setStatusHistory(data);
        } catch (error) {
            console.error("STATUS FETCH ERROR:", error);
        }
    };
 
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchOrderDetails(), fetchStatusHistory()]);
            setLoading(false);
        };
        loadData();
    }, [id]);
 
    const formatDate = (date) => new Date(date).toLocaleString();
 
    const getStatusData = (statusId) => {
        return statusHistory.find((item) => Number(item.status) === statusId);
    };

    // ✅ Update status API call
    const updateStatus = async (order_id, status_id) => {
        const response = await fetch(`${API}/api/order/updateOrderStatus`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id, status_id }),
        });
        const data = await response.json();
        return data;
    };

    // ✅ Restore handler — resets cancelled order back to Preparing (status_id: 1)
    const handleRestore = async () => {
        const confirmRestore = window.confirm(
            "Are you sure you want to restore this order to 'Preparing'?"
        );
        if (!confirmRestore) return;

        try {
            setRestoring(true);
            const data = await updateStatus(Number(id), 1);
            alert(data.message);

            // Update local order state so UI reflects change instantly
            setOrder((prev) => ({
                ...prev,
                status_id: 1,
                status_name: "Preparing",
            }));

        } catch (error) {
            console.error("RESTORE ERROR:", error);
            alert("Failed to restore order. Please try again.");
        } finally {
            setRestoring(false);
        }
    };
 
    if (loading) {
        return <div className="container py-5"><h3>Loading Order...</h3></div>;
    }
 
    if (!order) {
        return <div className="container py-5"><h3>Order Not Found</h3></div>;
    }
 
    const isCancelled = Number(order.status_id) === 5;
    const cancelledStatusData = getStatusData(5);
    const trackerStatuses = allStatuses.filter((s) => s.id !== 5);
 
    return (
        <div className="admin-db-inc-order-root">
 
            {/* ✅ CANCELLED BANNER with Restore button */}
            {isCancelled && (
                <div className="admin-db-inc-order-cancelled-banner">
                    <i className="ti ti-ban" aria-hidden="true"></i>
                    <div style={{ flex: 1 }}>
                        <div className="admin-db-inc-order-cancelled-banner-title">Order cancelled</div>
                        {cancelledStatusData?.created_at && (
                            <div className="admin-db-inc-order-cancelled-banner-sub">
                                This order was cancelled on {formatDate(cancelledStatusData.created_at)}
                            </div>
                        )}
                    </div>

                    {/* ✅ Restore button — only visible when order is cancelled */}
                    <button
                        className="btn btn-warning btn-sm"
                        onClick={handleRestore}
                        disabled={restoring}
                        style={{ whiteSpace: "nowrap" }}
                    >
                        {restoring ? "Restoring..." : "Restore Order"}
                    </button>
                </div>
            )}
 
            {/* ORDER HEADER */}
            <div className="admin-db-inc-order-header">
                <div>
                    <div className="admin-db-inc-order-header-id">Order</div>
                    <div className="admin-db-inc-order-header-num">#{order.id}</div>
                    <div className="admin-db-inc-order-header-date">{formatDate(order.created_at)}</div>
                </div>
                <div>
                    <div className="admin-db-inc-order-header-amount-label">Total Amount</div>
                    <div className="admin-db-inc-order-header-amount">₹{order.total_amount}</div>
                </div>
            </div>
 
            {/* STATUS TRACKER */}
            <div className="admin-db-inc-order-section">
                <div className="admin-db-inc-order-section-header">
                    <i className="ti ti-route" aria-hidden="true"></i>
                    <h2 className="admin-db-inc-order-section-title">Order tracking</h2>
                </div>
                <div className="admin-db-inc-order-section-body">
                    <div className="admin-db-inc-order-tracker-grid">
                        {trackerStatuses.map((status) => {
                            const completedStatus = getStatusData(status.id);
                            const isCompleted = !!completedStatus;
                            const isCurrent = Number(order.status_id) === status.id;
 
                            return (
                                <div
                                    key={status.id}
                                    className={[
                                        "admin-db-inc-order-tracker-step",
                                        isCurrent ? "admin-db-inc-order-tracker-step-current" : "",
                                        isCompleted && !isCurrent ? "admin-db-inc-order-tracker-step-done" : "",
                                    ].filter(Boolean).join(" ")}
                                >
                                    {isCurrent && (
                                        <div className="admin-db-inc-order-tracker-badge">Current</div>
                                    )}
                                    <div className="admin-db-inc-order-tracker-step-name">{status.name}</div>
                                    {isCompleted ? (
                                        isCurrent ? (
                                            <div className="admin-db-inc-order-tracker-status-inprogress">
                                                <i className="ti ti-truck" aria-hidden="true"></i> In progress
                                            </div>
                                        ) : (
                                            <div className="admin-db-inc-order-tracker-status-done">
                                                <i className="ti ti-circle-check" aria-hidden="true"></i> Completed
                                            </div>
                                        )
                                    ) : (
                                        <div className="admin-db-inc-order-tracker-pending">Pending</div>
                                    )}
                                    {isCompleted && completedStatus?.created_at && (
                                        <div className="admin-db-inc-order-tracker-date">
                                            {formatDate(completedStatus.created_at)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
 
            {/* CUSTOMER DETAILS */}
            <div className="admin-db-inc-order-section">
                <div className="admin-db-inc-order-section-header">
                    <i className="ti ti-user" aria-hidden="true"></i>
                    <h2 className="admin-db-inc-order-section-title">Customer details</h2>
                </div>
                <div className="admin-db-inc-order-section-body">
                    <div className="admin-db-inc-order-details-grid">
                        <div className="admin-db-inc-order-detail-item">
                            <span className="admin-db-inc-order-detail-label">Name</span>
                            <span className="admin-db-inc-order-detail-value">{order.name}</span>
                        </div>
                        <div className="admin-db-inc-order-detail-item">
                            <span className="admin-db-inc-order-detail-label">Contact number</span>
                            <span className="admin-db-inc-order-detail-value">{order.contact_number}</span>
                        </div>
                        <div className="admin-db-inc-order-detail-item">
                            <span className="admin-db-inc-order-detail-label">Payment method</span>
                            <span className="admin-db-inc-order-detail-value">{order.payment_method}</span>
                        </div>
                        <div className="admin-db-inc-order-detail-item">
                            <span className="admin-db-inc-order-detail-label">Payment status</span>
                            <span className="admin-db-inc-order-detail-value">
                                <span className="admin-db-inc-order-detail-badge admin-db-inc-order-badge-paid">
                                    <i className="ti ti-circle-check" aria-hidden="true"></i>
                                    {order.payment_status}
                                </span>
                            </span>
                        </div>
                        <div className="admin-db-inc-order-detail-item">
                            <span className="admin-db-inc-order-detail-label">Current status</span>
                            <span className="admin-db-inc-order-detail-value">
                                <span className="admin-db-inc-order-detail-badge admin-db-inc-order-badge-status">
                                    <i className="ti ti-truck" aria-hidden="true"></i>
                                    {order.status_name}
                                </span>
                            </span>
                        </div>
                        <div className="admin-db-inc-order-detail-item">
                            <span className="admin-db-inc-order-detail-label">Total amount</span>
                            <span className="admin-db-inc-order-detail-amount">₹{order.total_amount}</span>
                        </div>
                        <div className="admin-db-inc-order-detail-item admin-db-inc-order-detail-item-full">
                            <span className="admin-db-inc-order-detail-label">Delivery address</span>
                            <span className="admin-db-inc-order-detail-value">
                                {order.street}, {order.city}
                                {order.district && `, ${order.district}`}, {order.state} — {order.pincode}
                            </span>
                        </div>
                        <div className="admin-db-inc-order-detail-item">
                            <span className="admin-db-inc-order-detail-label">Delivery slot</span>
                            <span className="admin-db-inc-order-detail-value">{order.slot_name}</span>
                        </div>
                        <div className="admin-db-inc-order-detail-item">
                            <span className="admin-db-inc-order-detail-label">Delivery time</span>
                            <span className="admin-db-inc-order-detail-value">
                                {order.delivery_time}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
 
            {/* PRODUCT DETAILS */}
            <div className="admin-db-inc-order-section">
                <div className="admin-db-inc-order-section-header">
                    <i className="ti ti-package" aria-hidden="true"></i>
                    <h2 className="admin-db-inc-order-section-title">Product details</h2>
                </div>
                <div className="admin-db-inc-order-table-wrap">
                    <table className="admin-db-inc-order-table">
                        <thead>
                            <tr>
                                <th style={{ width: "28%" }}>Product Id</th>
                                <th style={{ width: "28%" }}>Product</th>
                                <th style={{ width: "14%" }}>Category</th>
                                <th style={{ width: "22%" }}>Custom fields</th>
                                <th style={{ width: "12%" }}>Price</th>
                                <th style={{ width: "12%" }}>Custom Pieces</th>
                                <th style={{ width: "8%" }}>Qty</th>
                                <th style={{ width: "16%" }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div>{product.id}</div>
                                    </td>
                                    <td>
                                        <Link to={`/single-product-page/${product.id}`} className="admin-db-inc-order-product-name">{product.name}</Link>
                                        <div className="admin-db-inc-order-product-desc">{product.short_description}</div>
                                    </td>
                                    <td>
                                        {product.categories?.map((cat) => (
                                            <div key={cat.id}>
                                                <span className="admin-db-inc-order-cat-tag">{cat.name}</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        {product.custom_fields?.map((field, index) => (
                                            <div key={index} className="admin-db-inc-order-custom-field">
                                                <strong>{field.field_name}:</strong> {field.field_value}
                                            </div>
                                        ))}
                                    </td>
                                    <td>₹{product.order_price}</td>
                                    <td>{product.custom_pieces}</td>
                                    <td>{product.quantity}</td>
                                    <td className="admin-db-inc-order-table-total">₹{product.total_price}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={7} className="admin-db-inc-order-tfoot">Grand total</td>
                                <td className="admin-db-inc-order-tfoot admin-db-inc-order-tfoot-total">
                                    ₹{order.total_amount}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
 
        </div>
    );
}
 
export default OrderDetailsPage;