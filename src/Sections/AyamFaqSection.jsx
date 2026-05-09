import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';
const faqs = [
  {
    icon: "🍳",
    tag: "Delivery",
    question: "Freshly cut, freshly packed chicken delivered to your doorstep",
    answer:
      "Ayam ensures every order is cut fresh and packed hygienically before being dispatched. We deliver directly from our farm-fresh supply chain straight to your home, maintaining the highest standards of freshness.",
  },
  {
    icon: "🏆",
    tag: "Quality",
    question: "Deliciousness in every bite",
    answer:
      "Our chicken is sourced from the finest farms and carefully selected to ensure premium taste and quality. Whether it's tender breast, juicy thighs, or succulent wings — every bite is crafted for delight.",
  },
  {
    icon: "📡",
    tag: "Technology",
    question: "Our Freshness Tracker guarantees fresh chicken delivery",
    answer:
      "With our exclusive Freshness Tracker technology, you can monitor the freshness of your chicken in real-time. We guarantee all products meet our strict freshness standards before they reach your door.",
  },
  {
    icon: "📱",
    tag: "App",
    question: "Download the Ayam App",
    answer:
      "Get the Ayam app on iOS and Android for a seamless shopping experience. Enjoy exclusive app-only deals, easy order tracking, and quick reordering of your favourite cuts — all at your fingertips.",
  },
];

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div style={{ ...styles.card, ...(isOpen ? styles.cardOpen : {}) }}>
      <div style={{ ...styles.accent, ...(isOpen ? styles.accentOpen : {}) }} />
      <button
        style={styles.trigger}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div style={{ ...styles.iconWrap, ...(isOpen ? styles.iconWrapOpen : {}) }}>
          <span style={{ fontSize: 16 }}>{faq.icon}</span>
        </div>
        <span style={styles.question}>{faq.question}</span>
        <div style={{ ...styles.toggle, ...(isOpen ? styles.toggleOpen : {}) }}>
          <span style={{ ...styles.plusH }} />
          <span
            style={{
              ...styles.plusH,
              ...styles.plusV,
              transform: isOpen ? "rotate(90deg) scaleY(0)" : "rotate(0deg) scaleY(1)",
              opacity: isOpen ? 0 : 1,
            }}
          />
        </div>
      </button>

      <div style={{ ...styles.body, maxHeight: isOpen ? "300px" : "0px" }}>
        <div style={styles.bodyInner}>
          <span style={styles.tag}>{faq.tag}</span>
          <p style={styles.answer}>{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function AyamFaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section style={styles.section}>
      <p style={styles.eyebrow}>Farm Fresh · Since 2019</p>
      <h2 style={styles.title}>
        Ayam Farm Fresh<br />Meat &amp; Fish
      </h2>

      <div style={styles.list}>
        {faqs.map((faq, i) => (
          <FaqItem
            key={i}
            faq={faq}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>

      <div style={styles.dots}>
        {faqs.map((_, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            style={{
              ...styles.dot,
              ...(openIndex === i ? styles.dotActive : {}),
            }}
            aria-label={`Go to item ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

const RED = "#c0392b";

const styles = {
  section: {
    width: "100%",
    maxWidth: "720px",
    margin: "0 auto",
    padding: "32px 16px",
    fontFamily: "'DM Sans', sans-serif",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: RED,
    margin: "0 0 6px",
  },
  title: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 26,
    fontWeight: 700,
    color: "#111",
    lineHeight: 1.2,
    margin: "0 0 28px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  card: {
    position: "relative",
    backgroundColor: "#ffffff",
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: 12,
    overflow: "hidden",
    transition: "border-color 0.2s, transform 0.2s",
  },
  cardOpen: {
    borderColor: "rgba(192,57,43,0.35)",
    transform: "translateY(-1px)",
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    background: RED,
    opacity: 0,
    borderRadius: "3px 0 0 3px",
    transition: "opacity 0.25s",
  },
  accentOpen: {
    opacity: 1,
  },
  trigger: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "17px 20px",
    cursor: "pointer",
    background: "none",
    border: "none",
    width: "100%",
    textAlign: "left",
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#f5f5f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background 0.2s",
  },
  iconWrapOpen: {
    background: "rgba(192,57,43,0.08)",
  },
  question: {
    flex: 1,
    fontSize: 14,
    fontWeight: 500,
    color: "#1a1a1a",
    lineHeight: 1.4,
    paddingRight: 12,
    fontFamily: "'DM Sans', sans-serif",
  },
  toggle: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    border: "0.5px solid rgba(0,0,0,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    position: "relative",
    transition: "background 0.2s, border-color 0.2s, transform 0.3s",
  },
  toggleOpen: {
    background: RED,
    borderColor: RED,
    transform: "rotate(45deg)",
  },
  plusH: {
    position: "absolute",
    width: 12,
    height: 1.5,
    backgroundColor: "#555",
    borderRadius: 2,
    transition: "background 0.2s",
  },
  plusV: {
    width: 1.5,
    height: 12,
    transition: "transform 0.3s ease, opacity 0.3s ease, background 0.2s",
  },
  body: {
    overflow: "hidden",
    transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  bodyInner: {
    padding: "14px 20px 18px 68px",
    borderTop: "0.5px solid #f0f0f0",
  },
  tag: {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    background: "rgba(192,57,43,0.08)",
    color: RED,
    padding: "3px 8px",
    borderRadius: 20,
    marginBottom: 10,
  },
  answer: {
    margin: 0,
    fontSize: 13.5,
    color: "#555",
    lineHeight: 1.7,
    fontFamily: "'DM Sans', sans-serif",
  },
  dots: {
    display: "flex",
    gap: 5,
    marginTop: 28,
    justifyContent: "center",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    background: "rgba(0,0,0,0.15)",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "background 0.2s, width 0.2s",
  },
  dotActive: {
    width: 18,
    background: RED,
  },
};