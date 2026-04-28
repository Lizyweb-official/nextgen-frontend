import { useState } from 'react'
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

import AdminPanel from './panel/AdminPanel';
import CustomerPanel from './panel/CustomerPanel';
import DeliveryPanel from './panel/DeliveryPanel';

import UserLoginPanel from './panel/user/UserLoginPanel';
import AdminLoginPanel from './panel/admin/AdminLoginPanel';

import ProductEditPage from './panel/admin/product/ProductEditPage';
import SingleProductPage from './Pages/SingleProductPage';

import { BrowserRouter as Router, Routes, Route, useLocation  } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Footer from './Sections/Footer';

function Layout() {
  const location = useLocation();

  const hideHeaderFooter =
    location.pathname === "/user-login-page" ||
    location.pathname === "/admin-login-page"||
    location.pathname.startsWith("/product-editor/") ||
    location.pathname === "/admin-db";

  return (
    <>
      {!hideHeaderFooter && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/Contact" element={<Contact />} />

        <Route path="/CustomerPanel" element={<CustomerPanel />} />
        <Route path="/Delivery-login" element={<DeliveryPanel />} />

        <Route path="/user-login-page" element={<UserLoginPanel />} />
        <Route path="/admin-login-page" element={<AdminLoginPanel />} />
        <Route path="/admin-db" element={<AdminPanel />} />

        <Route path="/product-editor/:id" element={<ProductEditPage />} />
        <Route path="/single-product-page/:id" element={<SingleProductPage />} />
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </>
  );
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
