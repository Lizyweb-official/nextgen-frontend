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
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("details");

    const handleLogout = () => {
        logout();
        navigate("/user-login-page");
    };

    if (!user) {
        return (
            <div className="customer-db-login-wrapper">
                <div className="customer-db-login-card">

                    <img
                        src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
                        alt="login"
                    />

                    <h2>Please Login</h2>

                    <p>
                        Login to access your AyamKini dashboard,
                        orders and account details.
                    </p>

                    <button
                        className="customer-db-login-btn"
                        onClick={() => navigate("/user-login-page")}
                    >
                        Go to Login
                    </button>

                </div>
            </div>
        );
    }

    const tabs = [
        {
            id: "details",
            label: "Personal Details",
            icon: <PersonCircle />,
            component: <PersonalDetails />,
        },
        {
            id: "status",
            label: "Order Status",
            icon: <ClipboardCheck />,
            component: <OrderStatus />,
        },
        {
            id: "history",
            label: "Order History",
            icon: <ClockHistory />,
            component: <CustomerOrderHistory />,
        },
    ];

    const activeContent = tabs.find(
        (tab) => tab.id === activeTab
    )?.component;

    return (
        <div className="customer-db">

            {/* HERO */}

            <div className="customer-db-hero">

                <div className="customer-db-hero-overlay"></div>

                <div className="customer-db-hero-content">

                    <div className="customer-db-hero-left">

                        <div className="customer-db-icon-box">
                            <GridFill />
                        </div>

                        <div>
                            <h1>
                                Welcome Back,
                                <span> {user?.name || "Customer"} 👋</span>
                            </h1>

                            <p>
                                Manage your AyamKini account,
                                track fresh chicken orders and
                                view your purchase history.
                            </p>
                        </div>

                    </div>

                    <button
                        className="customer-db-logout-btn"
                        onClick={handleLogout}
                    >
                        <BoxArrowRight />
                        Logout
                    </button>

                </div>
            </div>

            {/* MAIN */}

            <div className="customer-db-container">

                {/* SIDEBAR */}

                <div className="customer-db-sidebar">

                    <div className="customer-db-user-card">

                        <div className="customer-db-avatar">
                            {user?.name?.charAt(0)}
                        </div>

                        <h3>{user?.name}</h3>

                        <span>{user?.email}</span>

                    </div>

                    <div className="customer-db-menu">

                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`customer-db-menu-btn ${
                                    activeTab === tab.id ? "active" : ""
                                }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}

                    </div>

                </div>

                {/* CONTENT */}

                <div className="customer-db-content">

                    <div className="customer-db-content-card">
                        {activeContent}
                    </div>

                </div>

            </div>
        </div>
    );
}

export default CustomerPanel;