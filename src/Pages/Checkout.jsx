import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';
import React, { useState } from "react";

function Checkout() {

  const [selectedAddress, setSelectedAddress] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const addresses = [
    { id: 1, name: "Home", details: "Chennai, Tamil Nadu - 600001" },
    { id: 2, name: "Office", details: "OMR, Chennai - 600096" },
  ];

  const slots = ["Today 6-8 PM", "Tomorrow 10-12 AM", "Tomorrow 6-8 PM"];

  const cartItems = [
    { name: "Chicken Boneless", qty: 2, price: 220 },
    { name: "Chicken Wings", qty: 1, price: 180 },
  ];

  const subtotal = cartItems.reduce(
    (t, i) => t + i.price * i.qty,
    0
  );

  const delivery = 40;
  const total = subtotal + delivery - discount;

  const applyCoupon = () => {
    if (coupon === "SAVE50") {
      setDiscount(50);
    } else {
      setDiscount(0);
      alert("Invalid coupon");
    }
  };

  return (
    <div className="checkout">
      <div className="left">

        {/* ADDRESS */}
        <div className="section">
          <h3>Select Address</h3>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`address-card ${
                selectedAddress === addr.id ? "active" : ""
              }`}
              onClick={() => setSelectedAddress(addr.id)}
            >
              <h4>{addr.name}</h4>
              <p>{addr.details}</p>
            </div>
          ))}
        </div>

        {/* DELIVERY SLOT */}
        <div className="section">
          <h3>Delivery Slot</h3>
          <div className="slots">
            {slots.map((slot, i) => (
              <button
                key={i}
                className={selectedSlot === slot ? "active" : ""}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* COUPON */}
        <div className="section">
          <h3>Apply Coupon</h3>
          <div className="coupon-box">
            <input
              type="text"
              placeholder="Enter code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button onClick={applyCoupon}>Apply</button>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="section">
          <h3>Payment Method</h3>
          <label><input type="radio" name="pay" /> Cash on Delivery</label>
          <label><input type="radio" name="pay" /> UPI / Card</label>
        </div>
      </div>

      {/* RIGHT SUMMARY */}
      <div className="right">
        <h3>Order Summary</h3>

        {cartItems.map((item, i) => (
          <div className="item" key={i}>
            <span>{item.name} x {item.qty}</span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        <div className="item"><span>Subtotal</span><span>₹{subtotal}</span></div>
        <div className="item"><span>Delivery</span><span>₹{delivery}</span></div>
        {discount > 0 && (
          <div className="item discount">
            <span>Discount</span><span>-₹{discount}</span>
          </div>
        )}

        <div className="total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button className="place-order">Place Order</button>
      </div>
    </div>
  );
}


export default Checkout;