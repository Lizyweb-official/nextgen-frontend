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
             <div className="admin-loginf-container">
                <form className="admin-loginf-form" onSubmit={handleSubmit}>
                    <h2 className="admin-loginf-title">Admin Login</h2>

                    <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="admin-loginf-input"
                    required
                    />

                    <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="admin-loginf-input"
                    required
                    />

                    <button type="submit" className="admin-loginf-button">
                    Login
                    </button>
                </form>
                </div>
        </>
    );
}

export default AdminLoginPanel;