import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import pathbg from "../media/Website-Images/images-3/path-1.PNG";
import aboutpic from "../media/Website-Images/images-3/about-1.JPG";
import aboutpix from "../media/Website-Images/images-3/about-2.JPG";
import vision from "../media/Website-Images/images-3/vision-1.PNG";
import mision from "../media/Website-Images/images-3/mision-2.PNG";
import whychoose from "../media/Website-Images/images-3/why_1.JPG";


import Cta from '../Sections/Cta';


function About(){
    return(
        <>
        <Hero/>
        <Ourvalues/>
        <Aboutus/>
        <VisionMission/>
        <Whychoose/>
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
          <span className="hero-banner__title-highlight">Fresh Meet</span>
          <span className="hero-banner__title-main">
            Delivered to Your<br />Doorstep
          </span>
        </h1>
 
        <p className="hero-banner__subtitle">
          Order farm-fresh, hygienic<br />
          chicken delivered fast &amp; fresh.
        </p>
 
        <a href="#shop" className="hero-banner__btn">
          Shop Now
        </a>
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
            <h2>10+</h2>
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
            We are committed to delivering farm-fresh meat and seafood directly
            to your doorstep. Our products are carefully sourced, hygienically
            processed, and packed to ensure maximum freshness and taste.
          </p>

          <p className="meat-text light">
            With years of experience, we work closely with trusted farmers and
            suppliers to provide clean, safe, and premium-quality meat for your
            family.
          </p>

          <ul className="meat-list">
            <li>✔ 100% Fresh & Hygienic Processing</li>
            <li>✔ Direct Farm Sourcing</li>
            <li>✔ No Preservatives or Chemicals</li>
            <li>✔ Fast & Safe Home Delivery</li>
          </ul>

          <button className="meat-btn">Explore Products</button>
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

<p style={{ color: "#fff" }}>
  To become India’s most trusted and hygienic meat brand, delivering quality to every home.
</p>

<div className="meat-feature">
  <i className="bi bi-globe meat-icon meat-icon-red"></i>
  <div>
    <h4>Pan India Presence</h4>
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
    style={{ backgroundImage: `url(${mision})` }}
  >
    <div className="meat-overlay meat-overlay-light">
      <div className="meat-content">

        <h2>
          Our <span>Mission</span>
        </h2>

        <p className="meat-quote">
          “Farm-lendhu table varai – quality-ah control pannitu deliver pannrom.”
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
function Whychoose(){
  return(
    <>
    <section className="meat-why">
      <div className="meat-why-container">

        {/* LEFT CONTENT */}
        <div className="meat-why-left">

          <div className="meat-why-tag">★ TRUSTED BY 10,000+ CUSTOMERS</div>

          <h2>
            Why <span>Choose Us</span>
          </h2>

          <p className="meat-why-sub">
            We deliver farm-fresh, hygienic, and premium quality meat directly to your doorstep.
          </p>

          <div className="meat-why-list">

            <div className="meat-why-item">
              <div className="meat-icon">✔</div>
              <div>
                <h4>Fresh & Hygienic Meat</h4>
                <p>Processed daily with strict hygiene and zero frozen storage.</p>
              </div>
            </div>

            <div className="meat-why-item">
              <div className="meat-icon">✔</div>
              <div>
                <h4>Farm to Home Delivery</h4>
                <p>Sourced directly from trusted farms for best quality.</p>
              </div>
            </div>

            <div className="meat-why-item">
              <div className="meat-icon">✔</div>
              <div>
                <h4>100% Quality Assurance</h4>
                <p>Every cut is inspected to meet premium standards.</p>
              </div>
            </div>

            <div className="meat-why-item">
              <div className="meat-icon">✔</div>
              <div>
                <h4>Fast & Safe Delivery</h4>
                <p>Quick delivery with temperature-controlled packaging.</p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="meat-why-right">
          <img src={whychoose} alt="meat quality" />
          <div className="meat-badge-top"> Premium Quality</div>
          <div className="meat-badge-bottom">Same Day Delivery</div>
        </div>

      </div>
    </section>
 
    </>
  )
}


function Ourvalues(){
  return(
    <>

    <section className="meat-values-section">
     
      <div className="meat-values-container">

        <div className="meat-value-card">
          <i className="bi bi-droplet-fill meat-value-icon"></i>
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