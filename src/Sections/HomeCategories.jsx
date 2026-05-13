import "bootstrap/dist/css/bootstrap.min.css";

import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import P1 from "../media/Website-Images/images-3/Boneless.png";
import P2 from "../media/Website-Images/images-3/Breast.jpg";
import P3 from "../media/Website-Images/images-3/Thigh.png";
import P4 from "../media/Website-Images/images-3/Leg piece.jpg";
import P5 from "../media/Website-Images/images-3/Chicken Wings.jpg";
import P6 from "../media/Website-Images/images-3/Chicken Tenderloin.png";
import P7 from "../media/Website-Images/images-3/Chicken Mince.jpg";
import P8 from "../media/Website-Images/images-3/Chicken Liver.png";
import P9 from "../media/Website-Images/images-3/Chicken Gizzard.png";
import P10 from "../media/Website-Images/images-3/Chicken Neck.png";
import P11 from "../media/Website-Images/images-3/Chicken Back.jpg";
import P12 from "../media/Website-Images/images-3/Chicken Feet.png";

import { Link } from "react-router-dom";

import React from "react";

function HomeCategories() {  
     
      const categories = [
        { name: "Boneless", img: P1 },
        { name: "Breast", img: P2 },
        { name: "Thigh", img: P3 },
        { name: "Leg piece", img:P4},
        { name: "Chicken Wings", img: P5},
        { name: "Chicken Tenderloin", img:P6 },
        { name: "Chicken Mince", img: P7 },
        { name: "Chicken Liver", img: P8 },
        { name: "Chicken Gizzard", img: P9 },
        { name: "Chicken Neck", img:P10},
        { name: "Chicken Back", img:P11 },
        { name: "Chicken Feet ", img: P12 },
      ];
      return (
          <>
          <section className="category-section">
            <h2>Explore by Category</h2>

            <div className="category-grid">
              {categories.map((item, index) => (
                <Link 
                  to={`/Shop`} 
                  className="category-card" 
                  key={index}
                >
                  <div className="circle">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </section>
        </>
      );
    }

export default HomeCategories;
