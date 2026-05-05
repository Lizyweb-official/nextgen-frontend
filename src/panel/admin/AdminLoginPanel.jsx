import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style-4.css';
import '../../css/style.css';

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function AdminLoginPanel(){

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await fetch(`${API}/api/getAdminLogins`);
        const data = await res.json();

        // Find user by username
        const user = data.find(
        (item) => item.username === formData.username
        );

        if (!user) {
            alert("Username not found");
            return;
        }

        // Check password
        if (user.password === formData.password) {
        alert("You're logged in as admin ✅");
        
            const sendun = async () => {
                    const response = await fetch(`${API}/api/getidbyadminun`, {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                        adminusername: formData.username,
                        }),
                    });
                    

                    const data = await response.json();
                    login({
                        id: data.userId ,
                        name: data.userName,
                        usertype:"admin"
                    });
                    navigate("/admin-db");
                
                };
                sendun();



        
        // Optional: store login
        localStorage.setItem("admin", JSON.stringify(user));
        } else {
        alert("Incorrect password ❌");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Server error");
    }
};

    return(
        <>
             <div className="admin-login-panel-container">
                <div className="admin-login-panel-form">
                    <div className="admin-login-panel-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 10c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z" />
                    </svg>
                    </div>
            
                    <h2 className="admin-login-panel-title">Admin Portal</h2>
                    <p className="admin-login-panel-sub">Sign in to your admin account</p>
            
                    <form onSubmit={handleSubmit}>
                    <div className="admin-login-panel-field">
                        <label className="admin-login-panel-label" htmlFor="username">Username</label>
                        <input
                        id="username"
                        className="admin-login-panel-input"
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        />
                    </div>
            
                    <div className="admin-login-panel-field">
                        <label className="admin-login-panel-label" htmlFor="password">Password</label>
                        <input
                        id="password"
                        className="admin-login-panel-input"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        />
                    </div>
            
                    <button type="submit" className="admin-login-panel-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 3h6v18h-6M10 17l5-5-5-5M15 12H3" />
                        </svg>
                        Sign in
                    </button>
                    </form>
            
                    <div className="admin-login-panel-footer">
                    <span className="admin-login-panel-dot" />
                    Secure admin access
                    </div>
                </div>
                </div>
        </>
    );
}

export default AdminLoginPanel;