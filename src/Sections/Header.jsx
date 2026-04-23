import "bootstrap/dist/css/bootstrap.min.css";

import { useAuth } from "../context/AuthContext";

import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style.css';

import { Link } from "react-router-dom";
import React, { useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FaShoppingCart, FaBars, FaTimes, FaUser ,FaTruck ,FaUserShield  } from "react-icons/fa";

import logo from '../media/Website-Images/images-1/logo.jpeg'

function Header(){

     const [menuOpen, setMenuOpen] = useState(false);
     const { user } = useAuth();

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-dark text-white py-1 text-center">
        <marquee behavior="scroll" direction="left">
          <span style={{ paddingRight: "30px" }}>Welcome to AyamNow - Your Trusted Fresh Chicken Store</span>
          <span style={{ paddingRight: "30px" }}>✧</span>
          <span style={{ paddingRight: "30px" }}>100% Fresh, Hygienic & Farm-Quality Chicken</span>
          <span style={{ paddingRight: "30px" }}>✧</span>
          <span style={{ paddingRight: "30px" }}>Expertly Cleaned & Cut, Ready to Cook </span>
          <span style={{ paddingRight: "30px" }}>✧</span>
          <span style={{ paddingRight: "30px" }}>Fast & Reliable Doorstep Delivery</span>
          <span style={{ paddingRight: "30px" }}>✧</span>
          <span style={{ paddingRight: "30px" }}>Today’s Special Deals Available – Order Now Before Stock Ends</span>
        </marquee>
      </div>

      {/* SECOND BAR */}
      <div className="container-fluid py-2 border-bottom second-bar">
        <div className="row align-items-center">
          
          {/* ICONS */}
          <div className="header-icon-cartshop col-4 col-md-3 text-start ">
            <button className="btn btn-outline-dark me-2">
              <FaShoppingCart />
            </button>

            {user? (
              user.usertype == "customer" ? (    
                <Link to="/CustomerPanel" className="btn btn-dark" ><FaUser/> {user.name}</Link>
                ) : (
                  user.usertype == "dp" ? ( 
                    <Link to="/Delivery-login" className="btn btn-dark" ><FaTruck/> Delivery Partner : {user.name}</Link>
                    ) : (
                    <Link to="/CustomerPanel" className="btn btn-dark" ><FaUserShield/> Admin : {user.name}</Link>
                    )
                )
            ) : (
              <Link to="/user-login-page" className="btn btn-dark"><FaUser/> Login </Link>
            )}


          </div>

          {/* LOGO */}
          <Link to="/" className="col-12 col-md-6 d-flex justify-content-center justify-content-md-start">
            <img src={logo} className='web-logo' />
          </Link>

          {/* SEARCH (Desktop only) */}
          <div className="col-md-3 d-none d-md-block ">

            <div className="container-fluid">
              <div className="row">

                <div className="search-icon-header-wrap col-md-1">
                    <i className="bi bi-search search-icon-header" ></i>
                  </div>

                <div className="col-md-11 ">
                    <input
                      type="text"
                      className="form-control header-search-box"
                      placeholder="Search products..."
                    />
                  </div>

                </div>
              </div>

            </div>

        </div>
      </div>

      {/* THIRD BAR */}
      <div className="third-bar-header py-2">
        <div className="container">

          {/* DESKTOP MENU */}
          <div className="d-none d-md-flex justify-content-center gap-4">
            <Link to="/" className="text-dark text-decoration-none nav-link-item" >Home</Link>
            <Link to="/Shop" className="text-dark text-decoration-none nav-link-item" >Shop</Link>
            <Link to="/About" className="text-dark text-decoration-none nav-link-item" >About</Link>
            <Link to="/Contact" className="text-dark text-decoration-none nav-link-item" >Contact</Link>
          </div>

          {/* MOBILE BAR */}
          <div className="d-flex d-md-none justify-content-between align-items-center">

            {/* SEARCH */}
            <input
              type="text"
              className="form-control me-2 header-search-box"
              placeholder="Search..."
            />

            {/* MENU ICON */}
            <button
              className="btn btn-dark"
              onClick={() => setMenuOpen(true)}
            >
              <FaBars />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {menuOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-white p-4" style={{ zIndex: 999 }}>
          
          {/* CLOSE BUTTON */}
          <div className="text-end mb-4">
            <button className="btn btn-danger" onClick={() => setMenuOpen(false)}>
              <FaTimes />
            </button>
          </div>

          {/* MENU ITEMS */}
          <div className="d-flex flex-column gap-3 text-left">
            <Link to="/" className="text-dark fs-5" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/Shop" className="text-dark fs-5" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link to="/About" className="text-dark fs-5" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/Contact" className="text-dark fs-5" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>

          {/* CART & LOGIN */}
          <div className="mt-4 text-left">
            <button className="btn btn-outline-dark me-2" onClick={() => setMenuOpen(false)}>
              <FaShoppingCart /> Cart
            </button>
            {user? (
              user.usertype == "customer" ? (    
                <Link to="/CustomerPanel" className="btn btn-dark" onClick={() => setMenuOpen(false)}><FaUser/> {user.name}</Link>
                ) : (
                  user.usertype == "dp" ? ( 
                    <Link to="/Delivery-login" className="btn btn-dark" onClick={() => setMenuOpen(false)}><FaTruck/> Delivery Partner : {user.name}</Link>
                    ) : (
                    <Link to="/CustomerPanel" className="btn btn-dark" onClick={() => setMenuOpen(false)}><FaUserShield/> Admin : {user.name}</Link>
                    )
                )
            ) : (
              <Link to="/user-login-page" className="btn btn-dark" onClick={() => setMenuOpen(false)}><FaUser/> Login </Link>
            )}
          </div>
        </div>
      )}
    </>

    );
}

export default Header;