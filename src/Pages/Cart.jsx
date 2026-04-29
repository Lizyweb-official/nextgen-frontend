import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';
import chickenBreast from "../media/Website-Images/images-2/BONELESS.png";
import wings from "../media/Website-Images/images-2/WINGS.PNG";
import boneless from "../media/Website-Images/images-2/CHEST.png";

import React, { useState } from "react";

function Cart() {
  const [cart, setCart] = useState([
    { id: 1, name: "Fresh Chicken Breast", pack: "500g", price: 4.5, qty: 1, image: chickenBreast },
    { id: 2, name: "Chicken Wings", pack: "1kg", price: 6.0, qty: 1, image: wings },
    { id: 3, name: "Boneless Chicken", pack: "750g", price: 7.5, qty: 1, image: boneless }
  ]);

  const increase = (id) => setCart(cart.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
  const decrease = (id) => setCart(cart.map(item => item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item));
  const removeItem = (id) => setCart(cart.filter(item => item.id !== id));

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = 3;
  const total = subtotal + shipping;
  const itemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      <div className="container-fluid page-header py-5">
      <h1
        className="text-center text-white display-6 wow fadeInUp"
        data-wow-delay="0.1s"
      >
        Cart 
      </h1>

      <ol
        className="breadcrumb justify-content-center mb-0 wow fadeInUp"
        data-wow-delay="0.3s"
      >
        <li className="breadcrumb-item">
          <a href="Home.jsx">Home</a>
        </li>
       
        <li className="breadcrumb-item active text-white">
          Cart 
        </li>
      </ol>
    </div>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div className="cart-page">
        <div className="cart-container">

          {/* Header */}
          <div className="cart-header">
            <h2 className="cart-title">Chicken Cart</h2>
            <span className="cart-count">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
          </div>

          {/* Table */}
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th style={{ width: "35%" }}>Product</th>
                  <th>Pack</th>
                  <th>Price</th>
                  <th className="center">Qty</th>
                  <th>Total</th>
                  <th className="center">Remove</th>
                </tr>
              </thead>

              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-msg">Your cart is empty.</td>
                  </tr>
                ) : cart.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="product-cell">
                        <img src={item.image} alt={item.name} />
                        <span>{item.name}</span>
                      </div>
                    </td>

                    <td><span className="pack-tag">{item.pack}</span></td>

                    <td>${item.price.toFixed(2)}</td>

                    <td className="center">
                      <div className="qty-wrap">
                        <button onClick={() => decrease(item.id)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => increase(item.id)}>+</button>
                      </div>
                    </td>

                    <td className="row-total">${(item.price * item.qty).toFixed(2)}</td>

                    <td className="center">
                      <button className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="summary-outer">
            <div className="summary-box">
              <div className="summary-title">Order Summary</div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>

              <hr />

              <div className="summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button className="checkout-btn">
                Proceed to Checkout →
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Cart;