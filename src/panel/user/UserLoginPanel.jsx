import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style.css';

import React, { useState , useEffect} from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function UserLoginPanel(){
    const [users, setUsers] = useState([]);
    const [activeForm, setActiveForm] = useState("login");
    const { login } = useAuth();
    const navigate = useNavigate();

    const [DpLoginData, setDpLoginData] = useState({
        username: "",
        password: "",
    });

    const [loginData, setLoginData] = useState({
        phone: "",
        password: "",
    });

    const [registerData, setRegisterData] = useState({
        phone: "",
        username: "",
        password: "",
    });



    const handleRegisterSubmit = async (e) => {
    e.preventDefault();

            try {
                // 1️⃣ Get all users from backend
                const res = await fetch("http://localhost:5000/api/customerlogins");
                const users = await res.json();

                // 2️⃣ Check if phone already exists
                const userExists = users.find(
                    (user) => user.phone === registerData.phone
                );

                if (userExists) {
                    alert("You are already registered, try logging in");
                    return;
                }

                // 3️⃣ If new user → send data to backend (POST)
                const createRes = await fetch("http://localhost:5000/api/addcustomer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(registerData),
                });

                const newUser = await createRes.json();

                const sendPhone = async () => {
                    const response = await fetch("http://localhost:5000/api/getidbyphonecustomer", {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                        phone: registerData.phone,
                        }),
                    });
                    console.log("sendphone program");

                    const data = await response.json();
                    login({
                    id: data.userId ,
                    name: registerData.username,
                    usertype:"customer"
                });
                
                };
                sendPhone();
                

                alert("Registration successful 🎉");
                navigate("/CustomerPanel");

            } catch (error) {
                console.error("Error:", error);
                alert("Something went wrong");
            }
        };



        const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/customerlogins");
            const users = await res.json();

            // Check if phone exists
            const user = users.find(
                (u) => u.phone === loginData.phone
            );

            if (!user) {
                alert("User not registered");
                return;
            }

            // Check password
            if (user.password === loginData.password) {
                alert("Login successful ✅");

                 const sendPhone = async () => {
                    const response = await fetch("http://localhost:5000/api/getidbyphonecustomer", {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                        phone: loginData.phone,
                        }),
                    });
                    

                    const data = await response.json();
                    login({
                        id: data.userId ,
                        name: data.userName,
                        usertype:"customer"
                    });
                    navigate("/CustomerPanel");
                
                };
                sendPhone();


            } else {
                alert("Incorrect password ❌");
            }


        } catch (error) {
            console.error("Error:", error);
            alert("Server error");
        }
    };



    const handleDpLoginSubmit = async (e) => {
        e.preventDefault();
            try {
            const res = await fetch("http://localhost:5000/api/getalldp");
            const users = await res.json();

            // Check if phone exists
            const user = users.find(
                (u) => u.username === DpLoginData.username
            );

            if (!user) {
                alert("User not registered");
                return;
            }

            // Check password
            if (user.password === DpLoginData.password) {
                alert("Login successful ✅");

                 const sendPhone = async () => {
                    const response = await fetch("http://localhost:5000/api/getDpByUn", {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                        dpname: DpLoginData.username,
                        }),
                    });
                    

                    const data = await response.json();
                    login({
                        id: data.userId ,
                        name: data.userName,
                        usertype:"dp"
                    });
                    navigate("/Delivery-login");
                
                };
                sendPhone();


            } else {
                alert("Incorrect password ❌");
            }


        } catch (error) {
            console.error("Error:", error);
            alert("Server error");
        }
    };










    

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };
   
    const handleDpLoginChange = (e) => {
        setDpLoginData({ ...DpLoginData, [e.target.name]: e.target.value });
    };
   

    return(
        <>
             <div className="user-loginf-container">

                {/* LOGIN */}
                {activeForm === "login" && (
                    <div className="user-loginf-card">
                        <h2 className="user-loginf-title">User Login</h2>
                        <form onSubmit={handleLoginSubmit}>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={loginData.phone}
                                onChange={handleLoginChange}
                                className="user-loginf-input"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                className="user-loginf-input"
                                required
                            />
                            <button className="user-loginf-button">Login</button>
                        </form>

                        <p style={{ marginTop: "10px", color:"white"}} >
                            New user? <span style={{ marginTop: "10px", cursor: "pointer", color:"var(--brand)" }} onClick={() => setActiveForm("register")}>Register here</span>
                        </p>

                        <div className="form-delivery-p-swapb-or-section">

                        <div className="form-delivery-p-swapb-divider">
                            <span>OR</span>
                        </div>
                        <div className="form-delivery-p-swapb-delivery-box" >
                            <p className="form-delivery-p-swapb-delivery-text">
                            Are you a delivery partner?
                            </p>
                            <button className="form-delivery-p-swapb-delivery-btn" onClick={() => setActiveForm("delivery")}>
                            Login Here
                            </button>
                        </div>

                        </div>
                    </div>
                )}

                {/* REGISTER */}
                {activeForm === "register" && (
                    <div className="user-loginf-card">
                        <h2 className="user-loginf-title">User Register</h2>
                        <form onSubmit={handleRegisterSubmit}>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={registerData.phone}
                                onChange={handleRegisterChange}
                                className="user-loginf-input"
                                required
                            />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={registerData.username}
                                onChange={handleRegisterChange}
                                className="user-loginf-input"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                className="user-loginf-input"
                                required
                            />
                            <button className="user-loginf-button">Register</button>
                        </form>

                        <p style={{ marginTop: "10px", color:"white" }} >
                            Already have an account? <span style={{ marginTop: "10px", cursor: "pointer", color:"var(--brand)" }} onClick={() => setActiveForm("login")}>Login</span>
                        </p>



                        <div className="form-delivery-p-swapb-or-section">

                        <div className="form-delivery-p-swapb-divider">
                            <span>OR</span>
                        </div>
                        <div className="form-delivery-p-swapb-delivery-box" >
                            <p className="form-delivery-p-swapb-delivery-text">
                            Are you a delivery partner?
                            </p>
                            <button className="form-delivery-p-swapb-delivery-btn" onClick={() => setActiveForm("delivery")}>
                            Login Here
                            </button>
                        </div>

                        </div>
                    </div>
                )}

                {/* DELIVERY PARTNER */}
                {activeForm === "delivery" && (
                    <div className="deliveryp-loginf-card">
                        <p className='deliveryp-loginf-card-subhead'>Are You a Delivery Partner?</p>
                        <h2 className="deliveryp-loginf-title">Login Here</h2>
                        <form onSubmit={handleDpLoginSubmit}>
                            <input
                                type="text"
                                name="username"
                                placeholder="User Name"
                                value={DpLoginData.username}
                                onChange={handleDpLoginChange}
                                className="user-loginf-input"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={DpLoginData.password}
                                onChange={handleDpLoginChange}
                                className="user-loginf-input"
                                required
                            />
                            <button className="deliveryp-loginf-button">Login</button>
                        </form>

                        <p style={{ marginTop: "10px", color:"black", fontWeight:"600" }} >
                            Are you a customer?<span style={{ marginTop: "10px",marginLeft: "4px", color:"black", fontWeight:"600" , backgroundColor:"white" , padding:"4px" , cursor:"pointer" }} onClick={() => setActiveForm("login")}>Login here</span> 
                        </p>
                    </div>
                )}

            </div>
      
        </>
    );
}

export default UserLoginPanel;