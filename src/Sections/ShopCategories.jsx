import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import React, { useRef } from "react";

import P1 from "../media/Website-Images/images-4/Biriyani.png";
import P2 from "../media/Website-Images/images-4/Chicken.png";
import P3 from "../media/Website-Images/images-4/Dry Fish.png";
import P4 from "../media/Website-Images/images-4/Eggs.png";
import P5 from "../media/Website-Images/images-4/Mutton.png";
import P6 from "../media/Website-Images/images-4/Pickles.png";
import P7 from "../media/Website-Images/images-4/Ready To Cook.png";
import P8 from "../media/Website-Images/images-4/Sea Food.png";
import P9 from "../media/Website-Images/images-4/Snacks.png";
import P10 from "../media/Website-Images/images-4/Spices.png";

function ShopCategories({ products, setCategory }) {
  const sliderRef = useRef();

  const allCategories = {
    "Biriyani": P1,
    "Chicken": P2,
    "Dry Fish": P3,
    "Eggs": P4,
    "Mutton": P5,
    "Pickles": P6,
    "Ready To Cook": P7,
    "Sea Food": P8,
    "Snacks": P9,
    "Spices": P10,
  };

  const handleScroll = (dir) => {
    if (dir === "left") sliderRef.current.scrollLeft -= 200;
    else sliderRef.current.scrollLeft += 200;
  };

  return (
    <div className="shop-category-slider">
      <h3>Shop by Category</h3>

      <button className="slider-btn left" onClick={() => handleScroll("left")}>‹</button>
      <button className="slider-btn right" onClick={() => handleScroll("right")}>›</button>

      <div className="slider-track" ref={sliderRef}>
        {Object.keys(allCategories).map((cat, index) => {
          const isAvailable = products.some(p => p.category === cat);

          return (
            <div
              key={index}
              className={`shop-category-card ${!isAvailable ? "disabled" : ""}`}
              onClick={() => isAvailable && setCategory(cat)}
            >
              <div className="circle">
                <img src={allCategories[cat]} alt={cat} />
              </div>

              <span>{cat}</span>

              {!isAvailable && (
                <p className="not-available">Not Available</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShopCategories;