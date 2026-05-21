import "bootstrap/dist/css/bootstrap.min.css";

import { useAuth } from "../context/AuthContext";

import "../css/style-1.css";
import "../css/style-2.css";
import "../css/style-3.css";
import "../css/style-4.css";
import "../css/style.css";

const API = import.meta.env.VITE_API_URL;

import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaTruck,
  FaUserShield,
} from "react-icons/fa";

import logo from "../media/Website-Images/images-1/logo.jpeg";

function Header() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { user } = useAuth();

  /* FETCH CART */

  const fetchCartCount = () => {

    if (user?.id) {

      fetch(`${API}/api/product/getcart/${user.id}`)
        .then((res) => res.json())
        .then((data) => {

          const totalQty = data.reduce(
            (total, item) => total + Number(item.quantity),
            0
          );

          setCartCount(totalQty);

        });

    }

  };

  useEffect(() => {

    fetchCartCount();

    const interval = setInterval(() => {
      fetchCartCount();
    }, 1000);

    return () => clearInterval(interval);

  }, [user]);

  /* FETCH PRODUCTS */

  useEffect(() => {

    fetch(`${API}/api/product/getallproducts`)
      .then((res) => res.json())
      .then((data) => {

        console.log(data);

        const sortedProducts = data.sort((a, b) => {

          const nameA =
            (
              a.product_name ||
              a.name ||
              a.productname ||
              ""
            ).toLowerCase();

          const nameB =
            (
              b.product_name ||
              b.name ||
              b.productname ||
              ""
            ).toLowerCase();

          return nameA.localeCompare(nameB);

        });

        setProducts(sortedProducts);

      });

  }, []);

  /* SEARCH */

  const handleSearch = (value) => {

    setSearch(value);

    if (value.trim() === "") {

      setFilteredProducts([]);

      return;

    }

    const filtered = products
      .filter((product) => {

        const productName =
          (
            product.product_name ||
            product.name ||
            product.productname ||
            ""
          ).toLowerCase();

        const searchValue = value.toLowerCase();

        return (
          productName.startsWith(searchValue) ||
          productName.includes(searchValue)
        );

      })
      .slice(0, 5);

    setFilteredProducts(filtered);

  };

  return (
    <>

      {/* TOP BAR */}

      <div className="bg-dark text-white py-1 text-center">

        <marquee behavior="scroll" direction="left">

          <span style={{ paddingRight: "30px" }}>
            Welcome to AyamNow - Your Trusted Fresh Chicken Store
          </span>

          <span style={{ paddingRight: "30px" }}>✧</span>

          <span style={{ paddingRight: "30px" }}>
            100% Fresh, Hygienic & Farm-Quality Chicken
          </span>

          <span style={{ paddingRight: "30px" }}>✧</span>

          <span style={{ paddingRight: "30px" }}>
            Expertly Cleaned & Cut, Ready to Cook
          </span>

          <span style={{ paddingRight: "30px" }}>✧</span>

          <span style={{ paddingRight: "30px" }}>
            Fast & Reliable Doorstep Delivery
          </span>

          <span style={{ paddingRight: "30px" }}>✧</span>

          <span style={{ paddingRight: "30px" }}>
            Today’s Special Deals Available – Order Now Before Stock Ends
          </span>

        </marquee>

      </div>

      {/* SECOND BAR */}

      <div className="container-fluid py-2 border-bottom second-bar">

        <div className="row align-items-center">

          {/* ICONS */}

          <div className="header-icon-cartshop col-4 col-md-3 text-start">

            <Link
              to="/Cart"
              className="btn btn-outline-dark me-2 position-relative"
            >

              <FaShoppingCart />

              {cartCount > 0 && (

                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{
                    fontSize: "10px",
                    padding: "5px 7px",
                  }}
                >
                  {cartCount}
                </span>

              )}

            </Link>

            {user ? (

              user.usertype == "customer" ? (

                <Link to="/CustomerPanel" className="btn btn-dark">
                  <FaUser /> {user.name}
                </Link>

              ) : user.usertype == "dp" ? (

                <Link to="/Delivery-login" className="btn btn-dark">
                  <FaTruck /> Delivery Partner : {user.name}
                </Link>

              ) : (

                <Link to="/CustomerPanel" className="btn btn-dark">
                  <FaUserShield /> Admin : {user.name}
                </Link>

              )

            ) : (

              <Link to="/user-login-page" className="btn btn-dark">
                <FaUser /> Login
              </Link>

            )}

          </div>

          {/* LOGO */}

          <Link
            to="/"
            className="col-12 col-md-6 d-flex justify-content-center justify-content-md-start"
          >

            <img src={logo} className="web-logo" />

          </Link>

          {/* SEARCH DESKTOP */}

          <div className="col-md-3 d-none d-md-block">

            <div className="search-wrapper">

              <i className="bi bi-search search-icon-header"></i>

              <input
                type="text"
                className="form-control header-search-box"
                placeholder="Search products..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {filteredProducts.length > 0 && (

                <div className="search-dropdown">

                  {filteredProducts.map((product) => {

                    const productName =
                      product.product_name ||
                      product.name ||
                      product.productname;

                    const regex = new RegExp(`(${search})`, "gi");

                    const highlightedName =
                      productName.split(regex);

                    return (

                      <Link
                        key={product.id}
                        to={`/Single-product/${product.id}`}
                        className="search-dropdown-item"
                      >

                        {highlightedName.map((part, index) =>

                          part.toLowerCase() ===
                          search.toLowerCase() ? (

                            <span
                              key={index}
                              className="search-highlight"
                            >
                              {part}
                            </span>

                          ) : (

                            <span key={index}>
                              {part}
                            </span>

                          )

                        )}

                      </Link>

                    );

                  })}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

      {/* THIRD BAR */}

      <div className="third-bar-header">

        <div className="container">

          {/* DESKTOP MENU */}

          {/* <div className="d-none d-md-flex justify-content-center gap-4">

            <Link
              to="/"
              className="text-dark text-decoration-none nav-link-item"
            >
              Home
            </Link>

            <Link
              to="/Shop"
              className="text-dark text-decoration-none nav-link-item"
            >
              Shop
            </Link>

            <Link
              to="/About"
              className="text-dark text-decoration-none nav-link-item"
            >
              About
            </Link>

            <Link
              to="/Contact"
              className="text-dark text-decoration-none nav-link-item"
            >
              Contact
            </Link>

          </div> */}

          {/* MOBILE BAR */}

          <div className="d-flex d-md-none justify-content-between align-items-center py-2">

            {/* MOBILE SEARCH */}

            <div className="mobile-search-wrapper">

              <i className="bi bi-search search-icon-header"></i>

              <input
                type="text"
                className="form-control me-2 header-search-box"
                placeholder="Search..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {filteredProducts.length > 0 && (

                <div className="search-dropdown mobile-search-dropdown">

                  {filteredProducts.map((product) => {

                    const productName =
                      product.product_name ||
                      product.name ||
                      product.productname;

                    const regex = new RegExp(`(${search})`, "gi");

                    const highlightedName =
                      productName.split(regex);

                    return (

                      <Link
                        key={product.id}
                        to={`/Single-product/${product.id}`}
                        className="search-dropdown-item"
                      >

                        {highlightedName.map((part, index) =>

                          part.toLowerCase() ===
                          search.toLowerCase() ? (

                            <span
                              key={index}
                              className="search-highlight"
                            >
                              {part}
                            </span>

                          ) : (

                            <span key={index}>
                              {part}
                            </span>

                          )

                        )}

                      </Link>

                    );

                  })}

                </div>

              )}

            </div>

            {/* MENU BUTTON */}

            <button
              className="btn btn-dark ms-2"
              onClick={() => setMenuOpen(true)}
            >

              <FaBars />

            </button>

          </div>

        </div>

      </div>

      {/* MOBILE MENU */}

      {menuOpen && (

        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-white p-4"
          style={{ zIndex: 999 }}
        >

          {/* CLOSE */}

          <div className="text-end mb-4">

            <button
              className="btn btn-danger"
              onClick={() => setMenuOpen(false)}
            >

              <FaTimes />

            </button>

          </div>

          {/* MENU */}

          <div className="d-flex flex-column gap-3 text-left">

            <Link
              to="/"
              className="text-dark fs-5"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/Shop"
              className="text-dark fs-5"
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>

            <Link
              to="/About"
              className="text-dark fs-5"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>

            <Link
              to="/Contact"
              className="text-dark fs-5"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>

          </div>

        </div>

      )}

    </>
  );

}

export default Header;