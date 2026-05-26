import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style-4.css';
import '../../css/style.css';

import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

const styles = {
    page: {
        minHeight: "100vh",
        background: "#faf9f7",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 16px",
        fontFamily: "'Nunito', sans-serif",
    },
    container: {
        width: "100%",
        maxWidth: "780px",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "32px",
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
    },
    iconCircle: {
        width: "48px",
        height: "48px",
        borderRadius: "14px",
        background: "#c8102e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    iconSvg: {
        width: "24px",
        height: "24px",
        fill: "none",
        stroke: "#fff",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
    },
    title: {
        margin: 0,
        fontSize: "22px",
        fontWeight: "800",
        color: "#1a1a1a",
        letterSpacing: "-0.4px",
    },
    subtitle: {
        margin: 0,
        fontSize: "13px",
        color: "#888",
        fontWeight: "500",
        marginTop: "2px",
    },
    editBtn: {
        display: "flex",
        alignItems: "center",
        gap: "7px",
        background: "#c8102e",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        padding: "10px 20px",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer",
        fontFamily: "'Nunito', sans-serif",
        letterSpacing: "0.2px",
        transition: "background 0.15s",
    },
    card: {
        background: "#fff",
        borderRadius: "20px",
        border: "1px solid #ece9e3",
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        padding: "28px",
    },
    sectionLabel: {
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "1.2px",
        textTransform: "uppercase",
        color: "#c8102e",
        marginBottom: "20px",
    },
    divider: {
        height: "1px",
        background: "#f0ede8",
        margin: "24px 0",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "24px",
        marginBottom: "24px",
    },
    grid2: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
    },
    fieldLabel: {
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.8px",
        textTransform: "uppercase",
        color: "#bbb",
        marginBottom: "6px",
    },
    fieldValue: {
        fontSize: "15px",
        fontWeight: "600",
        color: "#1a1a1a",
        lineHeight: "1.4",
    },
    emptyValue: {
        fontSize: "14px",
        color: "#ccc",
        fontStyle: "italic",
        fontWeight: "400",
    },
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(10,10,10,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
    },
    modal: {
        background: "#fff",
        borderRadius: "24px",
        width: "100%",
        maxWidth: "600px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        overflow: "hidden",
    },
    modalHeader: {
        background: "#c8102e",
        padding: "22px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    modalTitle: {
        margin: 0,
        fontSize: "18px",
        fontWeight: "800",
        color: "#fff",
        letterSpacing: "-0.3px",
    },
    modalClose: {
        background: "rgba(255,255,255,0.2)",
        border: "none",
        borderRadius: "8px",
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#fff",
        fontSize: "18px",
        fontWeight: "700",
        lineHeight: "1",
        fontFamily: "'Nunito', sans-serif",
    },
    modalBody: {
        padding: "24px 28px",
    },
    formSectionTitle: {
        fontSize: "11px",
        fontWeight: "800",
        letterSpacing: "1px",
        textTransform: "uppercase",
        color: "#c8102e",
        marginBottom: "12px",
    },
    formRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        marginBottom: "12px",
    },
    formRow3: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "12px",
    },
    inputWrap: {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    },
    inputLabel: {
        fontSize: "11px",
        fontWeight: "700",
        letterSpacing: "0.6px",
        textTransform: "uppercase",
        color: "#999",
    },
    input: {
        border: "1.5px solid #e8e5df",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#1a1a1a",
        fontFamily: "'Nunito', sans-serif",
        outline: "none",
        background: "#faf9f7",
        transition: "border-color 0.15s",
    },
    inputReadonly: {
        border: "1.5px solid #e8e5df",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#888",
        fontFamily: "'Nunito', sans-serif",
        outline: "none",
        background: "#f0ede8",
        cursor: "not-allowed",
    },
    divider: {
        height: "1px",
        background: "#f0ede8",
        margin: "4px 0 20px",
    },
    btnGroup: {
        display: "flex",
        gap: "10px",
        justifyContent: "flex-end",
        padding: "0 28px 24px",
    },
    saveBtn: {
        background: "#c8102e",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        padding: "11px 28px",
        fontSize: "14px",
        fontWeight: "800",
        cursor: "pointer",
        fontFamily: "'Nunito', sans-serif",
        letterSpacing: "0.2px",
        transition: "background 0.15s",
    },
    cancelBtn: {
        background: "#fff",
        color: "#666",
        border: "1.5px solid #e0ddd7",
        borderRadius: "10px",
        padding: "11px 22px",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer",
        fontFamily: "'Nunito', sans-serif",
        transition: "background 0.15s",
    },
};

