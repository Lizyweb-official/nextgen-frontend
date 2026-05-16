import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import {useAuth} from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { useState , useEffect } from "react";

import OrdersDp from './dp/OrdersDp';
import DeliveryTracking from './dp/DeliverypTracking';

function DeliveryPanel() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("orders");

    // Redirect / Login Message
    if (!user) {
        return (
            <div className="customer-db-login-message">
                <h2>Please Login</h2>

                <button
                    className="customer-db-login-btn"
                    onClick={() => navigate("/login")}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    // Tab Data
    const tabs = [
        {
            id: "orders",
            label: "Orders",
            component: <OrdersDp/>,
        },
        {
            id: "deliverytracking",
            label: "Delivery Tracking",
            component: <DeliveryTracking/>,
        },
    ];

    // Active Component
    const activeContent = tabs.find(
        (tab) => tab.id === activeTab
    )?.component;

    return (
        <div className="customer-db">

            {/* Welcome Section */}
            <div className="customer-db-tab-welcome">

                <p className="customer-db-tab-welcome-subtitle"style={{ color: "#000",fontWeight:700, fontSize:30}}>
                    Welcome to AyamKini
                </p>
            </div>

            {/* Tab Container */}
            <div className="customer-db-tab-container">

                {/* Tab Header */}
                <div className="customer-db-tab-header">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`customer-db-tab-btn ${
                                activeTab === tab.id ? "active" : ""
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="customer-db-tab-content">
                    <div className="customer-db-tab-pane">
                        {activeContent}
                    </div>
                </div>

            </div>
        </div>
    );
}


export default DeliveryPanel;