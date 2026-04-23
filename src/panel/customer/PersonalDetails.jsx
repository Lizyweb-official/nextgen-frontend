import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style.css';

import {useAuth} from "../../context/AuthContext"
import { useNavigate } from 'react-router-dom';
import { useState , useEffect } from "react";

function PersonalDetails(){
    const { user } = useAuth();

    const [userData, setUserData] = useState({
    name: "",
    contact_Number: "",
    street: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    email_Address: ""
  });


    useEffect(() => {
        if (!user?.id) return null;

        const sendPhone = async () => {
            try {
            const response = await fetch("http://localhost:5000/api/getuserdetailsbyuid", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                uid: user.id,
                }),
            });

            const data = await response.json();

            // ✅ handle "user not found"
            if (data?.message) {
                return;
            }

            setUserData({
                name: data.name, // use lowercase if you updated backend
                contact_Number: data.contactNumber,
                street: data.street,
                city: data.city,
                district: data.district,
                state: data.state,
                pincode: data.pincode,
                email_Address: data.emailAddress
            });

            } catch (err) {
            console.error(err);
            }
        };

        sendPhone();

        }, [user?.id]);
        


    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(userData);

    const handleEditClick = () => {
        setEditData(userData);
        setShowModal(true);
    };

    const handleChange = (e) => {
        setEditData({
        ...editData,
        [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            // 🔍 Step 1: Get all user details
            const checkRes = await fetch("http://localhost:5000/api/getalluserdetails");
            const checkData = await checkRes.json();

            // 🔎 Step 2: Check if user.id exists in customer_id
            const userExists = checkData.some(
                (item) => item.customer_id === user.id
            );

            let response;

            // 🟢 Step 3: If exists → UPDATE
            if (userExists) {
                response = await fetch("http://localhost:5000/api/updateuserdetails", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        uid: user.id,
                        name: editData.name,
                        contactNumber: editData.contact_Number,
                        street: editData.street,
                        city: editData.city,
                        district: editData.district,
                        state: editData.state,
                        pincode: editData.pincode,
                        emailAddress: editData.email_Address
                    })
                });
            } 
            // 🔵 Step 4: If NOT exists → ADD
            else {
                response = await fetch("http://localhost:5000/api/adduserdetailsbycusid", {
                    method: "POST", // 👈 usually POST for insert
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        uid: user.id,
                        name: editData.name,
                        contactNumber: editData.contact_Number,
                        street: editData.street,
                        city: editData.city,
                        district: editData.district,
                        state: editData.state,
                        pincode: editData.pincode,
                        emailAddress: editData.email_Address
                    })
                });
            }

            const data = await response.json();

            if (data.message) {
                console.log(data.message);
            }

            // ✅ Update UI
            setUserData(editData);

            // ✅ Close modal
            setShowModal(false);

        } catch (error) {
            console.error("Error:", error);
        }
    };

    return(
        <>
             <div className="user-details-section-container">
      
                <h2 className="user-details-section-title">Customer Details</h2>

                <p className="user-details-section-item"><b>Name:</b> {userData.name}</p>
                <p className="user-details-section-item"><b>Contact:</b> {userData.contact_Number}</p>
                <p className="user-details-section-item"><b>Street:</b> {userData.street}</p>
                <p className="user-details-section-item"><b>City:</b> {userData.city}</p>
                <p className="user-details-section-item"><b>District:</b> {userData.district}</p>
                <p className="user-details-section-item"><b>State:</b> {userData.state}</p>
                <p className="user-details-section-item"><b>Pincode:</b> {userData.pincode}</p>
                <p className="user-details-section-item"><b>Email:</b> {userData.email_Address}</p>

                <button 
                    className="user-details-section-edit-btn"
                    onClick={handleEditClick}
                >
                    Edit
                </button>

                {/* Popup Modal */}
                {showModal && (
                    <div className="user-details-section-modal-overlay">
                    <div className="user-details-section-modal-box">
                        <h3 className="user-details-section-modal-title">Edit Details</h3>

                        <input className="user-details-section-input" name="name" value={editData.name} onChange={handleChange} placeholder="Name" />
                        <input className="user-details-section-input" name="contact_Number" value={editData.contact_Number} onChange={handleChange} placeholder="Contact" />
                        <input className="user-details-section-input" name="street" value={editData.street} onChange={handleChange} placeholder="Street" />
                        <input className="user-details-section-input" name="city" value={editData.city} onChange={handleChange} placeholder="City" />
                        <input className="user-details-section-input" name="district" value={editData.district} onChange={handleChange} placeholder="District" />
                        <input className="user-details-section-input" name="state" value={editData.state} onChange={handleChange} placeholder="State" />
                        <input className="user-details-section-input" name="pincode" value={editData.pincode} onChange={handleChange} placeholder="Pincode" />
                        <input className="user-details-section-input" name="email_Address" value={editData.email_Address} onChange={handleChange} placeholder="Email" />

                        <div className="user-details-section-btn-group">
                        <button 
                            className="user-details-section-save-btn"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button 
                            className="user-details-section-cancel-btn"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>
                        </div>

                    </div>
                    </div>
                )}

                </div>
        </>
    );
}


export default PersonalDetails;