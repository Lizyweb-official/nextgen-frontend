import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import {useAuth} from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { useState , useEffect } from "react";

import PersonalDetails from './customer/PersonalDetails';   

function CustomerPanel() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("details");

    // Redirect / Login Message
    if (!user) {
        navigate("/UserLoginPanel");
    }

    // Tab Data
    const tabs = [
        {
            id: "details",
            label: "Personal Details",
            component: <PersonalDetails/>,
        },
        {
            id: "status",
            label: "Order Status",
            component: <OrderStatus />,
        },
        {
            id: "history",
            label: "Order History",
            component: <OrderHistory />,
        },
        {
            id: "setting",
            label: "Settings",
            component: <Settings />,
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
                <h2 className="customer-db-tab-welcome-title">
                    Hi {user?.name} 👋
                </h2>

                <p className="customer-db-tab-welcome-subtitle">
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

/* -------------------------------
   Order Status
-------------------------------- */

function OrderStatus() {
    return (
        <div className="customer-db-orders">
            {/* <h2>Order Status</h2> */}

            <p>Show current orders here...</p>
        </div>
    );
}

/* -------------------------------
   Order History
-------------------------------- */

function OrderHistory() {
    return (
        <div className="customer-db-history">
            {/* <h2>Order History</h2> */}

            <p>Show past orders here...</p>
        </div>
    );
}

/* -------------------------------
   Settings
-------------------------------- */

function Settings() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/UserLoginPanel");
    };

    return (
        <div className="customer-db-settings">
            {/* <h2>Settings</h2> */}

            <button
                className="customer-db-tab-logout-btn"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
}
export default CustomerPanel;