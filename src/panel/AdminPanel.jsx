import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import logo from '../media/Website-Images/images-1/admin-logo.jpg';

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
    <div className="admin-db-container">

      {/* SIDEBAR */}
      <div className="admin-db-sidebar">
        
        {/* LOGO */}
        <div className="admin-db-logo">
          <Link to="/"><img className='admin-db-logo-inside' src={logo} /></Link>
        </div>

        {/* MENU */}
        <div className="admin-db-menu">
         <button 
            className={`admin-db-menu-btn ${activeTab === "media" ? "active" : ""}`}
            onClick={() => setActiveTab("media")}
          >
            <i className="bi bi-image menu-icon"></i>
            <span className="menu-text">Media</span>
          </button>

          <button 
            className={`admin-db-menu-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <i className="bi bi-box-seam menu-icon"></i>
            <span className="menu-text">Products</span>
          </button>

          <button 
            className={`admin-db-menu-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <i className="bi bi-people menu-icon"></i>
            <span className="menu-text">Users</span>
          </button>

          <button 
            className={`admin-db-menu-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <i className="bi bi-cart menu-icon"></i>
            <span className="menu-text">Orders</span>
          </button>

          <button 
            className={`admin-db-menu-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <i className="bi bi-gear menu-icon"></i>
            <span className="menu-text">Settings</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="admin-db-main">
        {renderContent()}
      </div>

    </div>
  );
}

export default AdminPanel