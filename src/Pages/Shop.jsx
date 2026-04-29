import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import React, { useState } from "react";
import ShopCategories from '../Sections/ShopCategories';

import a1 from "../media/Website-Images/images-3/e1.jpg";
import a2 from "../media/Website-Images/images-3/e2.jpg";
import a3 from "../media/Website-Images/images-3/e8.jpg";
import a4 from "../media/Website-Images/images-3/e4.jpg";
import a5 from "../media/Website-Images/images-3/e5.jpg";
import a6 from "../media/Website-Images/images-3/e6.jpg";

function Shop() {

  const productsData = [
    { id: 1, name: "Premium Boneless Cut", category: "Beef", price: 24.99, old: 29.99, badge: "hot", rating: 4.9, image: a1 },
    { id: 2, name: "Chicken Breast", category: "Chicken", price: 8.99, old: 11.99, badge: "fresh", rating: 4.6, image: a2 },
    { id: 3, name: "Lamb Chops", category: "Lamb", price: 22.99, old: 27.99, badge: "new", rating: 4.8, image: a3 },
    { id: 4, name: "Chicken Wings", category: "Chicken", price: 10.99, old: 13.99, badge: "hot", rating: 4.5, image: a4 },
    { id: 5, name: "Chicken Mince", category: "Chicken", price: 9.99, old: 12.99, badge: "fresh", rating: 4.7, image: a5 },
    { id: 6, name: "Chicken Feet", category: "Chicken", price: 11.99, old: 14.99, badge: "new", rating: 4.2, image: a6 },
  ];

  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const filteredProducts = productsData
    .filter((item) => category === "All" || item.category === category)
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "za") return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <>
      <Path />
  
      <ShopCategories 
        products={productsData}
        setCategory={setCategory}
      />
  
      <div className="shop-container center">
        <ProductSection products={filteredProducts} />
      </div>
    </>
  );
}

export default Shop;





/* ================= PATH ================= */

function Path() {
  return (
    <div className="shop-path">
      <div className="path-content">
        <h2>Shop</h2>
        <p>
          <span>Home</span> / <span className="active">Shop</span>
        </p>
      </div>
    </div>
  );
}


/* ================= PRODUCTS ================= */

function ProductSection({ products }) {

  if (products.length === 0) {
    return (
      <div className="no-products">
        <h3>No Products Available</h3>
        <p>Try selecting another category</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}



/* ================= PRODUCT CARD ================= */

function ProductCard({ item }) {
  const discount = Math.round(((item.old - item.price) / item.old) * 100);

  return (
    <div className="product-card">

      <span className="badge">{item.badge}</span>
      <span className="wishlist">♡</span>

      <img src={item.image} alt={item.name} />

      <h4>{item.name}</h4>
      <p className="category">{item.category}</p>

      <div className="rating">
        <span className="stars">★★★★★</span>
        <span className="count">({item.rating})</span>
      </div>

      <div className="price">
        <span className="new">${item.price}</span>
        <span className="old">${item.old}</span>
        <span className="discount">{discount}% OFF</span>
      </div>

      <button>Add to Cart</button>
    </div>
  );
}