import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import {useAuth} from "../context/AuthContext";
import { useNavigate , Link } from 'react-router-dom';
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
        navigate("/");
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
        <div className="customer-panel-main-db-tabs-shell">

        {/* Top bar */}
        <div className="customer-panel-main-db-tabs-topbar">
          <div className="customer-panel-main-db-tabs-brand">
            
            <span className="customer-panel-main-db-tabs-brand-name">
              Ayam<span>Kini</span>
            </span>
          </div>
          <Link to="/Shop" className="customer-panel-main-db-tabs-avatar">Continue Shopping<i className="bi bi-arrow-down-right-circle-fill cs-icon"></i></Link>
        </div>

        {/* Body */}
        <div className="customer-panel-main-db-tabs-body">

          {/* Sidebar */}
          <div className="customer-panel-main-db-tabs-sidebar">
            <p className="customer-panel-main-db-tabs-nav-section">Main</p>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`customer-panel-main-db-tabs-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={`ti ${tab.icon}`} aria-hidden="true" />
                {tab.label}
                {activeTab === tab.id && <span className="customer-panel-main-db-tabs-dot" />}
              </button>
            ))}
            <div className="customer-panel-main-db-tabs-sidebar-footer">
              <button className="customer-panel-main-db-tabs-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="customer-panel-main-db-tabs-content">
            <div className="customer-panel-main-db-tabs-pane">
              {activeContent}
            </div>
          </div>

        </div>
      </div>
    );
}

export default CustomerPanel;