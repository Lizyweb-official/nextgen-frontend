import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import pathbg from "../media/Website-Images/images-3/path-1.png";
import aboutpic from "../media/Website-Images/images-3/about-1.jpg";
import aboutpix from "../media/Website-Images/images-3/about-2.jpg";
import vision from "../media/Website-Images/images-3/vision-1.jpg";
import mision from "../media/Website-Images/images-3/mission-2.jpg";
import WhyChooseUs_1 from "../media/Website-Images/images-3/why--2.jpeg";

import Cta from '../Sections/Cta';

import { Link } from 'react-router-dom';

function About(){
    return(
        <>
        <Hero/>
        <Ourvalues/>
        <Aboutus/>
        <VisionMission/>
        <WhyChooseUs/>
        <Cta/>
        
        </>
    );
}

function Hero(){
   return(
    <>
    <div className="hero-banner">
      {/* 
        Replace the src below with your local image path.
        Example: src={bgImage}  OR  src="/assets/chicken-bg.jpg"
      */}
      <img
        className="hero-banner__bg"
        src={pathbg}
        alt="Fresh farm background"
      />
 
      {/* Gradient overlay to fade image on the left for text readability */}
      <div className="hero-banner__overlay" />
 
      {/* Text Content */}
      <div className="hero-banner__content">
        <h1 className="hero-banner__title">
          <span className="hero-banner__title-highlight">Fresh Meat</span>
          <span className="hero-banner__title-main">
            Delivered to Your<br />Doorstep
          </span>
        </h1>
 
        <p className="hero-banner__subtitle">
          Order farm-fresh, hygienic, Halal<br />
          chicken delivered fast &amp; fresh.
        </p>
 
        <Link to="/Shop" className="hero-banner__btn">
          Shop Now
        </Link>
      </div>
    </div>

  
    </>
    );
}


function Aboutus(){
  return(
    <> 
    <section className="meat-about-section">
      <div className="meat-about-wrapper">

        {/* LEFT IMAGES */}
        <div className="meat-image-box">
          <img
            src={aboutpic}
            alt="fresh meat"
            className="meat-main-img"
          />

          <img
            src={aboutpix}
            alt="cutting meat"
            className="meat-sub-img"
          />

          <div className="meat-badge" >
            <h2 style={{color:"#fff"}}>10+</h2>
            <p style={{color:"#fff"}}>Years Fresh Quality</p>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="meat-content-box">
          <span className="meat-tag">WHO WE ARE</span>

          <h2>
            Fresh Meat Delivered with <span>Quality & Trust</span>
          </h2>

          <p className="meat-text">
            We are committed to delivering farm-fresh Halal chicken directly to your doorstep. Our chicken is carefully sourced from trusted farms, hygienically processed, and packed to preserve freshness, quality, and great taste.
          </p>

          <p className="meat-text light">
            With years of experience, we work closely with reliable poultry farmers and certified suppliers to provide clean, safe, premium-quality Halal chicken for your family.
          </p>

          <ul className="meat-list">
            <li>✔ 100% Fresh & Hygienic Halal Processing</li>
            <li>✔ Direct Farm Sourcing</li>
            <li>✔ No Preservatives or Chemicals</li>
            <li>✔ Fast & Safe Home Delivery</li>
          </ul>

          <Link to="/Shop" className="meat-btn">Explore Products</Link>
        </div>

      </div>
    </section>

    </>
  );
}



function VisionMission(){
  return(
    <>
  <div className="meat-about">

  {/* LEFT - VISION */}
  <div
    className="meat-about-left"
    style={{ backgroundImage: `url(${vision})` }}
  >
    <div className="meat-overlay meat-overlay-dark">
      <div className="meat-content">
       <h2>
  Our <span>Vision</span>
</h2>

<p className="meat-quote" style={{ color: "#fff", marginTop: "20px" }}>
  To become Malaysia’s most trusted and hygienic meat brand, delivering quality to every home.
</p>

<div className="meat-feature">
  <i className="bi bi-globe meat-icon meat-icon-red"></i>
  <div>
    <h4>Pan Malaysia Presence</h4>
    <p>Expanding our reach to serve customers across the country</p>
  </div>
</div>

<div className="meat-feature">
  <i className="bi bi-award meat-icon"></i>
  <div>
    <h4>Trusted Brand</h4>
    <p>Building a reputation for quality, reliability, and transparency</p>
  </div>
</div>

<div className="meat-feature">
  <i className="bi bi-lightning-charge meat-icon meat-icon-red"></i>
  <div>
    <h4>Fast & Smart Delivery</h4>
    <p>Leveraging technology for quicker and more efficient service</p>
  </div>
</div>

<div className="meat-feature">
  <i className="bi bi-people meat-icon"></i>
  <div>
    <h4>Customer-Centric Growth</h4>
    <p>Putting customer satisfaction at the heart of everything we do</p>
  </div>
</div>

<div className="meat-feature">
  <i className="bi bi-stars meat-icon meat-icon-red"></i>
  <div>
    <h4>Premium Experience</h4>
    <p>Delivering a consistently high-quality experience with every order</p>
  </div>
  </div>
      </div>
    </div>
  </div>

  {/* RIGHT - MISSION */}
  <div
    className="meat-about-right"
    style={{   backgroundImage: `
    linear-gradient(
      rgba(255, 255, 255, 0.47),
      rgba(255, 255, 255, 0.34)
    ),
    url(${mision})
  ` ,
  
  }}
  >
    <div className="meat-overlay meat-overlay-light">
      <div className="meat-content meat-content-light">

        <h2>
          Our <span>Mission</span>
        </h2>

        <p className="meat-quote meat-quote-light">
          “From farm to your table – delivering with quality controlled at every step.”
        </p>

        <div className="meat-feature">
          <i className="bi bi-egg-fried meat-icon meat-icon-red"></i>
          <div>
            <h4>100% Fresh Cuts</h4>
            <p style={{ color: "#5d6471" }}> Daily sourcing, no frozen compromise</p>
          </div>
        </div>

        <div className="meat-feature">
          <i className="bi bi-shield-check meat-icon"></i>
          <div>
            <h4>Hygienic Processing</h4>
            <p style={{ color: "#5d6471" }}>Clean environment, safe handling</p>
          </div>
        </div>

        <div className="meat-feature">
          <i className="bi bi-truck meat-icon meat-icon-red"></i>
          <div>
            <h4>Fast Delivery</h4>
            <p style={{ color: "#5d6471" }}>Same-day delivery</p>
          </div>
        </div>

        <div className="meat-feature">
          <i className="bi bi-box-seam meat-icon"></i>
          <div>
            <h4>Secure Packaging</h4>
            <p style={{ color: "#5d6471" }}>Leak-proof & fresh</p>
          </div>
        </div>

        <div className="meat-feature">
          <i className="bi bi-hand-thumbs-up meat-icon meat-icon-red"></i>
          <div>
            <h4>Customer Trust First</h4>
            <p style={{ color: "#5d6471" }}>No shortcuts in quality</p>
          </div>
        </div>

      </div>
    </div>
  </div>

</div>

    </>
  )
}



