import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style.css';

import {useAuth} from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { useState , useEffect } from "react";

import PersonalDetails from './customer/PersonalDetails';

function CustomerPanel(){
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("details");

    if (user) {
        return (
            <>
                <div className="customer-db-tab-welcome">
                    <h2 className="customer-db-tab-welcome-title">
                        Hi {user.name} 👋
                    </h2>
                    <p className="customer-db-tab-welcome-subtitle">
                        Welcome to AyamKini
                    </p>
                </div>

                 <div className="customer-db-tab-container">

                    {/* Tabs */}
                    <div className="customer-db-tab-header">
                        <button
                        className={
                            activeTab === "details"
                            ? "customer-db-tab-btn active"
                            : "customer-db-tab-btn"
                        }
                        onClick={() => setActiveTab("details")}
                        >
                        Personal Details
                        </button>

                        <button
                        className={
                            activeTab === "status"
                            ? "customer-db-tab-btn active"
                            : "customer-db-tab-btn"
                        }
                        onClick={() => setActiveTab("status")}
                        >
                        Order Status
                        </button>

                        <button
                        className={
                            activeTab === "history"
                            ? "customer-db-tab-btn active"
                            : "customer-db-tab-btn"
                        }
                        onClick={() => setActiveTab("history")}
                        >
                        Order History
                        </button>

                        <button
                        className={
                            activeTab === "setting"
                            ? "customer-db-tab-btn active"
                            : "customer-db-tab-btn"
                        }
                        onClick={() => setActiveTab("setting")}
                        >
                        Settings
                        </button>

                        
                    </div>

                    {/* Content */}
                    <div className="customer-db-tab-content">
                        {activeTab === "details" && (
                        <div className="customer-db-tab-pane">
                            <PersonalDetails/>
                        </div>
                        )}

                        {activeTab === "status" && (
                        <div className="customer-db-tab-pane">
                            <OrderStatus/>
                        </div>
                        )}

                        {activeTab === "history" && (
                        <div className="customer-db-tab-pane">
                            <OrderHistory/>
                        </div>
                        )}

                        {activeTab === "setting" && (
                        <div className="customer-db-tab-pane">
                            <Settings/>
                        </div>
                        )}

                    </div>

                    </div>
            </>)
    } else {
        return <h1>Please login</h1>;
    }
}





function OrderStatus(){
    return(
        <>
            <h2>Order Status</h2>
            <p>Show current orders here...</p>
        </>
    );
}

function OrderHistory(){
    return(
        <>
            <h2>Order History</h2>
            <p>Show past orders here...</p>
        </>
    );
}

function Settings(){
    const { logout } = useAuth();
    return(
        <>
            <button className="customer-db-tab-logout-btn" onClick={logout}>Logout</button>
        </>
    );
}


export default CustomerPanel;