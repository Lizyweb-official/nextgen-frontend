import React from "react";

import "../css/style-1.css";
import "../css/style-2.css";
import "../css/style-3.css";
import "../css/style-4.css";
import "../css/style.css";


function LocationPopup({ setShowPopup }) {
    




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
        />

        <button className="popup-btn">
          Check Availability
        </button>

      </div>
    </div>
  )
}

export default LocationPopup;