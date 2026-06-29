import React from "react";
import { useState, useEffect } from "react";
import { useRef } from "react";


import { useLocation } from "../context/LocContext";

import "../css/style-1.css";
import "../css/style-2.css";
import "../css/style-3.css";
import "../css/style-4.css";
import "../css/style.css";

import { showWebMessage } from "../context/webMessageHandler";

function LocationPopup({ setShowPopup  }) {

    const [postcode, setPostcode] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        locationData,
        checkPostcode,
        } = useLocation();

    const inputRef = useRef(null);

    const [showError, setShowError] = useState(false);

    const handleCheckPostcode = async () => {
    try {
        setLoading(true);

         if (!postcode.match(/^[0-9]{5}$/)) {
            showWebMessage('Error', 'Enter valid 5-digit pincode');
            return false;
          }

        const data = await checkPostcode(postcode);

        showWebMessage(
        data.available
            ? "Delivery Available"
            : "Delivery Not Available"
        );
        
    } catch (error) {
        showWebMessage(error.message);
    } finally {
        setLoading(false);
    }
    };


const handleClosePopup = () => {
  if (locationData?.postcode) {
    setShowPopup(false);
    inputRef.current?.focus();
    window.location.reload();
  }else{
    showWebMessage(
      "Check Order Availablity to continue"
    );
    setShowPopup(true);
  }
};

  return (
    <div className="popup-overlay">
      <div className="popup-box">

        {/* Close Button */}
        <button
          className="popup-close"
          onClick={handleClosePopup}
        >
          ✖
        </button>

        <h3>Select Your Location</h3>

        <input
          ref={inputRef}
          type="text"
          placeholder="Enter Pincode"
          className="popup-input"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          style={{ marginTop: "20px" }}
        />

        <button className="popup-btn" onClick={handleCheckPostcode}>
           {loading ? "Checking..." : "Check"}
        </button>


          {locationData && (
        <div style={{ marginTop: "20px" }}>
          <p style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--color-text-secondary, #888)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            margin: "0 0 10px"
          }}>
            Selected location
          </p>

          <div style={{
            background: "var(--color-background-primary, #fff)",
            border: "0.5px solid var(--color-border-tertiary, #e5e5e5)",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px", height: "40px",
                borderRadius: "8px",
                background: "var(--color-background-secondary, #f5f5f5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0
              }}>
                📍
              </div>
              <div>
                <p style={{ fontSize: "15px", fontWeight: 500, margin: 0 }}>
                  {locationData?.city}
                </p>
                <p style={{ fontSize: "13px", color: "#888", margin: "2px 0 0" }}>
                  {locationData?.postcode}
                </p>
              </div>
            </div>

            {locationData?.available ? (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "6px 12px", borderRadius: "999px",
                background: "#EAF3DE", color: "#27500A",
                fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0
              }}>
                ✅ Order available
              </span>
            ) : (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "6px 12px", borderRadius: "999px",
                background: "#FAEEDA", color: "#633806",
                fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0
              }}>
                🕐 Coming soon
              </span>
            )}
          </div>
        </div>
      )}

      </div>
    </div>
  )
}

export default LocationPopup;