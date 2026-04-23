import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style.css';

import Contacthero from "../media/Website-Images/images-3/Contacthero-1.jpg";
import FAQ from "../media/Website-Images/images-3/faq-1.PNG";


import Cta from '../Sections/Cta';


import React, { useState } from "react";


function Contact(){
    return(
        <>
        <ContactHero/>
        <ContactInfo/>
        <GoogleMap/>
        <FAQSection/>
        <Cta/>
        </>
    );
}
function ContactHero(){
    return(
        <>
         <section
      className="ayam-contact-hero"
      style={{ backgroundImage: `url(${Contacthero})` }}
    >
      <div className="ayam-contact-hero__overlay"></div>
      <div className="ayam-contact-hero__radial-glow"></div>

      <div className="ayam-contact-hero__content">
        <div className="ayam-contact-hero__badge">
          <span className="ayam-contact-hero__badge-dot"></span>
          Fresh Meat Delivered Daily
        </div>

        <h1 className="ayam-contact-hero__title">Get in Touch</h1>
        <div className="ayam-contact-hero__divider"></div>

        <p className="ayam-contact-hero__subtitle">
          Questions about our fresh cuts, orders, or delivery?<br />
          Our team is ready to help — anytime.
        </p>

        <div className="ayam-contact-hero__buttons">
          <button className="ayam-contact-hero__btn-primary">Contact Support</button>
          <button className="ayam-contact-hero__btn-secondary">Track Order</button>
        </div>
      </div>
    </section>

        </>
    )
}

function ContactInfo() {
  return (
    <>
     <section className="ayam-ci-section">
      <div className="ayam-ci-header">
        <span className="ayam-ci-badge">Contact Information</span>
        <h2 className="ayam-ci-title">How to Reach Us</h2>
        <p className="ayam-ci-subtitle">
          We're always here for you — reach out anytime.
        </p>
      </div>

      <div className="ayam-ci-grid">

        <div className="ayam-ci-card">
          <div className="ayam-ci-icon-wrap">
            <i className="bi bi-geo-alt-fill ayam-ci-icon"></i>
          </div>
          <div className="ayam-ci-divider"></div>
          <h3 className="ayam-ci-card-title">Address</h3>
          <p className="ayam-ci-card-text">
            123 Fresh Meat Street,<br />Chennai, Tamil Nadu
          </p>
        </div>

        <div className="ayam-ci-card">
          <div className="ayam-ci-icon-wrap">
            <i className="bi bi-telephone-fill ayam-ci-icon"></i>
          </div>
          <div className="ayam-ci-divider"></div>
          <h3 className="ayam-ci-card-title">Phone Number</h3>
          <p className="ayam-ci-card-text">+91 98765 43210</p>
        </div>

        <div className="ayam-ci-card">
          <div className="ayam-ci-icon-wrap">
            <i className="bi bi-envelope-fill ayam-ci-icon"></i>
          </div>
          <div className="ayam-ci-divider"></div>
          <h3 className="ayam-ci-card-title">Email Address</h3>
          <p className="ayam-ci-card-text">support@freshmeatshop.com</p>
        </div>

        <div className="ayam-ci-card">
          <div className="ayam-ci-icon-wrap">
            <i className="bi bi-clock-fill ayam-ci-icon"></i>
          </div>
          <div className="ayam-ci-divider"></div>
          <h3 className="ayam-ci-card-title">Working Hours</h3>
          <p className="ayam-ci-card-text">7 AM – 9 PM<br />Mon – Sun</p>
        </div>

      </div>
    </section>
    </>
     );
}

function GoogleMap() {
  return (
    <>
    <section className="ayam-map-section">

      <div className="ayam-map-header">
        <span className="ayam-map-badge">Our Location</span>
        <h2 className="ayam-map-title">Find Us On Map</h2>
        {/* <p className="ayam-map-subtitle">
          Visit us at our store — we'd love to serve you fresh!
        </p> */}
      </div>

      <div className="ayam-map-pills">
        <div className="ayam-map-pill ayam-map-pill--red">
          <i className="bi bi-geo-alt-fill ayam-map-pill-icon"></i>
          <span>123 Fresh Meat Street, Chennai, Tamil Nadu</span>
        </div>
        <div className="ayam-map-pill ayam-map-pill--yellow">
          <i className="bi bi-clock-fill ayam-map-pill-icon ayam-map-pill-icon--yellow"></i>
          <span>Open: 7 AM – 9 PM</span>
        </div>
      </div>

      <div className="ayam-map-frame-wrap">
        <div className="ayam-map-top-bar"></div>
        <iframe
          title="shop-location"
          src="https://www.google.com/maps?q=Chennai,Tamil%20Nadu&output=embed"
          allowFullScreen=""
          loading="lazy"
          className="ayam-map-iframe"
        ></iframe>
      </div>

      <div className="ayam-map-actions">

        
      </div>

    </section>

    </>
  )
}

function FAQSection() {
 
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      icon: "bi-truck",
      question: "What areas do you deliver fresh meat to?",
      answer:
        "We deliver fresh chicken, mutton, and seafood across Chennai. Enter your pincode at checkout to confirm availability.",
    },
    {
      icon: "bi-box-seam",
      question: "How can I track my meat order?",
      answer:
        "After placing your order, you will receive a tracking link via SMS or email to track your delivery in real time.",
    },
    {
      icon: "bi-cash-coin",
      question: "What is your refund policy?",
      answer:
        "If you receive damaged or wrong items, report within 2 hours. We provide quick refunds or replacements with no hassle.",
    },
    {
      icon: "bi-egg-fried",
      question: "How do you ensure meat freshness?",
      answer:
        "Our meat is freshly sourced, hygienically cut, and delivered in temperature-controlled packaging every single day.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  }

  return (
    <section className="faq-wrap">
      <div className="faq-container">

        {/* LEFT IMAGE */}
        <div className="faq-left">
          <img src={FAQ} alt="Fresh Meat" />
        </div>

        {/* RIGHT FAQ */}
        <div className="faq-right">
          <span className="faq-badge">HELP CENTER</span>
          <h2 className="faq-title">Quick Help & FAQs</h2>
          <p className="faq-sub">
            Everything you need to know about your order
          </p>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-card ${
                  activeIndex === index ? "open" : ""
                }`}
              >
                <div
                  className="faq-q"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="faq-icon-wrap">
                    <i className={`bi ${faq.icon}`}></i>
                  </div>

                  <span className="faq-q-text">
                    {faq.question}
                  </span>

                  <div className="faq-toggle">
                    <i
                      className={`bi ${
                        activeIndex === index
                          ? "bi-x"
                          : "bi-plus"
                      }`}
                    ></i>
                  </div>
                </div>

                <div className="faq-divider"></div>

                <div
                  className={`faq-ans ${
                    activeIndex === index ? "open" : ""
                  }`}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}





export default Contact;