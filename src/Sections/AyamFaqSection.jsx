import "../css/style-1.css";
import "../css/style-2.css";
import "../css/style-3.css";
import "../css/style-4.css";
import "../css/style.css";

import { useState } from "react";

import whychoose from "../media/Website-Images/images-3/why_1.jpg";


// const faqs = [
//   {
//     id: "01",
//     category: "Delivery",
//     title: "Freshly cut chicken delivered daily",
//     answer:
//       "Ayam delivers premium farm-fresh chicken hygienically packed and prepared for maximum freshness. Every batch is cut on the same morning it ships — never frozen, never stored overnight.",
//   },
//   {
//     id: "02",
//     category: "Quality",
//     title: "Why choose Ayam premium cuts?",
//     answer:
//       "We hand-select every cut with zero preservatives and superior quality standards. Our farm partners follow strict welfare protocols, so what reaches your kitchen is clean, ethical, and exceptional.",
//   },
//   {
//     id: "03",
//     category: "Tracking",
//     title: "Do you maintain freshness tracking?",
//     answer:
//       "Yes. Every order carries a freshness timestamp. You get real-time cold-chain visibility — from our processing facility to your doorstep — so you always know exactly how fresh your chicken is.",
//   },
//   {
//     id: "04",
//     category: "App",
//     title: "Can I order using the Ayam App?",
//     answer:
//       "Absolutely. Order in seconds, track your delivery live on a map, and unlock member-only pricing through the Ayam app. Available on iOS and Android — rated 4.9 stars.",
//   },
// ];

