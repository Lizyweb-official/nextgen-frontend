import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';


import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";

import AdminLoginPanel from './admin/AdminLoginPanel';

import UserAccountManagement from './admin/UserAccountManagement';
import AllMedia from './admin/AllMedia';
import ProductManage from './admin/ProductManage';


function AdminPanel(){
    const {user} = useAuth();
    const [activeTab, setActiveTab] = useState("media");

    if (user === null) {
        return <AdminLoginPanel />;
    }
    console.log(user.usertype);
    if(user.usertype !== "admin"){
        return <AdminLoginPanel />;
    }

    const renderContent = () => {
    switch (activeTab) {
      case "media":
        return < AllMedia />;
      case "products":
        return <ProductManage/>;
      case "users":
        return <UserAccountManagement/>;
      case "orders":
        return <div>Order Management</div>;
      case "settings":
        return (
          <div>
            <button className="admin-db-main-tab-logout-btn">Logout</button>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    };

}


    return (
    <div className="admin-db-main-tab-container">
      
      {/* TOP BAR */}
      <div className="admin-db-main-tab-topbar">
        <a href="/" className="admin-db-main-tab-home-link">AyamKini</a>

        <div className="admin-db-main-tab-tabs">
          <button 
            className={`admin-db-main-tab-btn ${activeTab === "media" ? "admin-db-main-tab-active" : ""}`}
            onClick={() => setActiveTab("media")}
          >
            Media
          </button>

          <button 
            className={`admin-db-main-tab-btn ${activeTab === "products" ? "admin-db-main-tab-active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>

          <button 
            className={`admin-db-main-tab-btn ${activeTab === "users" ? "admin-db-main-tab-active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>

          <button 
            className={`admin-db-main-tab-btn ${activeTab === "orders" ? "admin-db-main-tab-active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>

          <button 
            className={`admin-db-main-tab-btn ${activeTab === "settings" ? "admin-db-main-tab-active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="admin-db-main-tab-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPanel