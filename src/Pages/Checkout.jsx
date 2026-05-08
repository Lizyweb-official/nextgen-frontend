import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

function Checkout() {

  const [cartItems, setCartItems] = useState([]);
  const [selectedPay, setSelectedPay] = useState("cod");
  const [slotData, setSlotData] = useState(null);

  const {user} = useAuth();
  const navigate = useNavigate();

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

  const payMethods = [
    {
      id: "online",
      icon: "bi-phone",
      name: "UPI / GPay / PhonePe",
      sub: "Pay instantly via UPI",
      badge: null
    },
    {
      id: "cod",
      icon: "bi-cash",
      name: "Cash on Delivery",
      sub: "Pay when order arrives",
      badge: null
    }
  ];

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
          body: JSON.stringify({
            uid: user.id,
          }),
        });

        const data = await response.json();
        console.log(data);

        setUserData({
          name: data.name || "",
          contact_Number: data.contactNumber || "",
          street: data.street || "",
          city: data.city || "",
          district: data.district || "",
          state: data.state || "",
          pincode: data.pincode || "",
          email_Address: data.emailAddress || "",
        });



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

        // cart items
        const cartResponse = await fetch(
          `${API}/api/product/getcart/${user.id}`
        );

        const cartData = await cartResponse.json();

        // product details
        const products = await Promise.all(

          cartData.map(async (item) => {

            const productResponse = await fetch(
              `${API}/api/product/getproduct/${item.product_id}`
            );

            const productData = await productResponse.json();
            console.log(productData);
            return {
              ...item,
              product_name: productData.name,
              custom_fields:productData.custom_fields
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

    try {

      const payload = {

        customer_id: user.id,

        name: userData.name,
        contact_number: userData.contact_Number,
        email_address: userData.email_Address,

        street: userData.street,
        city: userData.city,
        district: userData.district,
        state: userData.state,
        pincode: userData.pincode,

        total_amount: GRAND_TOTAL,

        payment_method: selectedPay,

        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      console.log(payload);

      const response = await fetch(
        `${API}/api/order/addOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert("Order placed successfully");

        await fetch(`${API}/api/order/clearcartbyid/${user.id}`, {
          method: "DELETE",
        });

        navigate("/Checkout-t");
        console.log(data);

      } else {

        alert("Failed to place order");
      }

    } catch (err) {

      console.log(err);

      alert("Something went wrong");
    }
  };


  const handleInputChange = (e) => {
  setUserData({
    ...userData,
    [e.target.name]: e.target.value
  });
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
          {
            slotData && (
              <div className="co-section">
                <div className="co-section-head">
                  <div className="sec-num">⏰</div>
                  <h3>Delivery Slot</h3>
                </div>

                <p
                  style={{
                    lineHeight: "28px",
                    fontWeight: "600"
                  }}
                >
                  {slotData.delivery_text}
                </p>
              </div>
            )
          }

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

              <div className="co-field">
                <label>City</label>

                <input
                  name="city"
                  value={userData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="co-field">
                <label>District</label>

                <input
                  name="district"
                  value={userData.district}
                  onChange={handleInputChange}
                />
              </div>

              <div className="co-field">
                <label>State</label>

                <input
                  name="state"
                  value={userData.state}
                  onChange={handleInputChange}
                />
              </div>

              <div className="co-field">
                <label>Pincode</label>

                <input
                  name="pincode"
                  value={userData.pincode}
                  onChange={handleInputChange}
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

              {
                payMethods.map((pm) => (

                  <div
                    key={pm.id}
                    className={`co-pay-opt ${
                      selectedPay === pm.id ? "selected" : ""
                    }`}
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
                      <div className="pay-name">
                        {pm.name}
                      </div>

                      <div className="pay-sub">
                        {pm.sub}
                      </div>
                    </div>

                    {
                      pm.badge && (
                        <div className="co-pay-badge">
                          {pm.badge}
                        </div>
                      )
                    }

                  </div>
                ))
              }

            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="co-right">

          <div className="co-summary-card">

            <div className="co-sum-title">
              Order Summary
            </div>

            {
              cartItems.map((item) => (

                <div
                  className="co-item-row"
                  key={item.id}
                >

                  <div className="co-item-detail">

                    <div className="iname">
                      {item.product_name}
                    </div>

              
                   <div className="imeta">

                    {
                      item.custom_fields?.map((field, index) => (
                        <div key={index}>
                          {field.field_name} : {field.field_value}
                        </div>
                      ))
                    }

                    <div>
                      Qty : {item.quantity}
                    </div>

                  </div>

                  </div>

                  <div className="co-item-price">
                    ₹{item.q_price}
                  </div>

                </div>
              ))
            }

            <hr className="co-divider" />

            <div className="co-sum-row">
              <span>Item Total</span>
              <span>₹{ITEM_TOTAL}</span>
            </div>

            <div className="co-sum-row">
              <span>Delivery</span>
              <span className="co-green">
                FREE
              </span>
            </div>

            <div className="co-sum-row total">
              <span>Total Amount</span>
              <span>₹{GRAND_TOTAL}</span>
            </div>

            <button
              className="co-place-btn"
              onClick={handlePlaceOrder}
            >
              Place Order →
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