import "bootstrap/dist/css/bootstrap.min.css";

import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import CTA from "../media/Website-Images/images-3/ctaimage.PNG";


import React from "react";

function Cta() {
  return (
    <>
     <section
      className="cta-section d-flex align-items-center justify-content-center text-center"
      style={{
        background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${CTA}) center/cover no-repeat`,
        padding: "80px 20px",
        color: "#fff",
      }}
    >
      <div className="container">
        <h2 className="fw-bold mb-3" style={{color:"#fff"}}>
          Fresh Meat Delivered to Your Door
        </h2>

        <p className="mb-4" style={{color:"#fff"}}>
          Premium quality cuts, hygienically packed & delivered fast.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <a href="/shop" className="btn btn-danger px-4 py-2">
            Shop Now
          </a>

          <a href="tel:+919876543210" className="btn btn-outline-light px-4 py-2">
            Call Us
          </a>
        </div>
      </div>
    </section>
    </>

  );
}


export default Cta;