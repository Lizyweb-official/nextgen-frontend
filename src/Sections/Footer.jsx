import "bootstrap/dist/css/bootstrap.min.css";

import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import { Link } from "react-router-dom";

function Footer(){
    return(
        <>
          {/* FOOTER */}
            <footer className="footer-root">

            {/* MAIN FOOTER */}
            <div className="footer-main">
                <div className="footer-grid">

                {/* ABOUT */}
                <div className="footer-col footer-info-first">
                    
                    <h6 className="footer-logo-wrap">Ayam<span>Kini</span></h6>
                    <small className="company-tagline" style={{color:"#fff"}}>Fresh | Hygiene | Halal</small>
                    <p className="company-number" style={{color:"#fff"}}>202603098137 (NS0321640-W)</p>
                    <p className="footer-brand-text">
                    AyamKini is your trusted destination for fresh, hygienic, and premium-quality Halal chicken. Every order is carefully cleaned, cut, and packed for maximum freshness.
                    </p>
                </div>

                {/* QUICK LINKS */}
                <div className="footer-col">
                    <h3 className="footer-col-title">Quick links</h3>
                    <ul className="footer-links">
                    <li><Link to="/" className="footer-link"><span className="footer-link-arrow">›</span>Home</Link></li>
                    <li><Link to="/shop" className="footer-link"><span className="footer-link-arrow">›</span>Shop</Link></li>
                    <li><Link to="/about" className="footer-link"><span className="footer-link-arrow">›</span>About</Link></li>
                    <li><Link to="/contact" className="footer-link"><span className="footer-link-arrow">›</span>Contact</Link></li>
                    </ul>
                </div>

                {/* QUICK LINKS */}
                <div className="footer-col">
                    <h3 className="footer-col-title">Site Links</h3>
                    <ul className="footer-links">
                    <li><Link to="/privacy-policy" className="footer-link"><span className="footer-link-arrow">›</span>Privacy Policy</Link></li>
                    <li><Link to="/terms-and-conditions" className="footer-link"><span className="footer-link-arrow">›</span>Terms & Conditions</Link></li>
                    </ul>
                </div>

                {/* CONTACT */}
                <div className="footer-col">
                    <h3 className="footer-col-title">Contact us</h3>

                    <div className="footer-contact-item">
                    <div className="footer-contact-icon">
                        {/* Email SVG */}
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4l6 4 6-4M2 4h12v9H2V4z" stroke="#000000" strokeWidth="1.2" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <a href="mailto:info@gwcsgroup.com" className="footer-contact-text">info@gwcsgroup.com</a>
                    </div>

                    <div className="footer-contact-item">
                    <div className="footer-contact-icon">
                        {/* Phone SVG */}
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 2h2.5l1 3-1.5 1.5a8 8 0 003.5 3.5L10 8.5l3 1V12a1 1 0 01-1 1C5.373 13 2 9.627 2 3a1 1 0 011-1z" stroke="#000000" strokeWidth="1.2"/>
                        </svg>
                    </div>
                    <a href="tel:+60 16 213 7648" className="footer-contact-text">+60 16 213 7648</a>
                    </div>

                    <div className="footer-contact-item">
                    <div className="footer-contact-icon">
                        {/* Location SVG */}
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" stroke="#000000" strokeWidth="1.2"/>
                        </svg>
                    </div>
                    <p className="footer-contact-text">NO63 JALAN SUNGAI CONGKAK 32/45 TAMAN BUKIT RIMAU 40460 SHAH ALAM,SELANGOR</p>
                    </div>
                </div>

                </div>
            </div>

            <hr className="footer-divider" />

            {/* COPYRIGHT BAR */}
            <div className="footer-bottom">
                <p className="footer-copyright">
                © {new Date().getFullYear()} AyamKini. All rights reserved.
                </p>
            </div>

            </footer>
        </>
    );
}

export default Footer;