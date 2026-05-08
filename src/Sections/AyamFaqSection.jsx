import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

const faqs = [
  {
    question: "Freshly cut, freshly packed chicken delivered to your doorstep",
    answer:
      "Ayam ensures every order is cut fresh and packed hygienically before being dispatched. We deliver directly from our farm-fresh supply chain straight to your home, maintaining the highest standards of freshness.",
  },
  {
    question: "Deliciousness in every bite",
    answer:
      "Our chicken is sourced from the finest farms and carefully selected to ensure premium taste and quality. Whether it's tender breast, juicy thighs, or succulent wings — every bite is crafted for delight.",
  },
  {
    question: "Our Freshness Tracker Guarantees Fresh chicken delivery",
    answer:
      "With our exclusive Freshness Tracker technology, you can monitor the freshness of your chicken in real-time. We guarantee all products meet our strict freshness standards before they reach your door.",
  },
  {
    question: "Download the Ayam App",
    answer:
      "Get the Ayam app on iOS and Android for a seamless shopping experience. Enjoy exclusive app-only deals, easy order tracking, and quick reordering of your favourite cuts — all at your fingertips.",
  },
];

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={styles.faqItem}>
      <button style={styles.faqHeader} onClick={() => setOpen(!open)}>
        <span style={styles.faqQuestion}>{question}</span>
        <div style={styles.iconWrapper}>
          {/* Horizontal bar */}
          <span style={styles.iconBar} />
          {/* Vertical bar — fades out when open */}
          <span
            style={{
              ...styles.iconBar,
              ...styles.iconBarVertical,
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              opacity: open ? 0 : 1,
            }}
          />
        </div>
      </button>

      <div
        style={{
          ...styles.faqBody,
          maxHeight: open ? "300px" : "0px",
        }}
      >
        <div style={styles.faqBodyInner}>{answer}</div>
      </div>
    </div>
  );
}

export default function AyamFaqSection() {
  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>Ayam Farm Fresh Meat &amp; Fresh Fish</h2>
      <div style={styles.list}>
        {faqs.map((faq, i) => (
          <FaqItem key={i} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}

const styles = {
  section: {
    width: "100%",
    maxWidth: "720px",
    margin: "0 auto",
    padding: "32px 16px",
    fontFamily: "'DM Sans', sans-serif",
  },
  heading: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#111111",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "14px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  faqItem: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    transition: "box-shadow 0.2s ease",
  },
  faqHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "16px 20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
  },
  faqQuestion: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1a1a1a",
    flex: 1,
    paddingRight: "16px",
    fontFamily: "'DM Sans', sans-serif",
  },
  iconWrapper: {
    width: "22px",
    height: "22px",
    flexShrink: 0,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBar: {
    position: "absolute",
    width: "14px",
    height: "2px",
    backgroundColor: "#e53935",
    borderRadius: "2px",
    transition: "transform 0.3s ease, opacity 0.3s ease",
  },
  iconBarVertical: {
    width: "2px",
    height: "14px",
  },
  faqBody: {
    overflow: "hidden",
    transition: "max-height 0.35s ease",
    padding: "0 20px",
  },
  faqBodyInner: {
    fontSize: "13.5px",
    color: "#555555",
    lineHeight: "1.6",
    borderTop: "1px solid #f0f0f0",
    paddingTop: "12px",
    paddingBottom: "16px",
  },
};
