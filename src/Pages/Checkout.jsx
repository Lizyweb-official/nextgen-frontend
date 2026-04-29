import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';
import React, { useState } from "react";


const orderItems = [
  { id: 1, name: "Chicken Boneless", meta: "500g × 1", price: 220, emoji: "🥩" },
  { id: 2, name: "Chicken Wings",    meta: "1kg × 1",  price: 180, emoji: "🍖" },
  { id: 3, name: "Chicken Breast",   meta: "1kg × 1",  price: 180, emoji: "🍗" },
];

const slots = [
  { day: "Today",    time: "9:00 AM – 11:00 AM" },
  { day: "Today",    time: "12:00 PM – 2:00 PM"  },
  { day: "Today",    time: "4:00 PM – 6:00 PM"   },
  { day: "Tomorrow", time: "9:00 AM – 11:00 AM" },
  { day: "Tomorrow", time: "12:00 PM – 2:00 PM"  },
  { day: "Tomorrow", time: "4:00 PM – 6:00 PM"   },
];

const payMethods = [
  { id: "upi",  icon: "💳", name: "UPI / GPay / PhonePe", sub: "Pay instantly via UPI",        badge: "Recommended" },
  { id: "nb",   icon: "🏦", name: "Net Banking",           sub: "All major banks supported",    badge: null },
  { id: "cod",  icon: "💰", name: "Cash on Delivery",      sub: "Pay when order arrives",       badge: null },
  { id: "card", icon: "🃏", name: "Credit / Debit Card",   sub: "Visa, Mastercard, RuPay",      badge: null },
];

const ITEM_TOTAL    = 740;
const DISCOUNT      = 160;
const DELIVERY      = 0;
const GRAND_TOTAL   = ITEM_TOTAL - DISCOUNT + DELIVERY;
const SAVINGS       = DISCOUNT;

function Checkout() {
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [selectedPay,  setSelectedPay]  = useState("upi");

  const [form, setForm] = useState({
    name: "", phone: "", flat: "", landmark: "",
    street: "", city: "", pincode: "", instructions: "",
  });

  const handleForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = () => {
    alert(`Order placed!\nTotal: ₹${GRAND_TOTAL}\nPayment: ${selectedPay.toUpperCase()}`);
  };

  return (
    <div className="co-wrap">

      {/* Header */}
      <div className="co-header">
        <div className="co-logo">tender<span>cuts</span></div>
        <div className="co-steps">
          <div className="co-step done">
            <div className="co-step-num">✓</div> Cart
          </div>
          <div className="co-step-line" />
          <div className="co-step active">
            <div className="co-step-num">2</div> Checkout
          </div>
          <div className="co-step-line" />
          <div className="co-step">
            <div className="co-step-num">3</div> Confirmation
          </div>
        </div>
      </div>

      <div className="co-body">
        <div className="co-left">

          {/* Section 1 — Delivery Address */}
          <div className="co-section">
            <div className="co-section-head">
              <div className="sec-num">1</div>
              <h3>Delivery Address</h3>
            </div>
            <div className="co-field-grid">
              <div className="co-field">
                <label>Full Name</label>
                <input name="name" value={form.name} onChange={handleForm} placeholder="Arjun Kumar" />
              </div>
              <div className="co-field">
                <label>Mobile Number</label>
                <input name="phone" value={form.phone} onChange={handleForm} placeholder="+91 98765 43210" type="tel" />
              </div>
              <div className="co-field">
                <label>Flat / House No.</label>
                <input name="flat" value={form.flat} onChange={handleForm} placeholder="Flat 4B, Rose Apartments" />
              </div>
              <div className="co-field">
                <label>Landmark</label>
                <input name="landmark" value={form.landmark} onChange={handleForm} placeholder="Near Reliance Fresh" />
              </div>
              <div className="co-field full">
                <label>Street / Area</label>
                <input name="street" value={form.street} onChange={handleForm} placeholder="Anna Nagar, Chennai" />
              </div>
              <div className="co-field">
                <label>City</label>
                <input name="city" value={form.city} onChange={handleForm} placeholder="Chennai" />
              </div>
              <div className="co-field">
                <label>Pincode</label>
                <input name="pincode" value={form.pincode} onChange={handleForm} placeholder="600040" />
              </div>
              <div className="co-field full">
                <label>Delivery Instructions (optional)</label>
                <textarea
                  name="instructions"
                  value={form.instructions}
                  onChange={handleForm}
                  placeholder="Leave at door, ring bell twice..."
                />
              </div>
            </div>
          </div>

          {/* Section 2 — Delivery Slot */}
          <div className="co-section">
            <div className="co-section-head">
              <div className="sec-num">2</div>
              <h3>Delivery Slot</h3>
            </div>
            <p className="co-slot-hint">Select a convenient time for delivery</p>
            <div className="co-slot-grid">
              {slots.map((slot, i) => (
                <div
                  key={i}
                  className={`co-slot${selectedSlot === i ? " selected" : ""}`}
                  onClick={() => setSelectedSlot(i)}
                >
                  <div className="slot-day">{slot.day}</div>
                  <div className="slot-time">{slot.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3 — Payment */}
          <div className="co-section">
            <div className="co-section-head">
              <div className="sec-num">3</div>
              <h3>Payment Method</h3>
            </div>
            <div className="co-pay-options">
              {payMethods.map((pm) => (
                <div
                  key={pm.id}
                  className={`co-pay-opt${selectedPay === pm.id ? " selected" : ""}`}
                  onClick={() => setSelectedPay(pm.id)}
                >
                  <input type="radio" name="pay" readOnly checked={selectedPay === pm.id} />
                  <div className="co-pay-icon">{pm.icon}</div>
                  <div className="co-pay-info">
                    <div className="pay-name">{pm.name}</div>
                    <div className="pay-sub">{pm.sub}</div>
                  </div>
                  {pm.badge && <div className="co-pay-badge">{pm.badge}</div>}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT — Order Summary */}
        <div className="co-right">
          <div className="co-summary-card">
            <div className="co-sum-title">Order Summary</div>

            {orderItems.map((item) => (
              <div className="co-item-row" key={item.id}>
                <div className="co-item-emoji">{item.emoji}</div>
                <div className="co-item-detail">
                  <div className="iname">{item.name}</div>
                  <div className="imeta">{item.meta}</div>
                </div>
                <div className="co-item-price">₹{item.price}</div>
              </div>
            ))}

            <hr className="co-divider" />

            <div className="co-sum-row"><span>Item Total</span><span>₹{ITEM_TOTAL}</span></div>
            <div className="co-sum-row"><span className="co-green">Discount</span><span className="co-green">−₹{DISCOUNT}</span></div>
            <div className="co-sum-row"><span>Delivery</span><span className="co-green">FREE</span></div>
            <div className="co-sum-row total"><span>Total Amount</span><span>₹{GRAND_TOTAL}</span></div>

            <div className="co-saving-text">🎉 You save ₹{SAVINGS} on this order!</div>

            <button className="co-place-btn" onClick={handlePlaceOrder}>
              Place Order →
            </button>
            <div className="co-safe">🔒 100% Secure &amp; Safe Payments</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;