import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style-4.css';
import '../../css/style.css';

import React, { useState , useEffect} from "react";
import { useAuth } from "../../context/AuthContext";
import { Link,useNavigate } from "react-router-dom";

import { showWebMessage } from "../../context/webMessageHandler";


const API = import.meta.env.VITE_API_URL;

function UserLoginPanel(){
    const [users, setUsers] = useState([]);
    const [activeForm, setActiveForm] = useState("login");
    const { login } = useAuth();
    const navigate = useNavigate();

    const [DpLoginData, setDpLoginData] = useState({
        username: "",
        password: "",
    });

    const [otpSent, setOtpSent] = useState(false);  //for testing use value true
    const [otpVerified, setOtpVerified] = useState(false); //for testing use value true
    const [countdown, setCountdown] = useState(0);

    const [registerOtpSent, setRegisterOtpSent] = useState(false); //for testing use value true
    const [registerOtpVerified, setRegisterOtpVerified] = useState(false); //for testing use value true
    const [registerCountdown, setRegisterCountdown] = useState(0);

    

    useEffect(() => {
        let timer;

        if (countdown > 0) {
            timer = setTimeout(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }

        return () => clearTimeout(timer);
    }, [countdown]);

    useEffect(() => {
        let timer;

        if (registerCountdown > 0) {
            timer = setTimeout(() => {
                setRegisterCountdown((prev) => prev - 1);
            }, 1000);
        }

        return () => clearTimeout(timer);
    }, [registerCountdown]);

    const [loginData, setLoginData] = useState({
        phone: "",
        otp: "",
    });

    const [registerData, setRegisterData] = useState({
        phone: "",
        otp: "",
    });

    const handleRegisterSubmit = async (e) => {
    e.preventDefault();

        if (!registerOtpVerified) {
            showWebMessage("Please verify OTP first");
            return;
        }

            try {
                // 1️⃣ Get all users from backend
                const res = await fetch(`${API}/api/customerlogins`);
                const users = await res.json();

                // 2️⃣ Check if phone already exists
                const userExists = users.find(
                    (user) => user.phone === registerData.phone
                );

                if (userExists) {
                    showWebMessage("You are already registered, try logging in");
                    return;
                }

                // 3️⃣ If new user → send data to backend (POST)
                const createRes = await fetch(`${API}/api/addcustomer`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(registerData),
                });

                const newUser = await createRes.json();

                const sendPhone = async () => {
                    const response = await fetch(`${API}/api/getidbyphonecustomer`, {
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

                     // 6️⃣ Create empty customerdetails row
                    await fetch(`${API}/api/adduserdetailsbycusid`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            uid: data.userId,
                        }),
                    });

                    login({
                    id: data.userId ,
                    phone: registerData.phone,
                    usertype:"customer"
                });
                
                };
                sendPhone();
                

                showWebMessage("Registration successful");
                navigate("/CustomerPanel");

            } catch (error) {
                console.error("Error:", error);
                showWebMessage("Something went wrong");
            }
        };


        const handleLoginSubmit = async (e) => {
        e.preventDefault();


        if (!otpVerified) {
            showWebMessage("Please verify OTP first");
            return;
        }


        try {
            const res = await fetch(`${API}/api/customerlogins`);
            const users = await res.json();

            // Check if phone exists
            const user = users.find(
                (u) => u.phone === loginData.phone
            );
            
            if (!user) {
                showWebMessage("User not registered");
                return;
            }

            // Check password
            // if (Otp === loginData.password) {
                showWebMessage("Login successful ! ");

                 const sendPhone = async () => {
                    const response = await fetch(`${API}/api/getidbyphonecustomer`, {
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
                        phone: data.phone,
                        usertype:"customer"
                    });
                    navigate("/CustomerPanel");
                
                };
                sendPhone();


            // } else {
                // showWebMessage("Incorrect otp !!");
            // }


        } catch (error) {
            console.error("Error:", error);
            showWebMessage("Server error");
        }
    };



    const handleDpLoginSubmit = async (e) => {
        e.preventDefault();
            try {
            const res = await fetch(`${API}/api/getalldp`);
            const users = await res.json();

            // Check if phone exists
            const user = users.find(
                (u) => u.username === DpLoginData.username
            );

            if (!user) {
                showWebMessage("User not registered");
                return;
            }

            // Check password
            if (user.password === DpLoginData.password) {
                showWebMessage("Login successful !!");

                 const sendPhone = async () => {
                    const response = await fetch(`${API}/api/getDpByUn`, {
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
                showWebMessage("Incorrect password !!");
            }


        } catch (error) {
            console.error("Error:", error);
            showWebMessage("Server error");
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

    const sendOtp = async () => {

        if (otpSent) return;

        if (!loginData.phone) {
            showWebMessage("Enter phone number first");
            return;
        }

        /* PHONE VALIDATION */
        if (!/^\d{10}$/.test(loginData.phone)) {
            showWebMessage("Enter a valid phone number");
            return;
        }

        try {

            const response = await fetch(`${API}/verify/sendOtp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone: loginData.phone,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setOtpSent(true);
                setCountdown(30);
                showWebMessage("OTP sent successfully");
            }

        } catch (error) {
            console.error(error);
            showWebMessage("Failed to send OTP");
        }
    };

    const verifyOtp = async () => {

        if (!loginData.otp) {
            showWebMessage("Enter OTP");
            return;
        }

        try {

            const response = await fetch(`${API}/verify/verifyOtpfWeb`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone: loginData.phone,
                    otp: loginData.otp,
                }),
            });

            const data = await response.json();

            if (data.success) {

                setOtpVerified(true);
                showWebMessage("OTP Verified");

            } else {

                showWebMessage("Invalid OTP");

            }

        } catch (error) {

            console.error(error);
            showWebMessage("Verification failed");

        }
    };

    const sendRegisterOtp = async () => {

        if (!registerData.phone) {
            showWebMessage("Enter phone number first");
            return;
        }

        try {

            const response = await fetch(`${API}/verify/sendOtp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone: registerData.phone,
                }),
            });

            const data = await response.json();

            if (data.success) {

                setRegisterOtpSent(true);
                setRegisterOtpVerified(false);
                setRegisterCountdown(30);

                showWebMessage("OTP sent successfully");
            }

        } catch (error) {

            console.error(error);
            showWebMessage("Failed to send OTP");

        }
    };

    const verifyRegisterOtp = async () => {

        if (!registerData.otp) {
            showWebMessage("Enter OTP");
            return;
        }

        try {

            const response = await fetch(`${API}/verify/verifyOtpfWeb`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone: registerData.phone,
                    otp: registerData.otp,
                }),
            });

            const data = await response.json();

            if (data.success) {

                setRegisterOtpVerified(true);
                showWebMessage("OTP Verified");

            } else {

                showWebMessage("Invalid OTP");

            }

        } catch (error) {

            console.error(error);
            showWebMessage("Verification failed");

        }
    };



    return(
        <>
             <div className="user-loginf-container">

                {/* LOGIN */}
                {activeForm === "login" && (
                    <div className="user-loginf-card">
                        <h2 className="user-loginf-title">User Login</h2>
                        <form onSubmit={handleLoginSubmit}>

                            <div className="login-page-login-func-wrapper">

                                {/* Line 1 — Phone */}
                                <div className="login-page-login-func-label">Phone number</div>
                                <div className="login-page-login-func-row">
                                    <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={loginData.phone}
                                    onChange={handleLoginChange}
                                    className="login-page-login-func-input"
                                    required
                                    />
                                    <button
                                    type="button"
                                    className="login-page-login-func-btn login-page-login-func-btn-primary"
                                    onClick={sendOtp}
                                    disabled={otpVerified}
                                    >
                                    {otpSent ? "Resend" : "Get OTP"}
                                    </button>
                                </div>

                                {/* Resend countdown */}
                                {otpSent && !otpVerified && (
                                    <div className="login-page-login-func-resend">
                                    {countdown > 0 ? (
                                        <span>Resend OTP in {countdown}s</span>
                                    ) : (
                                        <button
                                        type="button"
                                        className="login-page-login-func-resend-btn"
                                        onClick={sendOtp}
                                        >
                                        Resend OTP
                                        </button>
                                    )}
                                    </div>
                                )}

                                {/* Line 2 — OTP */}
                                <div className="login-page-login-func-label" style={{ visibility: otpSent ? "visible" : "hidden" }}>
                                    Enter OTP
                                </div>
                                <div
                                    className="login-page-login-func-row"
                                    style={{ opacity: otpSent ? 1 : 0.4, pointerEvents: otpSent ? "auto" : "none", transition: "opacity 0.2s" }}
                                >
                                    <input
                                    type="text"
                                    name="otp"
                                    placeholder="6-digit OTP"
                                    value={loginData.otp}
                                    onChange={handleLoginChange}
                                    className="login-page-login-func-input"
                                    maxLength={6}
                                    disabled={otpVerified}
                                    required
                                    />

                                    {otpVerified ? (
                                    <button
                                        type="button"
                                        className="login-page-login-func-btn login-page-login-func-btn-verified"
                                        disabled
                                    >
                                        Verified ✓
                                    </button>
                                    ) : (
                                    <button
                                        type="button"
                                        className="login-page-login-func-btn login-page-login-func-btn-primary"
                                        onClick={verifyOtp}
                                        disabled={!otpSent}
                                    >
                                        Verify
                                    </button>
                                    )}
                                </div>

                                </div>
                           
                                {/* <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    className="user-loginf-input"
                                    required
                                /> */}

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
                            <div className="login-page-login-func-wrapper">

                            {/* Line 1 — Phone */}
                            <div className="login-page-login-func-label">Phone number</div>
                            <div className="login-page-login-func-row">
                                <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={registerData.phone}
                                onChange={handleRegisterChange}
                                className="login-page-login-func-input"
                                required
                                />
                                <button
                                type="button"
                                className="login-page-login-func-btn login-page-login-func-btn-primary"
                                onClick={sendRegisterOtp}
                                disabled={registerOtpVerified}
                                >
                                {registerOtpSent ? "Resend" : "Get OTP"}
                                </button>
                            </div>

                            {/* Resend countdown */}
                            {registerOtpSent && !registerOtpVerified && (
                                <div className="login-page-login-func-resend">
                                {registerCountdown > 0 ? (
                                    <span>Resend OTP in {registerCountdown}s</span>
                                ) : (
                                    <button
                                    type="button"
                                    className="login-page-login-func-resend-btn"
                                    onClick={sendRegisterOtp}
                                    >
                                    Resend OTP
                                    </button>
                                )}
                                </div>
                            )}

                            {/* Line 2 — OTP */}
                            <div
                                className="login-page-login-func-label"
                                style={{ visibility: registerOtpSent ? "visible" : "hidden" }}
                            >
                                Enter OTP
                            </div>
                            <div
                                className="login-page-login-func-row"
                                style={{
                                opacity: registerOtpSent ? 1 : 0.4,
                                pointerEvents: registerOtpSent ? "auto" : "none",
                                transition: "opacity 0.2s",
                                }}
                            >
                                <input
                                type="text"
                                name="otp"
                                placeholder="6-digit OTP"
                                value={registerData.otp}
                                onChange={handleRegisterChange}
                                className="login-page-login-func-input"
                                maxLength={6}
                                disabled={registerOtpVerified}
                                required
                                />

                                {registerOtpVerified ? (
                                <button
                                    type="button"
                                    className="login-page-login-func-btn login-page-login-func-btn-verified"
                                    disabled
                                >
                                    Verified ✓
                                </button>
                                ) : (
                                <button
                                    type="button"
                                    className="login-page-login-func-btn login-page-login-func-btn-primary"
                                    onClick={verifyRegisterOtp}
                                    disabled={!registerOtpSent}
                                >
                                    Verify
                                </button>
                                )}
                            </div>

                            </div>
                            
                            {/* <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={registerData.password}
                                onChange={handleRegisterChange}
                                className="user-loginf-input"
                                required
                            /> */}

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
 
            <Link to="/" className="floating-home-btn">
                <i className="bi bi-house-door-fill"></i>
            </Link>
      
        </>
    );
}

export default UserLoginPanel;