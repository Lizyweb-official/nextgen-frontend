import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

import { showWebMessage } from "../context/webMessageHandler";

import { useLocation } from "../context/LocContext";

const API = import.meta.env.VITE_API_URL;

const PENDING_KEYS = {
  invoice: "pending_payment_invoice",
  orderId: "pending_payment_order_id",
  amount: "pending_payment_amount",
  customerId: "pending_payment_customer_id",
};

// E-wallet and FPX/bank-transfer payments send the customer to another
// tab/app to authorize, and DOKU doesn't mark the transaction SUCCESS
// until that completes — this can take well over a minute. Poll for up
// to 5 minutes before giving up, instead of the 30s that was silently
// leaving genuinely paid orders stuck at "pending".
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 60;

function Checkout() {

  const [cartItems, setCartItems] = useState([]);
  const [selectedPay, setSelectedPay] = useState("online");
  const [slotData, setSlotData] = useState(null);
  const [cities, setCities] = useState([]);

  const { locationData } = useLocation();

  const { user } = useAuth();
  const navigate = useNavigate();

  /* PAYMENT STATE
     idle       — normal checkout, "Place Order" button shown
     placing    — order/payment being created, button disabled
     confirming — redirected back from DOKU, polling for the result
     failed     — DOKU payment failed/expired/cancelled — stay on this page
     timeout    — polling gave up without a definite answer yet
     ============================================================ */
  const [paymentState, setPaymentState] = useState("idle");
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [pendingAmount, setPendingAmount] = useState(null);
  const [pendingInvoice, setPendingInvoice] = useState(null);
  const pollAttemptsRef = useRef(0);

  const clearPendingPayment = () => {
    localStorage.removeItem(PENDING_KEYS.invoice);
    localStorage.removeItem(PENDING_KEYS.orderId);
    localStorage.removeItem(PENDING_KEYS.amount);
    localStorage.removeItem(PENDING_KEYS.customerId);
  };

  const [userData, setUserData] = useState({
    name: "",
    contact_Number: "",
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    email: "",
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
          email: data.emailAddress || "",
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
  // RESUME PAYMENT CONFIRMATION AFTER DOKU REDIRECT
  // DOKU's callback_url points back to this same page, so on return we
  // detect the pending invoice and pick up polling right here instead of
  // navigating anywhere.
  // -----------------------------------

  useEffect(() => {
    const invoiceNumber = localStorage.getItem(PENDING_KEYS.invoice);
    const orderId = localStorage.getItem(PENDING_KEYS.orderId);
    const amount = localStorage.getItem(PENDING_KEYS.amount);

    if (invoiceNumber && orderId) {
      setPendingOrderId(orderId);
      setPendingAmount(amount ? Number(amount) : null);
      setPendingInvoice(invoiceNumber);
      setPaymentState("confirming");
      pollAttemptsRef.current = 0;
      pollPaymentStatus(invoiceNumber, orderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOrderPaymentStatus = async (orderId, status, invoiceNumber) => {
    try {
      await fetch(`${API}/api/order/updatePaymentStatus`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, payment_status: status, invoice_number: invoiceNumber }),
      });
    } catch (err) {
      console.log("UPDATE PAYMENT STATUS ERROR =>", err);
    }
  };

  const pollPaymentStatus = async (invoiceNumber, orderId) => {
    pollAttemptsRef.current += 1;

    try {
      const res = await fetch(`${API}/api/payment/status/${invoiceNumber}`);
      const result = await res.json();
      const status = result.data?.status;

      if (status === "SUCCESS") {
        await updateOrderPaymentStatus(orderId, "paid", invoiceNumber);

        // Read customerId from localStorage rather than the `user` state
        // closed over by this function — on the "resume after DOKU
        // redirect" path this poll chain starts on the very first render,
        // before AuthContext has restored `user` from localStorage, and
        // since the chain keeps re-invoking that same stale closure,
        // `user` would stay null for the whole chain even after React
        // re-renders with the real value. This was silently skipping the
        // cart clear on successful web payments.
        const customerId = localStorage.getItem(PENDING_KEYS.customerId) || user?.id;
        if (customerId) {
          await fetch(`${API}/api/order/clearcartbyid/${customerId}`, { method: "DELETE" });
        }

        clearPendingPayment();
        navigate("/Checkout-t");
        return;
      }

      if (["FAILED", "EXPIRED", "CANCELLED"].includes(status)) {
        await updateOrderPaymentStatus(orderId, "failed");
        // Terminal state — fully clear so a later, fresh visit to this
        // page never resumes an old attempt (this was showing "Confirming
        // payment…" for brand-new carts before this fix).
        clearPendingPayment();
        setPaymentState("failed");
        return;
      }
    } catch (err) {
      console.log("PAYMENT STATUS POLL ERROR =>", err);
    }

    if (pollAttemptsRef.current >= MAX_POLL_ATTEMPTS) {
      setPaymentState("timeout");
      return;
    }

    setTimeout(() => pollPaymentStatus(invoiceNumber, orderId), POLL_INTERVAL_MS);
  };

  // Creates (or re-creates, for "Try Again") a DOKU checkout session for an
  // already-placed order and redirects to the hosted payment page.
  const initiatePayment = async (orderId, amount) => {
    setPaymentState("placing");

    try {
      const paymentResponse = await fetch(`${API}/api/payment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          amount,
          customer: {
            name: userData.name,
            phone: userData.contact_Number,
            email: userData.email,
          },
          callback_url: `${window.location.origin}/Checkout`,
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok || !paymentResult.data?.payment_url) {
        showWebMessage(paymentResult.message || "Failed to start payment");
        setPaymentState(pendingOrderId ? "failed" : "idle");
        return;
      }

      setPendingInvoice(paymentResult.data.invoice_number);
      localStorage.setItem(PENDING_KEYS.invoice, paymentResult.data.invoice_number);
      localStorage.setItem(PENDING_KEYS.orderId, orderId);
      localStorage.setItem(PENDING_KEYS.amount, amount);
      if (user?.id) {
        localStorage.setItem(PENDING_KEYS.customerId, user.id);
      }

      window.location.href = paymentResult.data.payment_url;
    } catch (err) {
      console.log(err);
      showWebMessage("Something went wrong starting payment");
      setPaymentState(pendingOrderId ? "failed" : "idle");
    }
  };

  const handleTryAgain = () => {
    if (!pendingOrderId) return;
    initiatePayment(pendingOrderId, pendingAmount ?? GRAND_TOTAL);
  };

  const handleCheckAgain = () => {
    if (!pendingInvoice || !pendingOrderId) return;
    setPaymentState("confirming");
    pollAttemptsRef.current = 0;
    pollPaymentStatus(pendingInvoice, pendingOrderId);
  };

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

    /* EMAIL VALIDATION — required by DOKU for online payment */
    if (selectedPay !== "cod" && !/^\S+@\S+\.\S+$/.test(userData.email?.trim() || "")) {
      showWebMessage("Enter a valid email address for payment");
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

      if (!response.ok) {
        showWebMessage(data.message || "Failed to place order");
        return;
      }

      if (selectedPay === "cod") {
        await fetch(`${API}/api/order/clearcartbyid/${user.id}`, {
          method: "DELETE",
        });
        showWebMessage("Order placed successfully");
        navigate("/Checkout-t");
        return;
      }

      /* Cart is intentionally NOT cleared here for online payment — only
         once pollPaymentStatus confirms SUCCESS, so a failed/abandoned
         payment leaves the cart intact for the customer to retry. */

      /* ONLINE PAYMENT — create a DOKU Checkout session and redirect the
         customer to the hosted payment page. */
      setPendingOrderId(data.order_id);
      setPendingAmount(GRAND_TOTAL);
      await initiatePayment(data.order_id, GRAND_TOTAL);
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
        emailAddress: userData.email
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

              <div className="co-field">
                <label>Email (required for online payment)</label>
                <input
                  name="email"
                  type="email"
                  value={userData.email}
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
                <input
                  name="city"
                  readOnly
                  value={userData.city}
                  style={{
                    background: "#f8f8f8",
                    color: "#aaa",
                    cursor: "not-allowed"
                  }}
                />
              </div>

              {/* PINCODE — auto-filled from city */}
              <div className="co-field">
                <label>Pincode</label>
                <input
                  name="pincode"
                  readOnly
                  value={userData.pincode}
                  style={{
                    background: "#f8f8f8",
                    color: "#aaa",
                    cursor: "not-allowed"
                  }}
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

            {paymentState === "confirming" && (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{
                  width: 28, height: 28, margin: "0 auto 10px",
                  border: "3px solid #eee", borderTop: "3px solid #d32f2f",
                  borderRadius: "50%", animation: "spin 0.8s linear infinite",
                }} />
                <p style={{ color: "#555", fontWeight: 600 }}>Confirming your payment…</p>
                <p style={{ color: "#999", fontSize: 13 }}>Please don't close this page.</p>
              </div>
            )}

            {paymentState === "failed" && (
              <div style={{
                textAlign: "center", padding: "14px",
                background: "#fff3f3", border: "1px solid #ffcdd2",
                borderRadius: 10, marginBottom: 12,
              }}>
                <p style={{ color: "#d32f2f", fontWeight: 700, marginBottom: 10 }}>
                  ❌ Payment didn't go through
                </p>
                <p style={{ color: "#777", fontSize: 13, marginBottom: 12 }}>
                  Your order is saved. You can try the payment again.
                </p>
                <button className="co-place-btn" onClick={handleTryAgain}>
                  Try Again →
                </button>
              </div>
            )}

            {paymentState === "timeout" && (
              <div style={{
                textAlign: "center", padding: "14px",
                background: "#fff8e6", border: "1px solid #ffe0a3",
                borderRadius: 10, marginBottom: 12,
              }}>
                <p style={{ color: "#92400e", fontWeight: 700, marginBottom: 10 }}>
                  Still confirming your payment…
                </p>
                <p style={{ color: "#777", fontSize: 13, marginBottom: 12 }}>
                  This is taking longer than usual.
                </p>
                <button className="co-place-btn" onClick={handleCheckAgain} style={{ marginBottom: 8 }}>
                  Check Again
                </button>
                <button className="co-place-btn" onClick={handleTryAgain} style={{ background: "#777" }}>
                  Try Again →
                </button>
              </div>
            )}

            {(paymentState === "idle" || paymentState === "placing") && (
              <button
                className="co-place-btn"
                onClick={handlePlaceOrder}
                disabled={!isSlotOn || paymentState === "placing"}
                style={{
                  opacity: !isSlotOn || paymentState === "placing" ? 0.6 : 1,
                  cursor: !isSlotOn || paymentState === "placing" ? "not-allowed" : "pointer"
                }}
              >
                {paymentState === "placing"
                  ? "Processing…"
                  : isSlotOn ? "Place Order →" : "No Slot Available"}
              </button>
            )}

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