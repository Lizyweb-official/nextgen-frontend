import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import {useAuth} from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { useState , useEffect } from "react";

import PersonalDetails from './customer/PersonalDetails';   
import OrderStatus from './customer/OrderStatus';
import CustomerOrderHistory from './customer/CustomerOrderHistory';

function CustomerPanel() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("details");

    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/user-login-page");
    };

    // Redirect / Login Message
    if (!user) {
        return (
            <div className="customer-db-login-message">
                <h2>Please Login</h2>

                <button
                    className="customer-db-login-btn"
                    onClick={() => navigate("/user-login-page")}
                >
                    Go to Login
                </button>
            </div>
        );
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
            component: <CustomerOrderHistory />,
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
                    <button
                        className="customer-db-tab-btn customer-db-tab-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
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
   Settings
-------------------------------- */

function Settings() {
    

    return (
        <div className="customer-db-settings">
            {/* <h2>Settings</h2> */}

            
        </div>
    );
}
export default CustomerPanel;