import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

import { showWebMessage } from "../context/webMessageHandler";

import { useLocation } from "../context/LocContext";

const API = import.meta.env.VITE_API_URL;

function Checkout() {

  const [cartItems, setCartItems] = useState([]);
  const [selectedPay, setSelectedPay] = useState("online");
  const [slotData, setSlotData] = useState(null);
  const [cities, setCities] = useState([]);

  const { locationData } = useLocation();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    contact_Number: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const payMethods = [
    {
      id: "online",
      icon: "bi-phone",
      name: "UPI / GPay / PhonePe",
      sub: "Pay instantly via UPI",
      badge: null
    },
    // {
    //   id: "cod",
    //   icon: "bi-cash",
    //   name: "Cash on Delivery",
    //   sub: "Pay when order arrives",
    //   badge: null
    // }
  ];

  // -----------------------------------
  // SLOT ON / OFF
  // -----------------------------------

  const [slotStatus, setSlotStatus] = useState("");
  const [isSlotOn, setIsSlotOn] = useState(false);

  useEffect(() => {
    fetchSiteSetting();
  }, []);

  const fetchSiteSetting = async () => {
    try {
      const response = await fetch(`${API}/api/admin/site-settings/get/1`);
      const data = await response.json();
      setSlotStatus(data.setting_value);
      setIsSlotOn(data.setting_value === "on");
    } catch (error) {
      console.error("Error fetching setting:", error);
    }
  };

  // -----------------------------------
  // FETCH CITIES / STATE / COUNTRY
  // -----------------------------------

  useEffect(() => {
    const fetchOrderCities = async () => {
      try {
        const response = await fetch(`${API}/api/admin/getallordercity`);
        const data = await response.json();

        const cityList = data.filter((d) => d.type === "city");
        const stateEntry = data.find((d) => d.type === "state");
        const countryEntry = data.find((d) => d.type === "country");

        setCities(cityList);

        setUserData((prev) => ({
          ...prev,
          state: stateEntry?.name || "",
          country: countryEntry?.name || "",
        }));
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrderCities();
  }, []);

  // -----------------------------------
  // GET USER DETAILS
  // -----------------------------------

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await fetch(`${API}/api/getuserdetailsbyuid`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: user.id }),
        });

        const data = await response.json();

        setUserData((prev) => ({
          ...prev,
          name: data.name || "",
          contact_Number: data.contactNumber || "",
          street: data.street || "",
          city: data.city || "",
          pincode: data.pincode || "",
        }));
      } catch (err) {
        console.log(err);
      }
    };

    if (user?.id) {
      getUserDetails();
    }
  }, [user]);

  // -----------------------------------
  // GET CURRENT SLOT
  // -----------------------------------

  useEffect(() => {
    const getCurrentSlot = async () => {
      try {
        const response = await fetch(`${API}/api/order/getcurrentslot`);
        const data = await response.json();
        if(data == "noslot"){
          setIsSlotOn(false);
        }

        setSlotData(data);
      } catch (err) {
        console.log(err);
      }
    };

    getCurrentSlot();
  }, []);

  // -----------------------------------
  // GET CART PRODUCTS
  // -----------------------------------

  useEffect(() => {
    const getCartProducts = async () => {
      try {
        const cartResponse = await fetch(`${API}/api/product/getcart/${user.id}`);
        const cartData = await cartResponse.json();

        const products = await Promise.all(
          cartData.map(async (item) => {
            const productResponse = await fetch(`${API}/api/product/getproduct/${item.product_id}`);
            const productData = await productResponse.json();
            return {
              ...item,
              product_name: productData.name,
              custom_fields: productData.custom_fields,
              custom_pieces: item.custom_pieces,
            };
          })
        );

        setCartItems(products);
      } catch (err) {
        console.log(err);
      }
    };

    if (user?.id) {
      getCartProducts();
    }
  }, [user]);

  // -----------------------------------
  // TOTALS
  // -----------------------------------

  const ITEM_TOTAL = cartItems.reduce(
    (sum, item) => sum + Number(item.q_price),
    0
  );

  const DELIVERY = 0;
  const GRAND_TOTAL = ITEM_TOTAL + DELIVERY;

  // -----------------------------------
  // PLACE ORDER
  // -----------------------------------

  const handlePlaceOrder = async () => {


    if (!isSlotOn) {
      showWebMessage("No Slot Available");
      return;
    }

    /* VALIDATION */
    if (
      !userData.name?.trim() ||
      !userData.contact_Number?.trim() ||
      !userData.street?.trim() ||
      !userData.city?.trim() ||
      !userData.state?.trim() ||
      !userData.country?.trim() ||
      !userData.pincode?.trim()
    ) {
      showWebMessage("Please fill all address details");
      return;
    }

    /* PHONE VALIDATION */
    if (!userData.contact_Number) {
      showWebMessage("Enter phone number first");
      return;
    }
    
    /* PHONE VALIDATION */
    if (!/^\d{10}$/.test(userData.contact_Number)) {
      showWebMessage("Enter a valid phone number");
      return;
    }

    try {
      await updateUserDetails();

      const payload = {
        customer_id: user.id,
        name: userData.name,
        contact_number: userData.contact_Number,
        street: userData.street,
        city: userData.city,
        state: userData.state,
        country: userData.country,
        pincode: userData.pincode,
        total_amount: GRAND_TOTAL,
        payment_method: selectedPay,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          custom_pieces: item.custom_pieces
        }))
      };

      const response = await fetch(`${API}/api/order/addOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        showWebMessage("Order placed successfully");

        await fetch(`${API}/api/order/clearcartbyid/${user.id}`, {
          method: "DELETE",
        });



        navigate("/Checkout-t");
      } else {
        showWebMessage(data.message || "Failed to place order");
      }
    } catch (err) {
      console.log(err);
      showWebMessage("Something went wrong");
    }
  };


// UPDATE USER ADDRESS DETAILS FIRST
const updateUserDetails = async () => {
  try {
    const response = await fetch(`${API}/api/updateuserdetails`, {
      method: 'PUT', // change to POST if your backend expects POST
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uid: user.id,
        name: userData.name,
        contactNumber: userData.contact_Number,
        street: userData.street,
        city: userData.city,
        state: userData.state,
        pincode: userData.pincode,
        emailAddress: userData.email_Address
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user details');
    }

    return data;
  } catch (error) {
    console.log('Update Address Error:', error);
    throw error;
  }
};















  // -----------------------------------
  // INPUT CHANGE
  // -----------------------------------

  const handleInputChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  // -----------------------------------
  // CITY CHANGE (auto-fill pincode)
  // -----------------------------------

  const handleCityChange = (e) => {
    const value = e.target.value; // e.g. "Coimbatore,641654"
    const [cityName, pincode] = value.split(",");
    setUserData((prev) => ({
      ...prev,
      city: cityName?.trim() || value,
      pincode: pincode?.trim() || prev.pincode,
    }));
  };

  return (
    <div className="co-wrap">

      {/* Header */}
      <div className="co-header">

        <div className="co-logo">
          Ayam<span>Now</span>
        </div>

        <div className="co-steps">

          <div className="co-step done">
            <div className="co-step-num">✓</div>
            Cart
          </div>

          <div className="co-step-line" />

          <div className="co-step active">
            <div className="co-step-num">2</div>
            Checkout
          </div>

          <div className="co-step-line" />

          <div className="co-step">
            <div className="co-step-num">3</div>
            Confirmation
          </div>

        </div>
      </div>

      <div className="co-body">

        {/* LEFT */}
        <div className="co-left">

          {/* SLOT TEXT */}
          {slotData && (
            <div className="co-section">

              <div className="co-section-head">
                <div className="sec-num">⏰</div>
                <h3>Delivery Slot</h3>
              </div>

              {isSlotOn ? (
                <>
                  <p style={{ lineHeight: "28px", fontWeight: "600" }}>
                    {slotData.delivery_text}
                  </p>
                  <p style={{ marginTop: "10px", fontWeight: "700", color: "green" }}>
                    Orders are Open
                  </p>
                </>
              ) : (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "14px",
                    borderRadius: "10px",
                    background: "#fff3f3",
                    color: "#d32f2f",
                    fontWeight: "700",
                    textAlign: "center",
                    border: "1px solid #ffcdd2"
                  }}
                >
                  No Slot Available
                </div>
              )}

            </div>
          )}

          {/* ADDRESS */}
          <div className="co-section">

            <div className="co-section-head">
              <div className="sec-num">1</div>
              <h3>Delivery Address</h3>
            </div>

            <div className="co-field-grid">

              <div className="co-field">
                <label>Full Name</label>
                <input
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="co-field">
                <label>Mobile Number</label>
                <input
                  name="contact_Number"
                  value={userData.contact_Number}
                  onChange={handleInputChange}
                />
              </div>

              <div className="co-field full">
                <label>Street</label>
                <input
                  name="street"
                  value={userData.street}
                  onChange={handleInputChange}
                />
              </div>

              {/* CITY — dropdown */}
              <div className="co-field">
                <label>City / Area</label>
                <select
                  name="city"
                  onChange={handleCityChange}
                  value={userData.city ? `${userData.city},${userData.pincode}` : "emp"}
                >
                  <option value="emp">Select city...</option>
                  {cities.map((c) => {
                    const [cityName, pincode] = c.name.split(",");
                    return (
                      <option key={c.id} value={c.name}>
                        {cityName.trim()}{pincode ? ` - ${pincode.trim()}` : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* PINCODE — auto-filled from city */}
              <div className="co-field">
                <label>Pincode</label>
                <input
                  name="pincode"
                  value={userData.pincode}
                  onChange={handleInputChange}
                />
              </div>

              {/* STATE — locked */}
              <div className="co-field">
                <label>State</label>
                <input
                  name="state"
                  value={userData.state}
                  readOnly
                  style={{
                    background: "#f8f8f8",
                    color: "#aaa",
                    cursor: "not-allowed"
                  }}
                />
              </div>

              {/* COUNTRY — locked */}
              <div className="co-field">
                <label>Country</label>
                <input
                  name="country"
                  value={userData.country}
                  readOnly
                  style={{
                    background: "#f8f8f8",
                    color: "#aaa",
                    cursor: "not-allowed"
                  }}
                />
              </div>

            </div>
          </div>

          {/* PAYMENT */}
          <div className="co-section">

            <div className="co-section-head">
              <div className="sec-num">2</div>
              <h3>Payment Method</h3>
            </div>

            <div className="co-pay-options">
              {payMethods.map((pm) => (
                <div
                  key={pm.id}
                  className={`co-pay-opt ${selectedPay === pm.id ? "selected" : ""}`}
                  onClick={() => setSelectedPay(pm.id)}
                >
                  <input
                    type="radio"
                    name="pay"
                    readOnly
                    checked={selectedPay === pm.id}
                  />

                  <div className="co-pay-icon">
                    <i className={`bi ${pm.icon}`}></i>
                  </div>

                  <div className="co-pay-info">
                    <div className="pay-name">{pm.name}</div>
                    <div className="pay-sub">{pm.sub}</div>
                  </div>

                  {pm.badge && (
                    <div className="co-pay-badge">{pm.badge}</div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="co-right">

          <div className="co-summary-card">

            <div className="co-sum-title">Order Summary</div>

            {cartItems.map((item) => (
              <div className="co-item-row" key={item.id}>

                <div className="co-item-detail">
                  <div className="iname">{item.product_name}</div>
                  <div className="imeta">
                    {item.custom_fields?.map((field, index) => (
                      <div key={index}>
                        {field.field_name} : {field.field_value}
                      </div>
                    ))}
                    <div>{item.quantity} Kg</div>
                    {item.custom_pieces?.trim() && (
                      <div>Pieces : {item.custom_pieces}</div>
                    )}
                  </div>
                </div>

                <div className="co-item-price">RM {item.q_price}</div>

              </div>
            ))}

            <hr className="co-divider" />

            <div className="co-sum-row">
              <span>Item Total</span>
              <span>RM {ITEM_TOTAL}</span>
            </div>

            <div className="co-sum-row">
              <span>Delivery</span>
              <span className="co-green">FREE</span>
            </div>

            <div className="co-sum-row total">
              <span>Total Amount</span>
              <span>RM {GRAND_TOTAL}</span>
            </div>

            <button
              className="co-place-btn"
              onClick={handlePlaceOrder}
              disabled={!isSlotOn}
              style={{
                opacity: !isSlotOn ? 0.6 : 1,
                cursor: !isSlotOn ? "not-allowed" : "pointer"
              }}
            >
              {isSlotOn ? "Place Order →" : "No Slot Available"}
            </button>

            <div className="co-safe">
              🔒 100% Secure & Safe Payments
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;