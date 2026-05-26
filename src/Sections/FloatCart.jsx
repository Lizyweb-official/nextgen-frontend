import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

function FloatCart() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);

  // FETCH CART COUNT
  const fetchCartCount = useCallback(async () => {
    try {
      if (!user?.id) return;

      const response = await fetch(
        `${API}/api/product/getcart/${user.id}`
      );

      const data = await response.json();

      const total = data.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );

      // UPDATE ONLY IF CHANGED
      setCartCount((prev) => (prev !== total ? total : prev));

    } catch (error) {
      console.log("Cart fetch error:", error);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    // INITIAL FETCH
    fetchCartCount();

    // LIVE UPDATE EVERY 1 SECOND
    const interval = setInterval(() => {
      fetchCartCount();
    }, 1000);

    // REFRESH WHEN TAB COMES BACK
    window.addEventListener("focus", fetchCartCount);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", fetchCartCount);
    };
  }, [fetchCartCount, user]);

  return (
    <div
      onClick={() => navigate("/Cart")}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, var(--sub), var(--sub))",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        zIndex: 9999,
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
      }}
    >
      <i
        className="bi bi-cart-fill"
        style={{
          color: "#fff",
          fontSize: "26px",
        }}
      ></i>

      {cartCount > 0 && (
        <div
          style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            minWidth: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "#fff",
            color: "var(--sub)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "13px",
            fontWeight: "bold",
            padding: "2px",
          }}
        >
          {cartCount}
        </div>
      )}
    </div>
  );
}

export default FloatCart;