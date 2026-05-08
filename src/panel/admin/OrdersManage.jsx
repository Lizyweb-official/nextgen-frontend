import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style-4.css';
import '../../css/style.css';

import React, { useState , useEffect } from "react";

import Orders from './orders/Orders';
import OrderHistory from './orders/OrderHistory';

function ProductManage(){
    const [activeTab, setActiveTab] = useState("orders");
    
    return(
        <>
            <div className="admin-db-secondary-maintab-container">

                {/* Tabs Header */}
                <div className="admin-db-secondary-maintab-header">

                    <button
                        className={`admin-db-secondary-maintab-btn ${activeTab === "allproducts" ? "admin-db-secondary-maintab-active" : ""}`}
                        onClick={() => setActiveTab("orders")}
                    >
                        <i className="bi bi-grid admin-db-secondary-maintab-btn-icon"></i>
                        Orders Manager
                    </button>

                    <button
                        className={`admin-db-secondary-maintab-btn ${activeTab === "addnewproduct" ? "admin-db-secondary-maintab-active" : ""}`}
                        onClick={() => setActiveTab("orderh")}
                    >
                        <i className="bi bi-plus-circle admin-db-secondary-maintab-btn-icon"></i>
                        Order History
                    </button>

                </div>

                {/* Tabs Content */}
                <div className="admin-db-secondary-maintab-content">
                    {activeTab === "orders" && (
                        <div className="admin-db-secondary-maintab-panel">
                            <Orders/>
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