const IconUser = () => (
    <svg style={styles.iconSvg} viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
);

const IconEdit = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);

function Field({ label, value }) {
    return (
        <div>
            <div style={styles.fieldLabel}>{label}</div>
            {value
                ? <div style={styles.fieldValue}>{value}</div>
                : <div style={styles.emptyValue}>Not added</div>
            }
        </div>
    );
}

function InputField({ label, name, value, onChange, placeholder }) {
    const [focused, setFocused] = useState(false);
    return (
        <div style={styles.inputWrap}>
            <label style={styles.inputLabel}>{label}</label>
            <input
                style={{
                    ...styles.input,
                    borderColor: focused ? "#c8102e" : "#e8e5df",
                    background: focused ? "#fff" : "#faf9f7",
                }}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
        </div>
    );
}

function PersonalDetails() {

    const { user } = useAuth();

    const [userData, setUserData] = useState({
        name: "", contact_Number: "", street: "",
        city: "", state: "", pincode: "", email_Address: ""
    });

    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    const [editData, setEditData] = useState({
        name: "", contact_Number: "", street: "",
        city: "", state: "", pincode: "", email_Address: ""
    });

    const [locationData, setLocationData] = useState({
        cities: [],
        state: "",
        country: "",
    });

  
    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const res = await fetch(`${API}/api/admin/getallordercity`);
                const data = await res.json();

                const cities = data
                    .filter(d => d.type === "city")
                    .map(d => {
                        const [cityName, pincode] = d.name.split(",");
                        return {
                            id: d.id,
                            name: cityName.trim(),
                            pincode: pincode?.trim() || "",
                        };
                    });

                const stateObj   = data.find(d => d.type === "state");
                const countryObj = data.find(d => d.type === "country");

                setLocationData({
                    cities,
                    state:   stateObj?.name   || "",
                    country: countryObj?.name || "",
                });
            } catch (err) {
                console.error("Failed to fetch location data:", err);
            }
        };
        fetchLocationData();
    }, []);

    /* =========================================
       FETCH USER DETAILS
    ========================================= */

    useEffect(() => {
        if (!user?.id) return;
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`${API}/api/getuserdetailsbyuid`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ uid: user.id }),
                });
                const data = await response.json();
                if (data?.message) return;
                setUserData({
                    name:           data.name          || "",
                    contact_Number: data.contactNumber || "",
                    street:         data.street        || "",
                    city:           data.city          || "",
                    state:          data.state         || "",
                    pincode:        data.pincode        || "",
                    email_Address:  data.emailAddress  || "",
                });
            } catch (err) { console.error(err); }
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
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    /* =========================================
       HANDLE CITY CHANGE — auto-fill pincode
    ========================================= */

    const handleCityChange = (e) => {
        const selected = locationData.cities.find(c => c.name === e.target.value);
        setEditData(prev => ({
            ...prev,
            city:    selected?.name    || "",
            pincode: selected?.pincode || "",
            state:   locationData.state,
        }));
    };

    /* =========================================
       SAVE USER DETAILS
    ========================================= */

    const handleSave = async () => {
        setSaving(true);
        try {
            const checkRes  = await fetch(`${API}/api/getalluserdetails`);
            const checkData = await checkRes.json();
            const userExists = checkData.some((item) => item.customer_id === user.id);

            const payload = {
                uid:          user.id,
                name:         editData.name,
                contactNumber: editData.contact_Number,
                street:       editData.street,
                city:         editData.city,
                state:        locationData.state,
                pincode:      editData.pincode,
                emailAddress: editData.email_Address,
            };

            const response = await fetch(
                userExists ? `${API}/api/updateuserdetails` : `${API}/api/adduserdetailsbycusid`,
                {
                    method: userExists ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );
            const data = await response.json();
            console.log(data.message);

            setUserData({
                ...editData,
                state: locationData.state,
            });
            setShowModal(false);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

            <div style={styles.page}>
                <div style={styles.container}>

                    {/* ── HEADER ── */}
                    <div style={styles.header}>
                        <div style={styles.headerLeft}>
                            <div style={styles.iconCircle}><IconUser /></div>
                            <div>
                                <h2 style={styles.title}>My Profile</h2>
                                <p style={styles.subtitle}>Manage your personal information</p>
                            </div>
                        </div>
                        <button
                            style={styles.editBtn}
                            onClick={handleEditClick}
                            onMouseEnter={e => e.currentTarget.style.background = "#a50e26"}
                            onMouseLeave={e => e.currentTarget.style.background = "#c8102e"}
                        >
                            <IconEdit /> Edit Details
                        </button>
                    </div>

                    {/* ── CARD ── */}
                    <div style={styles.card}>

                        {/* Personal Info */}
                        <div style={styles.sectionLabel}>Personal Info</div>
                        <div style={styles.grid}>
                            <Field label="Full Name" value={userData.name} />
                            <Field label="Phone"     value={userData.contact_Number} />
                            <Field label="Email"     value={userData.email_Address} />
                        </div>

                        <div style={styles.divider} />

                        {/* Delivery Address */}
                        <div style={styles.sectionLabel}>Delivery Address</div>
                        <div style={{ marginBottom: "24px" }}>
                            <Field label="Street" value={userData.street} />
                        </div>
                        <div style={styles.grid}>
                            <Field label="Street"  value={userData.street}  />
                            <Field label="City"    value={userData.city}    />
                            <Field label="Pincode" value={userData.pincode} last />
                        </div>
                        <div style={{ ...styles.grid, gridTemplateColumns: "1fr 1fr 1fr" }}>
                            <Field label="State"   value={userData.state || locationData.state}     />
                            <Field label="Country" value={locationData.country} />
                            <div style={{ ...styles.field, ...styles.fieldLast, background: "#faf9f7" }} />
                        </div>

                    </div>

                </div>
            </div>

            {/* ── MODAL ── */}
            {showModal && (
                <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div style={styles.modal}>

                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Edit Your Details</h3>
                            <button style={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <div style={styles.modalBody}>

                            {/* ── Personal Info ── */}
                            <div style={styles.formSectionTitle}>Personal Info</div>
                            <div style={styles.formRow}>
                                <InputField
                                    label="Full Name"
                                    name="name"
                                    value={editData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Arjun Kumar"
                                />
                                <InputField
                                    label="Phone Number"
                                    name="contact_Number"
                                    value={editData.contact_Number}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                            <div style={{ marginBottom: "20px" }}>
                                <InputField
                                    label="Email Address"
                                    name="email_Address"
                                    value={editData.email_Address}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div style={styles.modalDivider} />

                            {/* ── Delivery Address ── */}
                            <div style={styles.formSectionTitle}>Delivery Address</div>

                            {/* Street */}
                            <div style={{ marginBottom: "12px" }}>
                                <InputField
                                    label="Street Address"
                                    name="street"
                                    value={editData.street}
                                    onChange={handleChange}
                                    placeholder="House No., Street Name"
                                />
                            </div>

                            {/* City dropdown + Pincode (auto-filled) */}
                            <div style={styles.formRow}>
                                <div style={styles.inputWrap}>
                                    <label style={styles.inputLabel}>City</label>
                                    <select
                                        name="city"
                                        value={editData.city}
                                        onChange={handleCityChange}
                                        style={{
                                            ...styles.input,
                                            appearance: "none",
                                            WebkitAppearance: "none",
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "right 12px center",
                                            paddingRight: "32px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <option value="">Select City</option>
                                        {locationData.cities.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.inputWrap}>
                                    <label style={styles.inputLabel}>Pincode</label>
                                    <input
                                        style={styles.inputReadonly}
                                        value={editData.pincode}
                                        readOnly
                                        placeholder="Auto-filled on city select"
                                    />
                                </div>
                            </div>

                            {/* State + Country (read-only) */}
                            <div style={{ ...styles.formRow, marginTop: "12px" }}>
                                <div style={styles.inputWrap}>
                                    <label style={styles.inputLabel}>State</label>
                                    <input
                                        style={styles.inputReadonly}
                                        value={locationData.state}
                                        readOnly
                                    />
                                </div>
                                <div style={styles.inputWrap}>
                                    <label style={styles.inputLabel}>Country</label>
                                    <input
                                        style={styles.inputReadonly}
                                        value={locationData.country}
                                        readOnly
                                    />
                                </div>
                            </div>

                        </div>

                        <div style={styles.btnGroup}>
                            <button
                                style={styles.cancelBtn}
                                onClick={() => setShowModal(false)}
                                onMouseEnter={e => e.currentTarget.style.background = "#f5f3ef"}
                                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                            >
                                Cancel
                            </button>
                            <button
                                style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
                                onClick={handleSave}
                                disabled={saving}
                                onMouseEnter={e => !saving && (e.currentTarget.style.background = "#a50e26")}
                                onMouseLeave={e => e.currentTarget.style.background = "#c8102e"}
                            >
                                {saving ? "Saving…" : "Save Changes"}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}

export default PersonalDetails;