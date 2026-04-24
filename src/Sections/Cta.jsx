import "bootstrap/dist/css/bootstrap.min.css";

import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style.css';

import CTA from "../media/Website-Images/images-3/ctaimage.PNG";


function Cta(){
    return(
    <>
    <section className="cta" style={{ backgroundImage: `url(${CTA})` }}>
      
      {/* LEFT DARK EFFECT */}
      <div className="cta-overlay"></div>

      <div className="cta-content">
        <p className="cta-top">We’re Here For You! </p>

        <h1 className="cta-title">
          FRESH MEAT,<br />
          <span>BETTER SUPPORT</span>
        </h1>

        <div className="cta-divider">
          <span></span>
          <i className="bi bi-knife"></i>
          <span></span>
        </div>

        <p className="cta-desc">
          Have a question, need help with your order,
          <br />
          or just want to say hello?
        </p>

       <a href="tel:+919876543210" className="cta-call">
      <div className="icon">
        <i className="bi bi-telephone-fill"></i>
      </div>

      <div className="call-text">
        <span>Call Us Anytime</span>
        <h3>+91 98765 43210</h3>
      </div>
    </a>


      </div>

      <div className="cta-bottom">
        <div>
          <i className="bi bi-headset"></i> We Care. We Listen. We Help.
        </div>
        <div>
          <i className="bi bi-cart"></i> Your Satisfaction is Our Priority!
        </div>
      </div>

    </section>

    </>
    );
}

export default Cta;