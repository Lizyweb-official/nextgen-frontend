import "bootstrap/dist/css/bootstrap.min.css";

import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

const API = "http://localhost:5000";

import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

function HomeCategories() {  

      const [categories, setCategories] = useState([]);


      useEffect(() => {
        fetchCategories();
      }, []);

      console.log(categories);

  const fetchCategories = async () => {
    try {
      // GET ALL CATEGORIES
      const categoryRes = await fetch(
        `${API}/api/product/getallcategories`
      );

      const categoryData = await categoryRes.json();

      // GET IMAGE FOR EACH CATEGORY
      const updatedCategories = await Promise.all(
        categoryData.map(async (item) => {
          let imageUrl = "";

          try {
            const imageRes = await fetch(
              `${API}/api/getimagebyid/${item.image_id}`
            );

            const imageData = await imageRes.json();

            imageUrl = imageData.url;
          } catch (err) {
            console.log("Image Fetch Error:", err);
          }

          return {
            id: item.id,
            name: item.name,
            img: imageUrl,
          };
        })
      );

      setCategories(updatedCategories);
    } catch (error) {
      console.log("Category Fetch Error:", error);
    }
  };
        

      return (
          <>
          <section className="category-section">
            <h2>Explore by Category</h2>

            <div className="category-grid">
              {categories.map((item, index) => (
                <Link 
                  to={`/Shop/${item.id}`} 
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
