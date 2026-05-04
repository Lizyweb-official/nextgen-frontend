import React from "react";
function ShippingPolicy ()  {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">AyamNow – Shipping Policy</h1>
      <p>
        At <strong>AyamNow</strong>, we aim to deliver fresh and high-quality
        products quickly and safely to your doorstep. Please review our shipping
        policy below.
      </p>

      <h3 className="mt-4">1. Delivery Locations</h3>
      <p>
        Currently, AyamNow delivers within <strong>Chennai</strong> and nearby
        serviceable areas. Availability may vary based on your location.
      </p>

      <h3 className="mt-4">2. Delivery Timings</h3>
      <p>
        Our deliveries operate between <strong>7:00 AM and 8:30 PM</strong>,
        with multiple convenient time slots available.
      </p>

      <h5 className="mt-3">Available Slots:</h5>
      <ul>
        <li>7:00 AM – 8:30 AM</li>
        <li>8:00 AM – 9:30 AM</li>
        <li>9:00 AM – 10:30 AM</li>
        <li>10:00 AM – 11:30 AM</li>
        <li>11:00 AM – 12:30 PM</li>
        <li>12:00 PM – 1:30 PM</li>
        <li>2:00 PM – 3:30 PM</li>
        <li>3:00 PM – 4:30 PM</li>
        <li>4:00 PM – 5:30 PM</li>
        <li>5:00 PM – 6:30 PM</li>
        <li>6:00 PM – 7:30 PM</li>
        <li>7:00 PM – 8:30 PM</li>
      </ul>

      <p>
        <em>
          Note: Please place your order at least 15 minutes before your selected
          delivery slot.
        </em>
      </p>

      <h3 className="mt-4">3. Delivery Types & Charges</h3>

      <ul>
        <li>Scheduled Delivery: ₹39</li>
        <li>Express Delivery: ₹50</li>
      </ul>

      <h5 className="mt-3">Elite Members:</h5>
      <ul>
        <li>Free delivery for orders ₹299 & above</li>
        <li>₹10 for orders below ₹299</li>
      </ul>

      <h5 className="mt-3">Express (30 Minutes):</h5>
      <ul>
        <li>₹50 for orders below ₹249</li>
        <li>₹29 for ₹249 – ₹499</li>
        <li>₹19 for ₹499 & above</li>
      </ul>

      <h5 className="mt-3">Express (60 Minutes):</h5>
      <ul>
        <li>₹50 for orders below ₹149</li>
        <li>₹25 for ₹149 & above</li>
      </ul>

      <h3 className="mt-4">4. Order Processing</h3>
      <p>
        Orders are processed immediately after confirmation. Once processing has
        started, orders cannot be modified or cancelled.
      </p>

      <h3 className="mt-4">5. Delivery Conditions</h3>
      <ul>
        <li>Please ensure someone is available to receive the order</li>
        <li>Provide accurate address and contact details</li>
        <li>Delays may occur due to weather or unforeseen circumstances</li>
      </ul>

      <h3 className="mt-4">6. Failed Deliveries</h3>
      <p>
        If delivery fails due to incorrect address or unavailability, the order
        may not be re-delivered or refunded.
      </p>

      <h3 className="mt-4">7. Contact Us</h3>
      <p>
        For any shipping-related queries:
        <br />
        📞 +91-9543754375
        <br />
        📧 <a href="mailto:cs@ayamnow.com">cs@ayamnow.com</a>
      </p>

      <h3 className="mt-4">8. Policy Updates</h3>
      <p>
        AyamNow reserves the right to update this shipping policy at any time
        without prior notice.
      </p>
    </div>
  );
};

export default ShippingPolicy;