export default function AyamFaq() {
  // const [active, setActive] = useState(null);

  // const toggle = (i) => {
  //   setActive((prev) => (prev === i ? null : i));
  // };

  // return (
  //   <div className="f-root" style={{ marginBottom: "0px" }}>
  //     <div className="f-layout">
  //       {/* ── LEFT STICKY PANEL ── */}
  //       <aside className="f-left">
  //         <div className="f-left-bg-num" aria-hidden="true">
  //           {active !== null ? faqs[active].id : "?"}
  //         </div>

  //         <div className="f-logo-mark">
  //           <div className="f-logo-dot" />
  //           <span className="f-logo-text" style={{ color: "#fff" }}>
  //             Ayam
  //           </span>
  //         </div>

  //         <div>
  //           <h1 className="f-left-title">
  //             Common
  //             <br />
  //             <span>Questions</span>
  //           </h1>

  //           <p className="f-left-desc" style={{ color: "#fff" }}>
  //             Everything about freshness, premium cuts, delivery tracking and
  //             ordering through the app.
  //           </p>

  //           <nav className="f-dots" aria-label="FAQ navigation">
  //             {faqs.map((faq, i) => (
  //               <button
  //                 key={faq.id}
  //                 className={`f-dot-row${active === i ? " active" : ""}`}
  //                 onClick={() => toggle(i)}
  //                 aria-label={`Go to question ${faq.id}`}
  //                 style={{
  //                   background: "none",
  //                   border: "none",
  //                   cursor: "pointer",
  //                   padding: "2px 0",
  //                 }}
  //               >
  //                 <span className="f-dot" />
  //                 <span className="f-dot-label">{faq.category}</span>
  //               </button>
  //             ))}
  //           </nav>
  //         </div>

  //         <div className="f-left-footer">
  //           <a href="#" className="f-support-btn">
  //             Contact Support

  //             <svg
  //               width="15"
  //               height="15"
  //               viewBox="0 0 15 15"
  //               fill="none"
  //             >
  //               <path
  //                 d="M2.5 7.5h10M8.5 3.5l4 4-4 4"
  //                 stroke="currentColor"
  //                 strokeWidth="1.5"
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //               />
  //             </svg>
  //           </a>
  //         </div>
  //       </aside>

  //       {/* ── RIGHT SCROLLABLE PANEL ── */}
  //       <main className="f-right">
  //         <div className="f-right-header">
  //           <div className="f-counter">
  //             <span className="f-counter-pill">
  //               {active !== null
  //                 ? `${active + 1} of ${faqs.length}`
  //                 : `${faqs.length} FAQs`}
  //             </span>

  //             <span className="f-counter-total">
  //               {active !== null
  //                 ? `— ${faqs[active].category}`
  //                 : "— tap any question"}
  //             </span>
  //           </div>

  //           <span className="f-search-note">
  //             Ayam Premium Experience
  //           </span>
  //         </div>

  //         <div className="f-items" role="list">
  //           {faqs.map((faq, i) => (
  //             <div
  //               key={faq.id}
  //               className={`f-item${active === i ? " open" : ""}`}
  //               role="listitem"
  //               style={{
  //                 animationDelay: `${i * 90}ms`,
  //               }}
  //             >
  //               {/* TRIGGER */}
  //               <button
  //                 className="f-trigger"
  //                 onClick={() => toggle(i)}
  //                 aria-expanded={active === i}
  //                 aria-controls={`f-answer-${i}`}
  //               >
  //                 <span className="f-big-num" aria-hidden="true">
  //                   {faq.id}
  //                 </span>

  //                 <div className="f-text-block">
  //                   <div className="f-cat">{faq.category}</div>

  //                   <div className="f-question">{faq.title}</div>
  //                 </div>

  //                 <div className="f-icon-wrap" aria-hidden="true" />
  //               </button>

  //               {/* ANSWER */}
  //               <div
  //                 className="f-answer-shell"
  //                 id={`f-answer-${i}`}
  //                 role="region"
  //               >
  //                 <div className="f-answer-overflow">
  //                   <div className="f-answer-inner">
  //                     <div
  //                       className="f-answer-bar"
  //                       aria-hidden="true"
  //                     />

  //                     <p className="f-answer-text">{faq.answer}</p>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </main>
  //     </div>
  //   </div>
  // );

  const [active, setActive] = useState(null);

  const faqs = [
    {
      id: "01",
      title: "Freshly cut chicken delivered daily",
      answer:
        "Ayam delivers premium farm-fresh chicken hygienically packed and prepared for maximum freshness. Every batch is cut on the same morning it ships — never frozen and never stored overnight.",
    },
    {
      id: "02",
      title: "Why choose Ayam premium cuts?",
      answer:
        "We hand-select every cut with zero preservatives and superior quality standards. Our farm partners follow strict welfare protocols, ensuring clean, ethical, and exceptional quality meat.",
    },
    {
      id: "03",
      title: "Do you maintain freshness tracking?",
      answer:
        "Yes. Every order carries a freshness timestamp. You get real-time cold-chain visibility from our processing facility to your doorstep.",
    },
    {
      id: "04",
      title: "Can I order using the Ayam App?",
      answer:
        "Absolutely. Order in seconds, track your delivery live, and unlock member-only pricing through the Ayam app.",
    },
  ];

  const toggleFaq = (index) => {
    setActive(active === index ? null : index);
  };

  return (
    <>
      <section className="meat-why">
        <div className="meat-why-container">

          {/* LEFT CONTENT */}
          <div className="meat-why-left">

            <div className="meat-why-tag">
              ★ COMMON QUESTIONS
            </div>

            <h2>
              Frequently Asked <span>Questions</span>
            </h2>

            <p className="meat-why-sub">
              Everything about freshness, premium cuts, delivery tracking,
              and ordering through the Ayam app.
            </p>

            <div className="meat-why-list">
              {faqs.map((faq, index) => (
                <div key={faq.id} className="faq-item">

                  <div
                    className="meat-why-item"
                    onClick={() => toggleFaq(index)}
                    style={{
                      cursor: "pointer",
                      alignItems: "center",
                    }}
                  >
                    <div className="meat-icon">
                      {faq.id}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4>{faq.title}</h4>
                    </div>

                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        marginLeft: "15px",
                      }}
                    >
                      {active === index ? "−" : "+"}
                    </div>
                  </div>

                  {active === index && (
                    <div
                      className="faq-answer"
                      style={{
                        marginLeft: "65px",
                        marginTop: "10px",
                        marginBottom: "15px",
                        color: "#666",
                        lineHeight: "1.8",
                        animation: "fadeIn 0.3s ease",
                      }}
                    >
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT IMAGE */}
          <div className="meat-why-right">
            <img src={whychoose} alt="Ayam Premium Chicken" />

            <div className="meat-badge-top">
              Premium Quality
            </div>

            <div className="meat-badge-bottom">
              Same Day Delivery
            </div>
          </div>

        </div>
      </section>
    </>
  );
}