const features = [
  {
    icon: "bi-lightning-charge-fill",
    tag: "Delivery",
    title: "Same-day to your door",
    desc: "Fresh products picked and dispatched within hours of your order.",
  },
  {
    icon: "bi-patch-check-fill",
    tag: "Quality",
    title: "Hand-selected every time",
    desc: "Every item passes a strict freshness check before it reaches you.",
  },
  {
    icon: "bi-shield-lock-fill",
    tag: "Payments",
    title: "Safe & flexible checkout",
    desc: "Pay your way — cards, UPI, wallets, and more, all fully secured.",
  },
  {
    icon: "bi-people-fill",
    tag: "Trust",
    title: "10,000+ happy customers",
    desc: "Real people, real reviews. Our reputation is built on satisfaction.",
  },
];

const stats = [
  { value: "10K+", label: "Customers" },
  { value: "50K+", label: "Orders" },
  { value: "99%",  label: "Satisfaction" },
  { value: "2 hr", label: "Avg. Delivery" },
];

function WhyChooseUs() {
  return (
    <section className="wcu-section">
      <div className="wcu-container">

        {/* Two-column: image left, content right */}
        <div className="wcu-layout">

          {/* LEFT — Image */}
          <div className="wcu-image-col">
            <div className="wcu-image-wrap">
              <img
                src={WhyChooseUs_1}
                alt="Fresh grocery delivery"
                className="wcu-image"
              />
              {/* Floating stat badge */}
              <div className="wcu-badge">
                <span className="wcu-badge-value">99%</span>
                <span className="wcu-badge-label">Customer Satisfaction</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Content */}
          <div className="wcu-content-col">

            <div className="wcu-top">
              <span className="wcu-label">Why choose us</span>
              <h2 className="wcu-heading">
                More than a store —<br />
                <em>a promise we keep.</em>
              </h2>
            </div>

            <div className="wcu-stats">
              {stats.map((s, i) => (
                <div className="wcu-stat" key={i}>
                  <span className="wcu-stat-value">{s.value}</span>
                  <span className="wcu-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="wcu-rule" />

            <div className="wcu-features">
              {features.map((f, i) => (
                <div className="wcu-feature" key={i}>
                  <div className="wcu-icon-wrap">
                    <i className={`bi ${f.icon}`}></i>
                  </div>
                  <div className="wcu-feature-body">
                    <div className="wcu-feature-top">
                      <h3>{f.title}</h3>
                      <span className="wcu-feature-tag">{f.tag}</span>
                    </div>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}




function Ourvalues(){
  return(
    <>

    <section className="meat-values-section">
     
      <div className="meat-values-container">

        <div className="meat-value-card">
          <i className="bi bi-droplet meat-value-icon"></i>
          <h3>Freshness First</h3>
          <p>We deliver farm-fresh meat daily with zero compromise.</p>
        </div>

        <div className="meat-value-card">
          <i className="bi bi-shield-check meat-value-icon"></i>
          <h3>100% Hygiene</h3>
          <p>Clean and safe processing with certified standards.</p>
        </div>

        <div className="meat-value-card">
          <i className="bi bi-truck meat-value-icon"></i>
          <h3>Fast Delivery</h3>
          <p>Quick doorstep delivery with temperature control.</p>
        </div>

        <div className="meat-value-card">
          <i className="bi bi-heart-pulse meat-value-icon"></i>
          <h3>Customer Trust</h3>
          <p>We ensure quality and build long-term relationships.</p>
        </div>

      </div>
    </section>

    </>
  );
}

export default About;
