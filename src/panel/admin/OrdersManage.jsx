import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style-4.css';
import '../../css/style.css';

import React, { useState , useEffect } from "react";

import Orders from './orders/IncomingOrders';
import OrderHistory from './orders/OrderHistory';
import DeliveryTracking from './orders/DeliveryTracking';

function ProductManage(){
    const [activeTab, setActiveTab] = useState("IncomingOrders");
    
    return(
        <>
            <div className="admin-db-secondary-maintab-container">

                {/* Tabs Header */}
                <div className="admin-db-secondary-maintab-header">

                    <button
                        className={`admin-db-secondary-maintab-btn ${activeTab === "IncomingOrders" ? "admin-db-secondary-maintab-active" : ""}`}
                        onClick={() => setActiveTab("IncomingOrders")}
                    >
                        <i className="bi bi-grid admin-db-secondary-maintab-btn-icon"></i>
                        Incoming Orders
                    </button>

                    <button
                        className={`admin-db-secondary-maintab-btn ${activeTab === "DeliveryTracking" ? "admin-db-secondary-maintab-active" : ""}`}
                        onClick={() => setActiveTab("DeliveryTracking")}
                    >
                        <i className="bi bi-grid admin-db-secondary-maintab-btn-icon"></i>
                        Delivery Tracking
                    </button>

                    <button
                        className={`admin-db-secondary-maintab-btn ${activeTab === "orderh" ? "admin-db-secondary-maintab-active" : ""}`}
                        onClick={() => setActiveTab("orderh")}
                    >
                        <i className="bi bi-plus-circle admin-db-secondary-maintab-btn-icon"></i>
                        Order History
                    </button>

                </div>

                {/* Tabs Content */}
                <div className="admin-db-secondary-maintab-content">
                    {activeTab === "IncomingOrders" && (
                        <div className="admin-db-secondary-maintab-panel">
                            <Orders/>
                        </div>
                    )}
                    {activeTab === "DeliveryTracking" && (
                        <div className="admin-db-secondary-maintab-panel">
                            <DeliveryTracking/>
                        </div>
                    )}
                    
                    {activeTab === "orderh" && (
                        <div className="admin-db-secondary-maintab-panel">
                            <OrderHistory/>
                        </div>
                    )}
                   
                </div>

            </div>
        </>
    );
}

export default ProductManage;