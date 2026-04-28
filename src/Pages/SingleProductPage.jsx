import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function SingleProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [qty, setQty] = useState(1);

  // Fetch Product + Image
  useEffect(() => {
    fetch(`${API}/api/product/getproduct/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);

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

  return (
    <div className="single-product-page-container mt-5">

        {/* BREADCRUMB */}
        <nav className="single-product-page-breadcrumb">
            <ol>
            <li className="single-product-page-breadcrumb-item">
                <Link to="/">Home</Link>
            </li>
            <li className="single-product-page-breadcrumb-item">
                <Link to="/shop">Shop</Link>
            </li>
            <li className="single-product-page-breadcrumb-item active" aria-current="page">
                {product.name}
            </li>
            </ol>
        </nav>

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
                    <strong>{field.field_name}</strong> {field.field_value}
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
            <div className="single-product-page-qty-row">
                <label className="single-product-page-qty-label">Qty</label>
                <select
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="single-product-page-qty-select"
                >
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num}</option>
                ))}
                </select>
            </div>

            {/* ADD TO CART */}
            <button className="single-product-page-add-to-cart">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Add to Cart
            </button>

            </div>
        </div>
        </div>
  );
}

export default SingleProductPage;