import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style-4.css';
import '../../css/style.css';

import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

function PersonalDetails() {

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

    const [showModal, setShowModal] = useState(false);

    const [editData, setEditData] = useState({
        name: "",
        contact_Number: "",
        street: "",
        city: "",
        district: "",
        state: "",
        pincode: "",
        email_Address: ""
    });

    /* =========================================
       FETCH USER DETAILS
    ========================================= */

    useEffect(() => {

        if (!user?.id) return;

        const fetchUserDetails = async () => {

            try {

                const response = await fetch(`${API}/api/getuserdetailsbyuid`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        uid: user.id,
                    }),
                });

                const data = await response.json();

                if (data?.message) return;

                const formattedData = {
                    name: data.name || "",
                    contact_Number: data.contactNumber || "",
                    street: data.street || "",
                    city: data.city || "",
                    district: data.district || "",
                    state: data.state || "",
                    pincode: data.pincode || "",
                    email_Address: data.emailAddress || ""
                };

                setUserData(formattedData);

            } catch (err) {

                console.error(err);

            }

        };

        fetchUserDetails();

    }, [user?.id]);

    /* =========================================
       OPEN MODAL
    ========================================= */

    const handleEditClick = () => {

        setEditData(userData);
        setShowModal(true);

    };

    /* =========================================
       HANDLE CHANGE
    ========================================= */

    const handleChange = (e) => {

        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });

    };

    /* =========================================
       SAVE USER DETAILS
    ========================================= */

    const handleSave = async () => {

        try {

            const checkRes = await fetch(`${API}/api/getalluserdetails`);
            const checkData = await checkRes.json();

            const userExists = checkData.some(
                (item) => item.customer_id === user.id
            );

            let response;

            /* =========================
               UPDATE USER
            ========================= */

            if (userExists) {

                response = await fetch(`${API}/api/updateuserdetails`, {
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

            /* =========================
               ADD USER
            ========================= */

            else {

                response = await fetch(`${API}/api/adduserdetailsbycusid`, {
                    method: "POST",
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

            console.log(data.message);

            setUserData(editData);

            setShowModal(false);

        } catch (error) {

            console.error("Error:", error);

        }

    };

    return (
        <>

            <div className="user-details-section-container">

                {/* =========================
                    TITLE
                ========================= */}

                <h2 className="user-details-section-title">
                    Customer Details
                </h2>

                {/* =========================
                    DETAILS GRID
                ========================= */}

                <div className="user-details-section-details-grid">

                    <div className="user-details-section-item">
                        <b>Name</b>
                        {userData.name}
                    </div>

                    <div className="user-details-section-item">
                        <b>Contact</b>
                        {userData.contact_Number}
                    </div>

                    <div className="user-details-section-item">
                        <b>Email</b>
                        {userData.email_Address}
                    </div>

                    <div className="user-details-section-item">
                        <b>Street</b>
                        {userData.street}
                    </div>

                    <div className="user-details-section-item">
                        <b>City</b>
                        {userData.city}
                    </div>

                    <div className="user-details-section-item">
                        <b>District</b>
                        {userData.district}
                    </div>

                    <div className="user-details-section-item">
                        <b>State</b>
                        {userData.state}
                    </div>

                    <div className="user-details-section-item">
                        <b>Pincode</b>
                        {userData.pincode}
                    </div>

                </div>

                {/* =========================
                    EDIT BUTTON
                ========================= */}

                <button
                    className="user-details-section-edit-btn"
                    onClick={handleEditClick}
                >
                    Edit Details
                </button>

                {/* =========================
                    MODAL
                ========================= */}

                {
                    showModal && (

                        <div className="user-details-section-modal-overlay">

                            <div className="user-details-section-modal-box">

                                <h3 className="user-details-section-modal-title">
                                    Edit Details
                                </h3>

                                {/* =========================
                                    FORM CONTAINER
                                ========================= */}

                                <div className="user-details-section-form-container">

                                    {/* ROW 1 */}

                                    <div className="user-details-section-form-row">

                                        <input
                                            className="user-details-section-input"
                                            name="name"
                                            value={editData.name}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                        />

                                        <input
                                            className="user-details-section-input"
                                            name="contact_Number"
                                            value={editData.contact_Number}
                                            onChange={handleChange}
                                            placeholder="Phone Number"
                                        />

                                        <input
                                            className="user-details-section-input"
                                            name="email_Address"
                                            value={editData.email_Address}
                                            onChange={handleChange}
                                            placeholder="Email Address"
                                        />

                                    </div>

                                    {/* ROW 2 */}

                                    <div className="user-details-section-form-row">

                                        <input
                                            className="user-details-section-input"
                                            name="street"
                                            value={editData.street}
                                            onChange={handleChange}
                                            placeholder="Street Address"
                                        />

                                        <input
                                            className="user-details-section-input"
                                            name="city"
                                            value={editData.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                        />

                                        <input
                                            className="user-details-section-input"
                                            name="district"
                                            value={editData.district}
                                            onChange={handleChange}
                                            placeholder="District"
                                        />

                                    </div>

                                    {/* ROW 3 */}

                                    <div className="user-details-section-form-row">

                                        <input
                                            className="user-details-section-input"
                                            name="state"
                                            value={editData.state}
                                            onChange={handleChange}
                                            placeholder="State"
                                        />

                                        <input
                                            className="user-details-section-input"
                                            name="pincode"
                                            value={editData.pincode}
                                            onChange={handleChange}
                                            placeholder="Pincode"
                                        />

                                    </div>

                                </div>

                                {/* =========================
                                    BUTTONS
                                ========================= */}

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

                    )
                }

            </div>

        </>
    );
}

export default PersonalDetails;