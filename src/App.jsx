import { useState,useEffect } from 'react';
import { AuthProvider } from "./context/AuthContext";

import Header from './Sections/Header';

import './css/style-1.css';
import './css/style-2.css';
import './css/style-3.css';
import './css/style-4.css';
import './css/style.css';

import Home from './Pages/Home'
import About from './Pages/About';
import Shop from './Pages/Shop';
import Contact from './Pages/Contact';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import AdminPanel from './panel/AdminPanel';
import CustomerPanel from './panel/CustomerPanel';
import DeliveryPanel from './panel/DeliveryPanel';

import OrderSuccessPage from './Pages/OrderSuccessPage';

import UserLoginPanel from './panel/user/UserLoginPanel';
import AdminLoginPanel from './panel/admin/AdminLoginPanel';

import ProductEditPage from './panel/admin/product/ProductEditPage';
import SingleProductPage from './Pages/SingleProductPage';
import OrderDetailsPage from './panel/admin/orders/OrderDetailsPage';

import FloatCart from './Sections/FloatCart';

import PrivacyPolicy from './Pages/PrivacyPolicy';
import TermsAndConditions from './Pages/TermsAndConditions';

import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Footer from './Sections/Footer';

function Layout() {
  const location = useLocation();

  const hideHeaderFooter =
    location.pathname === "/user-login-page" ||
    location.pathname === "/admin-login-page"||
    location.pathname.startsWith("/product-editor/") ||
    location.pathname.startsWith("/orderdetailpage") ||
    location.pathname === "/admin-db";

  return (
    <>
      {!hideHeaderFooter && <Header />}

      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/Shop/:catId" element={<Shop />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/checkout-t" element={<OrderSuccessPage />} />

        <Route path="/CustomerPanel" element={<CustomerPanel />} />
        <Route path="/Delivery-login" element={<DeliveryPanel />} />

        <Route path="/user-login-page" element={<UserLoginPanel />} />
        <Route path="/admin-login-page" element={<AdminLoginPanel />} />
        <Route path="/admin-db" element={<AdminPanel />} />

        <Route path="/product-editor/:id" element={<ProductEditPage />} />
        <Route path="/single-product-page/:id" element={<SingleProductPage />} />
        <Route path="/orderdetailpage/:id" element={<OrderDetailsPage />} />
        
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Routes>
      
      {!hideHeaderFooter && <Footer />}
      <FloatCart/>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // remove smooth if you want instant
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Layout />
        </Router>
      </AuthProvider>
  </>
  );
}

export default App
