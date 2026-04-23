import "bootstrap/dist/css/bootstrap.min.css";

import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style.css';

import logo from '../media/Website-Images/images-1/foot-logo.jpg'

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
                    
                    <Link to="/" className="footer-logo-wrap"><img src={logo} className="footer-logo"/></Link>
                    <p className="footer-brand-text">
                    AyamNow is your trusted destination for fresh, hygienic, and high-quality chicken.
                    We ensure every order is carefully cleaned, cut, and packed to maintain freshness.
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
                    <li><a href="/shop" className="footer-link"><span className="footer-link-arrow">›</span>Privacy Policy</a></li>
                    <li><a href="/" className="footer-link"><span className="footer-link-arrow">›</span>Terms & Conditions</a></li>
                    <li><a href="/about" className="footer-link"><span className="footer-link-arrow">›</span>Refund Policy</a></li>
                    <li><a href="/contact" className="footer-link"><span className="footer-link-arrow">›</span>Shipping Policy</a></li>
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
                    <p className="footer-contact-text">support@mystore.com</p>
                    </div>

                    <div className="footer-contact-item">
                    <div className="footer-contact-icon">
                        {/* Phone SVG */}
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M3 2h2.5l1 3-1.5 1.5a8 8 0 003.5 3.5L10 8.5l3 1V12a1 1 0 01-1 1C5.373 13 2 9.627 2 3a1 1 0 011-1z" stroke="#000000" strokeWidth="1.2"/>
                        </svg>
                    </div>
                    <p className="footer-contact-text">+91 98765 43210</p>
                    </div>

                    <div className="footer-contact-item">
                    <div className="footer-contact-icon">
                        {/* Location SVG */}
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5zm0 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" stroke="#000000" strokeWidth="1.2"/>
                        </svg>
                    </div>
                    <p className="footer-contact-text">Tamil Nadu, India</p>
                    </div>
                </div>

                </div>
            </div>

            <hr className="footer-divider" />

            {/* COPYRIGHT BAR */}
            <div className="footer-bottom">
                <p className="footer-copyright">
                © {new Date().getFullYear()} AyamNow. All rights reserved.
                </p>
            </div>

            </footer>
        </>
    );
}

export default Footer;