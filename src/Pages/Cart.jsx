import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';
import chickenBreast from "../media/Website-Images/images-2/BONELESS.png";
import wings from "../media/Website-Images/images-2/WINGS.PNG";
import boneless from "../media/Website-Images/images-2/CHEST.png";
import path from "../media/Website-Images/images-2/Gemini_Generated_Image_24ye24ye24ye24ye.png";

const DELIVERY_THRESHOLD = 499;
const DELIVERY_CHARGE = 49;

import React, { useState } from "react";

function Cart() {
  
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Chicken Boneless", weight: "500g", price: 220, origPrice: 280, qty: 1, image: boneless },
    { id: 2, name: "Chicken Wings",    weight: "1kg",  price: 180, origPrice: 220, qty: 1, image: wings },
    { id: 3, name: "Chicken Breast",   weight: "1kg",  price: 180, origPrice: 240, qty: 1, image: chickenBreast },
  ]);

  const updateQty = (id, type) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        if (type === "inc") return { ...item, qty: item.qty + 1 };
        if (type === "dec" && item.qty > 1) return { ...item, qty: item.qty - 1 };
        return item;
      })
    );
  };

  const removeItem = (id) => setCartItems(prev => prev.filter(item => item.id !== id));

  const itemTotal      = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const origTotal      = cartItems.reduce((s, i) => s + i.origPrice * i.qty, 0);
  const savings        = origTotal - itemTotal;
  const delivery       = itemTotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const grandTotal     = itemTotal + delivery;
  const totalQty       = cartItems.reduce((s, i) => s + i.qty, 0);
  const isFreeDelivery = itemTotal >= DELIVERY_THRESHOLD;
  
  return (
    <div className="tc-wrap">

      <section
        className="ayam-cart-hero"
        style={{ backgroundImage: `url(${path})` }}
      >
        <div className="ayam-cart-hero__overlay"></div>
        <div className="ayam-cart-hero__radial-glow"></div>

        <div className="ayam-cart-hero__content">
          

         <h1 
  className="ayam-cart-hero__title" 
  style={{ color: "#fbfbfb" }}
>
  Your Cart
</h1>
          <div className="ayam-cart-hero__divider"></div>

          

        
        </div>
      </section>

      {/* Header */}
      <div className="tc-header">
        <div className="tc-logo">Ayam<span>Now</span></div>
        <button className="tc-back">
          <i className="bi bi-arrow-left"></i> Continue Shopping
        </button>
      </div>

      <div className="tc-body">

        {/* LEFT — Cart Items */}
        <div className="tc-left">

          <div className="tc-section-title">
            Your Cart ({totalQty} item{totalQty !== 1 ? "s" : ""})
          </div>

          {cartItems.map(item => (
            <div className="tc-card" key={item.id}>
              <div className="tc-item-img">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="tc-item-info">
                <div className="tc-item-name">{item.name}</div>
                <div className="tc-item-weight">{item.weight}</div>
                <div className="tc-fresh-badge">
                  <i className="bi bi-check-circle"></i> Farm Fresh · No Preservatives
                </div>
                <div className="tc-item-price">
                  ₹{item.price}
                  <span className="orig">₹{item.origPrice}</span>
                </div>

                <div className="tc-qty-row">
                  <div className="tc-qty">
                    <button onClick={() => updateQty(item.id, "dec")}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, "inc")}>+</button>
                  </div>
                  <div className="tc-subtotal">Subtotal: ₹{item.price * item.qty}</div>
                </div>
              </div>

              <button className="tc-delete" onClick={() => removeItem(item.id)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT — Order Summary */}
        <div className="tc-right">
          <div className="tc-summary-card">
            <div className="tc-summary-title">Order Summary</div>

            <div className="tc-sum-row">
              <span>Item Total</span><span>₹{origTotal}</span>
            </div>
            <div className="tc-sum-row">
              <span className="tc-green">Discount</span>
              <span className="tc-green">−₹{savings}</span>
            </div>
            <div className="tc-sum-row">
              <span>Delivery Charges</span>
              <span className={isFreeDelivery ? "tc-green" : ""}>
                {isFreeDelivery ? "FREE" : `₹${DELIVERY_CHARGE}`}
              </span>
            </div>
            <div className="tc-sum-row total">
              <span>Total Amount</span><span>₹{grandTotal}</span>
            </div>

            <div className="tc-saving-text">
              <i className="bi bi-emoji-smile"></i> You save ₹{savings} on this order!
            </div>

            {/* Promo */}
            <div className="tc-promo">
              <span><i className="bi bi-tag"></i></span>
              <div className="tc-promo-text">
                Have a promo code? <span>Apply here</span>
              </div>
            </div>

            <button className="tc-checkout-btn">Proceed to Checkout →</button>

            {/* Trust Badges */}
            <div className="tc-trust">
              <div className="tc-trust-item">
                <i className="bi bi-box-seam"></i> 100% Fresh
              </div>
              <div className="tc-trust-item">
                <i className="bi bi-thermometer-snow"></i> Cold Chain
              </div>
              <div className="tc-trust-item">
                <i className="bi bi-shield-lock"></i> Secure Pay
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Cart;