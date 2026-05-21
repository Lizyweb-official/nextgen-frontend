import { useState, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

<<<<<<< HEAD

=======
>>>>>>> dd9423ff4ce880d4efa16e04f62fcf534c7f2bfd
import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

const faqs = [
  {
    tag: "Delivery",
    num: "01",
    q: "Freshly cut, freshly packed chicken delivered to your doorstep",
    a: "Ayam ensures every order is cut fresh and packed hygienically before being dispatched. We deliver directly from our farm-fresh supply chain straight to your home, maintaining the highest standards of freshness.",
  },
  {
    tag: "Quality",
    num: "02",
    q: "Deliciousness in every bite",
    a: "Our chicken is sourced from the finest farms and carefully selected to ensure premium taste and quality. Whether it's tender breast, juicy thighs, or succulent wings — every bite is crafted for delight.",
  },
  {
    tag: "Technology",
    num: "03",
    q: "Our Freshness Tracker guarantees fresh chicken delivery",
    a: "With our exclusive Freshness Tracker technology, you can monitor the freshness of your chicken in real-time. We guarantee all products meet our strict freshness standards before they reach your door.",
  },
  {
    tag: "App",
    num: "04",
    q: "Download the Ayam App",
    a: "Get the Ayam app on iOS and Android for a seamless shopping experience. Enjoy exclusive app-only deals, easy order tracking, and quick reordering of your favourite cuts — all at your fingertips.",
  },
];

const TICK_ITEMS = [
  "Farm Fresh", "Since 2019", "Chennai", "Premium Cuts",
  "Zero Preservatives", "Daily Delivery", "Freshness Tracked", "Ayam",
  "Farm Fresh", "Since 2019", "Chennai", "Premium Cuts",
  "Zero Preservatives", "Daily Delivery", "Freshness Tracked", "Ayam",
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&family=DM+Mono:wght@400;500&display=swap');

  .ayam-shell *, .ayam-shell *::before, .ayam-shell *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  .ayam-shell {
    --r: #c8321f;
    --r2: #e84a35;
    --muted: #8a7d75;
    --ease: cubic-bezier(0.77, 0, 0.18, 1);
    font-family: 'Crimson Pro', Georgia, serif;
    background: #0e0c0b;
    overflow: hidden;
    position: relative;
    border-radius: 16px;
  }

  .ayam-noise {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.6;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  }

  /* Ticker */
  .ayam-ticker {
    background: var(--r);
    overflow: hidden; white-space: nowrap; padding: 9px 0;
  }
  .ayam-ticker-track {
    display: inline-flex; animation: ayam-tick 18s linear infinite;
  }
  .ayam-ticker-item {
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    color: rgba(255,255,255,0.9); padding: 0 28px;
  }
  .ayam-ticker-sep { color: rgba(255,255,255,0.4); }
  @keyframes ayam-tick {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* Hero */
  .ayam-hero {
    padding: 32px 28px 0;
    display: grid; grid-template-columns: 1fr auto;
    align-items: start; gap: 12px;
  }
  .ayam-kicker {
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--r2); margin-bottom: 8px;
    display: flex; align-items: center; gap: 8px;
  }
  .ayam-kicker-dot {
    width: 5px; height: 5px; border-radius: 50%; background: var(--r2);
    animation: ayam-pulse 2s ease-in-out infinite;
  }
  @keyframes ayam-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.7); }
  }
  .ayam-big-title {
    font-family: 'Bebas Neue', Impact, sans-serif;
    font-size: 62px; line-height: 0.92; color: #f7f4ef; letter-spacing: 0.02em;
  }
  .ayam-big-title .ayam-red { color: var(--r2); }
  .ayam-score-block { text-align: right; padding-top: 4px; }
  .ayam-score-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 52px; line-height: 1; color: var(--r2);
    transition: color 0.3s;
  }
  .ayam-score-of {
    font-family: 'DM Mono', monospace;
    font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--muted); margin-top: -2px; text-align: right;
  }

  /* Sep */
  .ayam-sep { margin: 20px 28px 0; height: 0.5px; background: rgba(255,255,255,0.1); }

  /* FAQ rows */
  .ayam-faq-panel { padding: 0 28px; }

  .ayam-row {
    border-bottom: 0.5px solid rgba(255,255,255,0.07);
    position: relative; cursor: pointer;
    transition: background 0.3s var(--ease);
  }
  .ayam-row:first-child { border-top: 0.5px solid rgba(255,255,255,0.07); }
  .ayam-row.ayam-open { background: rgba(255,255,255,0.03); }
  .ayam-row::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 0;
    background: var(--r); transition: width 0.4s var(--ease);
  }
  .ayam-row.ayam-open::before { width: 3px; }

  .ayam-row-head {
    display: grid; grid-template-columns: 52px 1fr 48px;
    align-items: center; gap: 12px; padding: 18px 0 18px 12px;
    background: none; border: none; width: 100%; text-align: left; cursor: pointer;
  }
  .ayam-row-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px; line-height: 1; color: rgba(255,255,255,0.15);
    transition: color 0.3s var(--ease); text-align: center;
  }
  .ayam-row.ayam-open .ayam-row-num { color: var(--r2); }

  .ayam-row-text { display: flex; flex-direction: column; gap: 3px; }
  .ayam-row-tag {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--muted); transition: color 0.25s;
  }
  .ayam-row.ayam-open .ayam-row-tag { color: var(--r2); }
  .ayam-row-q {
    font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.8);
    line-height: 1.4; font-style: italic;
    font-family: 'Crimson Pro', Georgia, serif;
    transition: color 0.25s;
  }
  .ayam-row.ayam-open .ayam-row-q { color: #fff; }

  .ayam-toggle-icon {
    width: 36px; height: 36px; border-radius: 50%;
    border: 0.5px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; justify-content: center;
    justify-self: center; position: relative; overflow: hidden;
    transition: background 0.3s var(--ease), border-color 0.3s, transform 0.45s var(--ease);
  }
  .ayam-row.ayam-open .ayam-toggle-icon {
    background: var(--r); border-color: var(--r); transform: rotate(135deg);
  }
  .ayam-plus-h, .ayam-plus-v {
    position: absolute; background: rgba(255,255,255,0.5);
    border-radius: 2px; transition: background 0.2s;
  }
  .ayam-row.ayam-open .ayam-plus-h,
  .ayam-row.ayam-open .ayam-plus-v { background: #fff; }
  .ayam-plus-h { width: 11px; height: 1.5px; }
  .ayam-plus-v {
    width: 1.5px; height: 11px;
    transition: opacity 0.3s, background 0.2s;
  }
  .ayam-row.ayam-open .ayam-plus-v { opacity: 0; }

  /* Body */
  .ayam-row-body {
    overflow: hidden; max-height: 0;
    transition: max-height 0.45s var(--ease);
  }
  .ayam-row-body-inner { padding: 0 12px 22px 76px; }
  .ayam-answer-wrap {
    position: relative; padding: 18px 20px;
    background: rgba(255,255,255,0.04); border-radius: 8px;
    border: 0.5px solid rgba(255,255,255,0.08); overflow: hidden;
  }
  .ayam-answer-wrap::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--r) 0%, var(--r2) 100%);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.5s var(--ease) 0.15s;
  }
  .ayam-row.ayam-open .ayam-answer-wrap::after { transform: scaleX(1); }
  .ayam-ans-text {
    font-size: 14px; font-weight: 300; color: rgba(255,255,255,0.55);
    line-height: 1.8; font-family: 'Crimson Pro', Georgia, serif;
  }

  /* Bottom bar */
  .ayam-bottom-bar {
    padding: 20px 28px 32px;
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 4px;
  }
  .ayam-step-dots { display: flex; align-items: center; gap: 5px; }
  .ayam-dot {
    height: 2px; border-radius: 2px; background: rgba(255,255,255,0.15);
    transition: width 0.35s var(--ease), background 0.3s;
    cursor: pointer; border: none; padding: 0; width: 16px;
  }
  .ayam-dot.ayam-dot-on { width: 32px; background: var(--r2); }

  .ayam-fresh-pill {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 14px; border: 0.5px solid rgba(255,255,255,0.1);
    border-radius: 40px; cursor: pointer; background: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .ayam-fresh-pill:hover {
    background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.2);
  }
  .ayam-fp-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #3ecf6e;
    box-shadow: 0 0 6px #3ecf6e; animation: ayam-glow 2s ease-in-out infinite;
  }
  @keyframes ayam-glow {
    0%, 100% { box-shadow: 0 0 4px #3ecf6e; }
    50%       { box-shadow: 0 0 10px #3ecf6e; }
  }
  .ayam-fp-text {
    font-family: 'DM Mono', monospace;
    font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase;
    color: rgba(255,255,255,0.45);
  }
  .ayam-fp-arrow { font-size: 10px; color: rgba(255,255,255,0.25); }
`;

function FaqRow({ faq, isOpen, onToggle }) {
  return (
    <div className={`ayam-row${isOpen ? " ayam-open" : ""}`}>
      <button className="ayam-row-head" onClick={onToggle} aria-expanded={isOpen}>
        <span className="ayam-row-num">{faq.num}</span>
        <div className="ayam-row-text">
          <span className="ayam-row-tag">{faq.tag}</span>
          <span className="ayam-row-q">{faq.q}</span>
        </div>
        <div className="ayam-toggle-icon">
          <span className="ayam-plus-h" />
          <span className="ayam-plus-v" />
        </div>
      </button>
      <div className="ayam-row-body" style={{ maxHeight: isOpen ? "260px" : "0px" }}>
        <div className="ayam-row-body-inner">
          <div className="ayam-answer-wrap">
            <p className="ayam-ans-text">{faq.a}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AyamFaq() {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const styleId = "ayam-faq-styles";
    if (!document.getElementById(styleId)) {
      const tag = document.createElement("style");
      tag.id = styleId;
      tag.textContent = css;
      document.head.appendChild(tag);
    }
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <div className="ayam-shell">
      <div className="ayam-noise" />

      {/* Ticker */}
      <div className="ayam-ticker">
        <div className="ayam-ticker-track">
          {TICK_ITEMS.map((t, i) => (
            <span key={i} className="ayam-ticker-item">
              {i % 2 === 1 ? (
                <><span className="ayam-ticker-sep">✦</span> {t}</>
              ) : t}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="ayam-hero">
        <div>
          <div className="ayam-kicker">
            <div className="ayam-kicker-dot" />
            Farm Fresh · Chennai
          </div>
          <div className="ayam-big-title">
            AYAM<br />
            <span className="ayam-red">FRESH</span><br />
            CUTS
          </div>
        </div>
        <div className="ayam-score-block">
          <div className="ayam-score-num">{open !== null ? "01" : "00"}</div>
          <div className="ayam-score-of">expanded</div>
        </div>
      </div>

      <div className="ayam-sep" />

      {/* FAQ */}
      <div className="ayam-faq-panel">
        {faqs.map((f, i) => (
          <FaqRow key={i} faq={f} isOpen={open === i} onToggle={() => toggle(i)} />
        ))}
      </div>

      {/* Bottom bar */}
      <div className="ayam-bottom-bar">
        <div className="ayam-step-dots">
          {faqs.map((_, i) => (
            <button
              key={i}
              className={`ayam-dot${open === i ? " ayam-dot-on" : ""}`}
              onClick={() => toggle(i)}
              aria-label={`Item ${i + 1}`}
            />
          ))}
        </div>
        <button className="ayam-fresh-pill">
          <div className="ayam-fp-dot" />
          <span className="ayam-fp-text">Freshness Live</span>
          <span className="ayam-fp-arrow">↗</span>
        </button>
      </div>
    </div>
  );
}
