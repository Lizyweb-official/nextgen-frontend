import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style-4.css';
import '../../css/style.css';

import React, { useState , useEffect } from "react";

function UserAccountManagement(){

    const [activeTab, setActiveTab] = useState("customers");

    return(
        <>
            <div className="admin-db-user-manage-container">
      
                {/* Tabs Header */}
                <div className="admin-db-user-manage-header">
                    <button
                    className={`admin-db-user-manage-btn ${
                        activeTab === "customers" ? "admin-db-user-manage-active" : ""
                    }`}
                    onClick={() => setActiveTab("customers")}
                    >
                    Customers Accounts
                    </button>

                    <button
                    className={`admin-db-user-manage-btn ${
                        activeTab === "delivery" ? "admin-db-user-manage-active" : ""
                    }`}
                    onClick={() => setActiveTab("delivery")}
                    >
                    Delivery Partner Accounts
                    </button>
                </div>

                {/* Tabs Content */}
                <div className="admin-db-user-manage-content">
                    
                    {activeTab === "customers" && (
                    <div className="admin-db-user-manage-panel">
                        <CustomerAccountManage/>
                    </div>
                    )}

                    {activeTab === "delivery" && (
                    <div className="admin-db-user-manage-panel">
                        <DeliveryPartnerAccountManage/>
                    </div>
                    )}

                </div>
            </div>
        </>
    )
}

