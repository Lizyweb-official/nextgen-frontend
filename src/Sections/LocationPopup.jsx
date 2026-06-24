import React from "react";
import { useState, useEffect } from "react";

import { useLocation } from "../context/LocContext";

import "../css/style-1.css";
import "../css/style-2.css";
import "../css/style-3.css";
import "../css/style-4.css";
import "../css/style.css";

function LocationPopup({ setShowPopup }) {

    const [postcode, setPostcode] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        locationData,
        checkPostcode,
        } = useLocation();


    const handleCheckPostcode = async () => {
    try {
        setLoading(true);

        const data = await checkPostcode(postcode);

        alert(
        data.available
            ? "Delivery Available"
            : "Delivery Not Available"
        );
    } catch (error) {
        alert(error.message);
    } finally {
        setLoading(false);
    }
    };


  return (
    <div className="popup-overlay">
      <div className="popup-box">

        {/* Close Button */}
        <button
          className="popup-close"
          onClick={() => setShowPopup(false)}
        >
          ✖
        </button>

        <h3>Select Your Location</h3>

        <input
          type="text"
          placeholder="Enter Pincode"
          className="popup-input"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
        />

        <button className="popup-btn" onClick={handleCheckPostcode}>
           {loading ? "Checking..." : "Check"}
        </button>


          {locationData && (
        <div style={{ marginTop: "20px" }}>
          <h3>Selected Location</h3>

          <p>
            {locationData.city +" - "+locationData.postcode}
          </p>

          <p>
            <strong>Available:</strong>{" "}
            {locationData.available ? "Yes" : "No"}
          </p>
        </div>
      )}

      </div>
    </div>
  )
}

export default LocationPopup;