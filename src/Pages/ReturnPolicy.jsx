import React from "react";

const ReturnPolicy = () => {
  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">AyamNow – Return & Refund Policy</h1>

      <p>
        At <strong>AyamNow</strong>, we strive to deliver fresh and high-quality
        products. If you are not satisfied with your order, please review our
        return and refund policy below.
      </p>

      <h3 className="mt-4">1. Return Eligibility</h3>
      <p>
        Due to the perishable nature of our products, returns are generally not
        accepted. However, we do offer refunds or replacements under the
        following conditions:
      </p>
      <ul>
        <li>Product is spoiled or not fresh</li>
        <li>Wrong item delivered</li>
        <li>Damaged or leaking packaging</li>
        <li>Missing items in the order</li>
      </ul>

      <h3 className="mt-4">2. Reporting an Issue</h3>
      <p>
        If you face any issues with your order, please contact us within{" "}
        <strong>24 hours</strong> of delivery.
      </p>
      <ul>
        <li>
          Call customer support: <strong>+91-9543754375</strong>
        </li>
        <li>
          Email: <a href="mailto:cs@ayamnow.com">cs@ayamnow.com</a>
        </li>
        <li>Or reach us via in-app chat</li>
      </ul>

      <h3 className="mt-4">3. Refund Process</h3>
      <p>
        Once your request is verified, we will process your refund or
        replacement:
      </p>
      <ul>
        <li>Refunds will be credited within 5–7 business days</li>
        <li>
          Amount will be refunded to the original payment method or wallet
        </li>
      </ul>

      <h3 className="mt-4">4. Non-Returnable Cases</h3>
      <ul>
        <li>Change of mind after delivery</li>
        <li>Incorrect address provided by customer</li>
        <li>Failed delivery due to unavailability</li>
      </ul>

      <h3 className="mt-4">5. Order Cancellation</h3>
      <p>
        Orders can be cancelled before processing starts. Once processing or
        dispatch begins, cancellation may not be possible.
      </p>

      <h3 className="mt-4">6. Quality Assurance</h3>
      <p>
        All products are handled with strict hygiene and quality checks to
        ensure freshness and safety.
      </p>

      <h3 className="mt-4">7. Policy Updates</h3>
      <p>
        AyamNow reserves the right to update this policy at any time without
        prior notice.
      </p>
    </div>
  );
};

export default ReturnPolicy;