function CustomerAccountManage(){

    const [users, setUsers] = useState([]);
    const [showPassword, setShowPassword] = useState({});

    const [searchBy, setSearchBy] = useState("id");
    const [searchValue, setSearchValue] = useState("");

    const [loading, setLoading] = useState(false);

    // Fetch data
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/getallcustomerwithdetails");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Delete user
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Delete this user?");
        if (!confirmDelete) return;

        try {
        const res = await fetch(`http://localhost:5000/api/deleteuserbyid/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            setUsers(users.filter((u) => u.id !== id));
        }
        } catch (err) {
        console.error(err);
        }
    };

    // Toggle password visibility
    const togglePassword = (id) => {
        setShowPassword((prev) => ({
        ...prev,
        [id]: !prev[id],
        }));
    };

    const filteredUsers = users.filter((user) => {
        if (!searchValue) return true;

        const value = user[searchBy];

        if (!value) return false;

        return value.toString().toLowerCase().includes(searchValue.toLowerCase());
    });

    return (
        <>

        <div className="admin-db-customer-manage-search-container">
    
            <select
                className="admin-db-customer-manage-search-select"
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value)}
            >
                <option value="id">ID</option>
                <option value="username">Username</option>
                <option value="name">Name</option>
                <option value="phone">Phone</option>
                <option value="email_address">Email</option>
                <option value="city">City</option>
            </select>

            <input
                type="text"
                placeholder={`Search by ${searchBy}...`}
                className="admin-db-customer-manage-search-input"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />

        </div>



        <button
            className="admin-db-customer-manage-refresh-btn"
            onClick={fetchUsers}
            disabled={loading}
        >
            {loading ? "Refreshing..." : "🔄 Refresh"}
        </button>



        <div className="admin-db-customer-manage-table-container">
        <h2 className="admin-db-customer-manage-table-title">
            Customer Full Details
        </h2>

        <div className="admin-db-customer-manage-table-wrapper">
            <table className="admin-db-customer-manage-table-main">
            <thead>
                <tr>
                <th>ID</th>
                <th>Phone</th>
                <th>Username</th>
                <th>Password</th>
                {/* <th>UD ID</th> */}
                {/* <th>Customer ID</th> */}
                <th>Name</th>
                <th>Contact Number</th>
                <th>Street</th>
                <th>City</th>
                <th>District</th>
                <th>State</th>
                <th>Pincode</th>
                <th>Email</th>
                <th>Action</th>
                </tr>
            </thead>

            <tbody>
                {filteredUsers.map((user) =>  (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.phone}</td>
                    <td>{user.username}</td>

                    {/* Password column */}
                    <td>
                        

                     {user.id !== 1 && (
                        <>
                        <span className="admin-db-customer-manage-table-password">
                            {showPassword[user.id] ? user.password : "••••••••"}
                        </span>

                        <button
                            className="admin-db-customer-manage-table-show-btn"
                            onClick={() => togglePassword(user.id)}
                        >
                            {showPassword[user.id] ? "Hide" : "Show"}
                        </button>
                        </>
                    )}
                                        
                    </td>

                    {/* <td>{user.ud_id ?? "-"}</td> */}
                    {/* <td>{user.customer_id ?? "-"}</td> */}

                    <td>{user.name ?? "-"}</td>
                    <td>{user.contact_number ?? "-"}</td>
                    <td>{user.street ?? "-"}</td>
                    <td>{user.city ?? "-"}</td>
                    <td>{user.district ?? "-"}</td>
                    <td>{user.state ?? "-"}</td>
                    <td>{user.pincode ?? "-"}</td>
                    <td>{user.email_address ?? "-"}</td>

                    <td>  
                        {user.id !== 1 && (
                            <button
                            className="admin-db-customer-manage-table-delete-btn"
                            onClick={() => handleDelete(user.id)}
                            >
                            Delete
                            </button>
                        )}                    
                    </td>

                </tr>
                ))}

            </tbody>
            </table>

        </div>
        </div>
    </>
    );
}


function DeliveryPartnerAccountManage(){

    const [users, setUsers] = useState([]);
    const [showPassword, setShowPassword] = useState({});

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        uname: "",
        pass: "",
        phone: ""
    });

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    // Fetch data
    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/getalldp");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } 
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Toggle password visibility
    const togglePassword = (id) => {
        setShowPassword((prev) => ({
        ...prev,
        [id]: !prev[id],
        }));
    };


    // Delete user
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Delete this user?");
        if (!confirmDelete) return;

        try {
        const res = await fetch(`http://localhost:5000/api/deletedpbyid/${id}`, {
            method: "DELETE"
        });

        if (res.ok) {
            setUsers(users.filter((u) => u.id !== id));
        }
        } catch (err) {
        console.error(err);
        }
    };



    // create a new dp
     const handleSubmit = async () => {
        try {
        const res = await fetch("http://localhost:5000/api/createdeliveryp", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        alert(data.message);

        // reset form
        setFormData({ uname: "", pass: "", phone: "" });
        setShowForm(false);
        fetchUsers();

        } catch (err) {
        console.error(err);
        alert("Error creating delivery partner");
        }
    };
     
    return(
        <>
            <div className="admin-db-dp-manage-container">

                {/* Add Button */}
                <button
                    className="admin-db-dp-manage-add-btn"
                    onClick={() => setShowForm(!showForm)}
                >
                    + Add Delivery Partner
                </button>

                {/* Form */}
                {showForm && (
                    <div className="admin-db-dp-manage-form-box">

                    <h3 className="admin-db-dp-manage-title">
                        Create Delivery Partner
                    </h3>

                    <input
                        className="admin-db-dp-manage-input"
                        type="text"
                        name="uname"
                        placeholder="Username"
                        value={formData.uname}
                        onChange={handleChange}
                    />

                    <input
                        className="admin-db-dp-manage-input"
                        type="password"
                        name="pass"
                        placeholder="Password"
                        value={formData.pass}
                        onChange={handleChange}
                    />

                    <input
                        className="admin-db-dp-manage-input"
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    <button
                        className="admin-db-dp-manage-submit-btn"
                        onClick={handleSubmit}
                    >
                        Create Delivery Partner
                    </button>

                    </div>
                )}

                </div>






            
        <div className="admin-db-customer-manage-table-container">
        <h2 className="admin-db-customer-manage-table-title">
            Customer Full Details
        </h2>

        <div className="admin-db-customer-manage-table-wrapper">
            <table className="admin-db-customer-manage-table-main">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Phone</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                {users.map((user) =>  (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.phonenumber}</td>
                    <td>{user.username}</td>

                    <td>
                        <>
                            <span className="admin-db-customer-manage-table-password">
                                {showPassword[user.id] ? user.password : "••••••••"}
                            </span>

                            <button
                                className="admin-db-customer-manage-table-show-btn"
                                onClick={() => togglePassword(user.id)}
                            >
                                {showPassword[user.id] ? "Hide" : "Show"}
                            </button>
                        </>
                    </td>

                    <td>          
                            <button
                            className="admin-db-customer-manage-table-delete-btn"
                            onClick={() => handleDelete(user.id)}
                            >
                            Delete
                            </button>                  
                    </td>

                </tr>
                ))}

            </tbody>
            </table>

        </div>
        </div>
           
        </>
    );
}

export default UserAccountManagement;