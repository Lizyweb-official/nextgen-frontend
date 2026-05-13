import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { showWebMessage } from "../context/webMessageHandler";

const API = import.meta.env.VITE_API_URL;

function SingleProductPage() {

  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [qty, setQty] = useState(1);
  const [pprice, setPprice] = useState();

    // INCREMENT
    const increaseQty = () => {
        setQty((prev) => (prev < 10 ? prev + 1 : prev));
    };

    // DECREMENT
    const decreaseQty = () => {
    setQty((prev) => (prev > 1 ? prev - 1 : 1));
    };

  // Fetch Product + Image
  useEffect(() => {
    fetch(`${API}/api/product/getproduct/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setPprice(data.sale_price || data.base_price);

        if (data.image_id) {
          fetch(`${API}/api/getimagebyid/${data.image_id}`)
            .then(res => res.json())
            .then(img => setImageUrl(img.url))
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }, [id]);

  if (!product) {
    return <div className="container mt-5">Loading...</div>;
  }

    const handleAddToCart = async (productId) => {
        try {

            const data = {
                customer_id: user.id,   // ✅ match backend
                product_id: productId,
                quantity: qty,
                price: pprice
            };

            console.log(data);
            const response = await fetch("http://localhost:5000/api/product/addproducttocart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            showWebMessage("Product added to cart!");

        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

  return (
    <>
   {/* BREADCRUMB HERO */}
    <div className="single-page-hero">

    <div className="single-page-hero-overlay">
        
        <nav className="single-page-breadcrumb">
        <ol className="single-page-breadcrumb-list">

            <li className="single-page-breadcrumb-item">
            <Link to="/" className="single-page-breadcrumb-link">Home</Link>
            </li>

            <li className="single-page-breadcrumb-separator">/</li>

            <li className="single-page-breadcrumb-item">
            <Link to="/shop" className="single-page-breadcrumb-link">Shop</Link>
            </li>

            <li className="single-page-breadcrumb-separator">/</li>

            <li className="single-page-breadcrumb-item active">
            {product.name}
            </li>

        </ol>
        </nav>

    </div>
</div>

    <div className="single-product-page-container mt-5">

        <div className="single-product-page-row">

            {/* LEFT - IMAGE */}
            <div className="single-product-page-image-card">
            <img
                src={imageUrl || "https://via.placeholder.com/400"}
                alt={product.name}
            />
            </div>

            {/* RIGHT - DETAILS */}
            <div className="single-product-page-details">

            {/* CATEGORY */}
            <p className="single-product-page-category">
                {product.categories?.map(cat => cat.name).join(", ")}
            </p>

            {/* NAME */}
            <h2 className="single-product-page-name">{product.name}</h2>

            {/* CUSTOM FIELDS */}
            <div className="single-product-page-custom-fields">
                {product.custom_fields?.map((field, index) => (
                <span key={index} className="single-product-page-custom-field-tag">
                    <strong>{field.field_name}</strong> | {field.field_value}
                </span>
                ))}
            </div>

            <div className="single-product-page-divider" />

            {/* SHORT DESCRIPTION */}
            <p className="single-product-page-short-description">
                {product.short_description}
            </p>

            {/* PRICE */}
            <div className="single-product-page-price-block">
                {product.sale_price ? (
                <>
                    <span className="single-product-page-original-price">
                    ₹{product.base_price}
                    </span>
                    <span className="single-product-page-sale-price">
                    ₹{product.sale_price}
                    </span>
                    <span className="single-product-page-savings-badge">
                    You save ₹{product.base_price - product.sale_price}
                    </span>
                </>
                ) : (
                <span className="single-product-page-base-price">
                    ₹{product.base_price}
                </span>
                )}
            </div>

            {/* QUANTITY */}
            <div className="single-page-qty-row">
                <label className="single-page-qty-label">Qty</label>

                <div className="single-page-qty-box">
                    <button 
                    className="single-page-qty-btn"
                    onClick={decreaseQty}
                    >
                    -
                    </button>

                    <span className="single-page-qty-value">{qty}</span>

                    <button 
                    className="single-page-qty-btn"
                    onClick={increaseQty}
                    >
                    +
                    </button>
                </div>
            </div>

                <button 
                    className="single-page-add-to-cart"
                    onClick={() => handleAddToCart(product.id)}
                    >
                    Add to Cart
                </button>

            </div>
        </div>
    </div>
    </>
  );
}

export default SingleProductPage;