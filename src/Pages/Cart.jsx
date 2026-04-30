import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

const API = import.meta.env.VITE_API_URL;

import path from "../media/Website-Images/images-2/cart-path-bg.jpg";
import { showWebMessage } from "../context/webMessageHandler";

const DELIVERY_THRESHOLD = 0;
const DELIVERY_CHARGE = 0;

import React, { useState,useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Cart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([
    ]);

    const fetchCartItems = async (customerId) => {
    try {
      // 1. Get cart data
      const cartRes = await fetch(
        `${API}/api/product/getcart/${customerId}`
      );
      const cartData = await cartRes.json();

      // 2. Fetch product + image for each item
      const fullCart = await Promise.all(
        cartData.map(async (item) => {
          // Get product
          const productRes = await fetch(
            `${API}/api/product/getproduct/${item.product_id}`
          );
          const product = await productRes.json();

          // Get image
          const imageRes = await fetch(
            `${API}/api/getimagebyid/${product.image_id}`
          );
          const image = await imageRes.json();

          return {
            id: item.id,
            product_id: product.id,
            name: product.name,
            price: Number(product.sale_price),
            origPrice: Number(product.base_price),
            qty: item.quantity,
            image: image.url,
          };
        })
      );

      // 3. Update state
      setCartItems(fullCart);

    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
  if (user?.id) {
    console.log(user.id);
    fetchCartItems(user.id);
  }
}, [user]);

  const updateQty = (productId, type) => {
  setCartItems(prev =>
    prev.map(item => {
      if (item.product_id !== productId) return item;

      let newQty = item.qty;

      if (type === "inc") newQty++;
      if (type === "dec" && item.qty > 1) newQty--;

      // 🔥 CALL API HERE
      fetch(`${API}/api/product/updatecartquantity`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer_id: user.id,
          product_id: productId,
          quantity: newQty
        })
      })
      .then(res => res.json())
      .then(data => console.log("Updated:", data))
      .catch(err => console.error(err));

      return { ...item, qty: newQty };
    })
  );
};

  const removeItem = async (productId) => {
    try {
      const response = await fetch("http://localhost:5000/api/product/removefromcart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: user.id,   // logged-in user id
          product_id: productId,  // product id
        }),
      });

    
      const data = await response.json();
      showWebMessage("Product Removed From Cart!");
      

      if (response.ok) {
        // remove from UI after success
        setCartItems(prev => prev.filter(item => item.product_id !== productId));
        console.log(data.message);
      } else {
        console.error(data.error);
      }

    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

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
          

         <h1 className="ayam-cart-hero__title" 
            style={{ color: "#f3f3f3" }}>
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
                    <button onClick={() => updateQty(item.product_id, "dec")}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.product_id, "inc")}>+</button>
                  </div>
                  <div className="tc-subtotal">Subtotal: ₹{item.price * item.qty}</div>
                </div>
              </div>

              <button className="tc-delete" onClick={() => removeItem(item.product_id)}>
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


