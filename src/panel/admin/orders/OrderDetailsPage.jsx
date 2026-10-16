import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style-4.css';
import '../../../css/style.css';
 
import React, { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import { useAuth } from '../../../context/AuthContext';

import { showWebMessage } from "../../../context/webMessageHandler";

 
const API = import.meta.env.VITE_API_URL;
 
function OrderDetailsPage() {
 
    const { id } = useParams();
    const { user } = useAuth();
 
    const [order, setOrder] = useState(null);
    const [statusHistory, setStatusHistory] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restoring, setRestoring] = useState(false); // ✅ loading state for restore
    const [assigningLalamove, setAssigningLalamove] = useState(false);
    const [refreshingLalamove, setRefreshingLalamove] = useState(false);

    // Lalamove vehicle/service options (GET /api/lalamove/vehicle-services) —
    // fetched live so nothing about vehicle names/capacities is hard-coded
    // here; see requirements in the Delivery partner section below.
    const [vehicleOptions, setVehicleOptions] = useState([]);
    const [vehicleOptionsLoading, setVehicleOptionsLoading] = useState(false);
    const [vehicleOptionsError, setVehicleOptionsError] = useState("");
    const [selectedVehicleKey, setSelectedVehicleKey] = useState("");
 
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

    // Live Lalamove vehicle/service catalogue for the "Assign to Lalamove"
    // vehicle picker — nothing about the vehicles is hard-coded on this page.
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
            console.error("VEHICLE OPTIONS FETCH ERROR:", error);
            setVehicleOptionsError(error.message || "Failed to fetch vehicle options");
        } finally {
            setVehicleOptionsLoading(false);
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

    // ✅ Order status can now change on its own in the background — e.g. the
    // Lalamove status poller moving Out For Delivery -> Delivered — so a
    // page left open must pick that up without a manual reload. Polls
    // silently (no loading flicker; restoring/assigning/refreshing button
    // states are untouched) rather than only fetching once on mount.
    useEffect(() => {
        const interval = setInterval(() => {
            fetchOrderDetails();
            fetchStatusHistory();
        }, 10000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Only admins see/use the Lalamove assignment section, and there's
    // nothing to pick once an order is already assigned — so only fetch the
    // vehicle catalogue when it'll actually be shown.
    useEffect(() => {
        if (!(user?.usertype === "admin" && order && !order.lalamove_order_id)) return;
        const loadVehicleOptions = async () => {
            await fetchVehicleOptions();
        };
        loadVehicleOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.usertype, order?.id, order?.lalamove_order_id]);

    const formatDate = (date) => new Date(date).toLocaleString();

    // Lalamove's `load` field varies by response shape — GET /v3/cities
    // returns it as { value: "250", unit: "kg" }, but pull the numeric kg
    // value out of whatever Lalamove sends (object, plain number, or a
    // free-text string like "130kg") rather than assuming one fixed format.
    const parseLoadKg = (load) => {
        if (load == null) return null;
        if (typeof load === "number") return load;
        if (typeof load === "object") return parseLoadKg(load.value);
        const match = String(load).match(/[\d.]+/);
        return match ? parseFloat(match[0]) : null;
    };

    // Human-readable capacity for the vehicle dropdown label — `load` can be
    // an object ({ value, unit }), a number, or a free-text string, so this
    // renders whatever numeric kg value parseLoadKg found rather than
    // stringifying the raw field (which would print "[object Object]").
    const formatLoadKg = (load) => {
        const kg = parseLoadKg(load);
        return kg == null ? null : `${kg} kg`;
    };

    // This shop sells by weight — order_items.quantity is the kg amount per
    // line (see the "kg" column in Product details below), so the order's
    // total weight is just the sum of those.
    const orderTotalWeightKg = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);

    // Only offer vehicles whose stated capacity can actually carry this
    // order; an option with no parseable capacity is left in rather than
    // silently hidden.
    const eligibleVehicleOptions = vehicleOptions.filter((v) => {
        const capacityKg = parseLoadKg(v.load);
        return capacityKg == null || capacityKg >= orderTotalWeightKg;
    });
 
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
            showWebMessage(data.message);

            // Update local order state so UI reflects change instantly
            setOrder((prev) => ({
                ...prev,
                status_id: 1,
                status_name: "Preparing",
            }));

            // Backend prunes history rows past the new (lower) status —
            // re-fetch so the tracker stops showing Delivered/Ready to
            // Dispatch/Out for Delivery as completed.
            await fetchStatusHistory();

        } catch (error) {
            console.error("RESTORE ERROR:", error);
            showWebMessage("Failed to restore order. Please try again.");
        } finally {
            setRestoring(false);
        }
    };
 
    // ✅ Hands the order off to Lalamove for delivery — books a real courier
    // against a fresh quotation (warehouse -> this order's saved address)
    // and stores the returned Lalamove order id/status/tracking link.
    const handleAssignToLalamove = async () => {
        const confirmAssign = window.confirm(
            "Assign this order to Lalamove? This books a real delivery courier."
        );
        if (!confirmAssign) return;

        try {
            setAssigningLalamove(true);
            const res = await fetch(`${API}/api/lalamove/assign-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: order.id,
                    // Selected vehicle's `key` from GET /api/lalamove/vehicle-services;
                    // omitted (falls back to the backend's existing default) if the
                    // admin didn't pick one.
                    ...(selectedVehicleKey && { serviceType: selectedVehicleKey }),
                }),
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to assign order to Lalamove");
            }

            setOrder((prev) => ({
                ...prev,
                lalamove_order_id: data.data.lalamoveOrderId,
                lalamove_status: data.data.status,
                lalamove_share_link: data.data.shareLink,
            }));
            setSelectedVehicleKey("");
            showWebMessage("Order assigned to Lalamove");
        } catch (error) {
            console.error("ASSIGN LALAMOVE ERROR:", error);
            showWebMessage(error.message || "Failed to assign order to Lalamove");
        } finally {
            setAssigningLalamove(false);
        }
    };

    // ✅ Pulls the latest status/tracking link for an order already assigned
    // — doesn't book anything new, just refreshes what's stored.
    const handleRefreshLalamoveStatus = async () => {
        try {
            setRefreshingLalamove(true);
            const res = await fetch(`${API}/api/lalamove/order-status/${order.id}`);
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to refresh Lalamove status");
            }

            setOrder((prev) => ({
                ...prev,
                lalamove_status: data.data.status,
                lalamove_share_link: data.data.shareLink,
            }));
        } catch (error) {
            console.error("REFRESH LALAMOVE STATUS ERROR:", error);
            showWebMessage(error.message || "Failed to refresh Lalamove status");
        } finally {
            setRefreshingLalamove(false);
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
                        {cancelledStatusData?.updated_at && (
                            <div className="admin-db-inc-order-cancelled-banner-sub">
                                This order was cancelled on {formatDate(cancelledStatusData.updated_at)}
                            </div>
                        )}
                    </div>
                    

                   {/* ✅ Show only for admin */}
                    {user?.usertype === "admin" && (
                        <button
                            className="btn btn-warning btn-sm"
                            onClick={handleRestore}
                            disabled={restoring}
                            style={{ whiteSpace: "nowrap" }}
                        >
                            {restoring ? "Restoring..." : "Restore Order"}
                        </button>
                    )}
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
                    <div className="admin-db-inc-order-header-amount">RM {order.total_amount}</div>
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
                                    {isCompleted && completedStatus?.updated_at && (
                                        <div className="admin-db-inc-order-tracker-date">
                                            {formatDate(completedStatus.updated_at)}
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
                            <span className="admin-db-inc-order-detail-label">Invoice number</span>
                            <span className="admin-db-inc-order-detail-value">
                                {order.payment_status === "paid" ? (order.invoice_number || "-") : "-"}
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
                            <span className="admin-db-inc-order-detail-amount">RM {order.total_amount}</span>
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
                                {order.delivery_time + " | "+ order.delivery_date}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* DELIVERY PARTNER (LALAMOVE) — admin-only; this page is shared
                with the customer's own order view and the delivery
                partner's view, neither of which should see Lalamove
                assignment details. */}
            {user?.usertype === "admin" && !isCancelled && (
                <div className="admin-db-inc-order-section">
                    <div className="admin-db-inc-order-section-header">
                        <i className="ti ti-truck-delivery" aria-hidden="true"></i>
                        <h2 className="admin-db-inc-order-section-title">Delivery partner</h2>
                    </div>
                    <div className="admin-db-inc-order-section-body">
                        {order.lalamove_order_id ? (
                            <div className="admin-db-inc-order-details-grid">
                                <div className="admin-db-inc-order-detail-item">
                                    <span className="admin-db-inc-order-detail-label">Lalamove order ID</span>
                                    <span className="admin-db-inc-order-detail-value">{order.lalamove_order_id}</span>
                                </div>
                                <div className="admin-db-inc-order-detail-item">
                                    <span className="admin-db-inc-order-detail-label">Lalamove status</span>
                                    <span className="admin-db-inc-order-detail-value">
                                        <span className="admin-db-inc-order-detail-badge admin-db-inc-order-badge-status">
                                            <i className="ti ti-truck" aria-hidden="true"></i>
                                            {order.lalamove_status || "Unknown"}
                                        </span>
                                    </span>
                                </div>
                                <div className="admin-db-inc-order-detail-item">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={handleRefreshLalamoveStatus}
                                        disabled={refreshingLalamove}
                                    >
                                        {refreshingLalamove ? "Refreshing..." : "Refresh status"}
                                    </button>
                                </div>
                                {order.lalamove_share_link && (
                                    <div className="admin-db-inc-order-detail-item">
                                        <a
                                            href={order.lalamove_share_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary btn-sm"
                                        >
                                            Track delivery
                                        </a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <span style={{ fontSize: "13.5px", color: "#666" }}>
                                    Not assigned to a delivery partner yet.
                                </span>

                                {vehicleOptionsLoading && (
                                    <span style={{ fontSize: "12.5px", color: "#666" }}>
                                        Loading vehicle options...
                                    </span>
                                )}

                                {!vehicleOptionsLoading && vehicleOptionsError && (
                                    <span style={{ fontSize: "12.5px", color: "#bc1919" }}>
                                        {vehicleOptionsError}
                                    </span>
                                )}

                                {!vehicleOptionsLoading && !vehicleOptionsError && vehicleOptions.length > 0 && (
                                    <div className="admin-db-inc-order-detail-item">
                                        <span className="admin-db-inc-order-detail-label">
                                            Vehicle (order weight: {orderTotalWeightKg} kg)
                                        </span>
                                        <select
                                            className="form-select form-select-sm"
                                            style={{ maxWidth: "420px" }}
                                            value={selectedVehicleKey}
                                            onChange={(e) => setSelectedVehicleKey(e.target.value)}
                                        >
                                            <option value="">Select a vehicle...</option>
                                            {eligibleVehicleOptions.map((v) => (
                                                <option key={v.key} value={v.key}>
                                                    {v.key}
                                                    {v.description ? ` — ${v.description}` : ""}
                                                    {formatLoadKg(v.load) ? ` (up to ${formatLoadKg(v.load)})` : ""}
                                                </option>
                                            ))}
                                        </select>
                                        {eligibleVehicleOptions.length === 0 && (
                                            <span style={{ fontSize: "12.5px", color: "#bc1919" }}>
                                                No vehicle option has enough capacity for this order's weight.
                                            </span>
                                        )}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={handleAssignToLalamove}
                                    disabled={assigningLalamove || (vehicleOptions.length > 0 && !selectedVehicleKey)}
                                    style={{ alignSelf: "flex-start" }}
                                >
                                    {assigningLalamove ? "Assigning..." : "Assign to Lalamove"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

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
                                {/* <th style={{ width: "22%" }}>Custom fields</th> */}
                                <th style={{ width: "12%" }}>Price</th>
                                <th style={{ width: "12%" }}>Custom Pieces</th>
                                <th style={{ width: "8%" }}>kg</th>
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
                                    {/* <td>
                                        {product.custom_fields?.map((field, index) => (
                                            <div key={index} className="admin-db-inc-order-custom-field">
                                                <strong>{field.field_name}:</strong> {field.field_value}
                                            </div>
                                        ))}
                                    </td> */}
                                    <td>RM {product.order_price}</td>
                                    <td>{product.custom_pieces}</td>
                                    <td>{product.quantity}</td>
                                    <td className="admin-db-inc-order-table-total">RM {product.total_price}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={6} className="admin-db-inc-order-tfoot">Grand total</td>
                                <td className="admin-db-inc-order-tfoot admin-db-inc-order-tfoot-total">
                                    RM {order.total_amount}
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