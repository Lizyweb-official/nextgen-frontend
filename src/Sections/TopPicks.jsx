import "../css/style-1.css";
import "../css/style-2.css";
import "../css/style-3.css";
import "../css/style-4.css";
import "../css/style.css";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL;

function TopPicks() {

  const { user } = useAuth();
  const  navigate  = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopPicks();
  }, []);

  const fetchTopPicks = async () => {
    try {
      // STEP 1 - Get top picks
      const topRes = await fetch(`${API}/api/product/gettoppicks`);
      const topData = await topRes.json();

      const addedIds = new Set();
      let finalProducts = [];

      // STEP 2 - Get full product details + image
      for (const item of topData) {
        try {
          const productRes = await fetch(
            `${API}/api/product/getproduct/${item.product_id}`
          );

          const product = await productRes.json();

          let imageUrl = "";

          // Get image url
          if (product.image_id) {
            const imageRes = await fetch(
              `${API}/api/getimagebyid/${product.image_id}`
            );

            const imageData = await imageRes.json();
            imageUrl = imageData.url;
          }

          finalProducts.push({
            id: product.id,
            name: product.name,
            image: imageUrl,
            price: Number(product.base_price),
            sale_p: product.sale_price
              ? Number(product.sale_price)
              : null,
            custom_pieces_k: product.custom_pieces_k || "",
            items: `${item.total_qty} Sold`,
            categories: product.categories,
          });

          addedIds.add(product.id);
        } catch (err) {
          console.log("Product fetch error", err);
        }
      }

      // STEP 3 - Fill remaining products if less than 10
      if (finalProducts.length < 10) {
        const allRes = await fetch(`${API}/api/product/getallproducts`);
        const allProducts = await allRes.json();

        for (const product of allProducts) {
          // stop when reached 10
          if (finalProducts.length >= 10) break;

          // skip duplicates
          if (addedIds.has(product.id)) continue;

          let imageUrl = "";

          // Get image
          if (product.image_id) {
            try {
              const imageRes = await fetch(
                `${API}/api/getimagebyid/${product.image_id}`
              );

              const imageData = await imageRes.json();
              imageUrl = imageData.url;
            } catch (err) {
              console.log("Image fetch error", err);
            }
          }

          finalProducts.push({
            id: product.id,
            name: product.name,
            image: imageUrl,
            price: Number(product.base_price),
            sale_p: product.sale_price
              ? Number(product.sale_price)
              : null,
            custom_pieces_k: product.custom_pieces_k || "",
            items: "New Product",
            categories: product.categories,
          });

          addedIds.add(product.id);
        }
      }

      setCategories(finalProducts);
    } catch (err) {
      console.log("Top picks fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }



    //ADD TO CART
    const addToCart = async (productId,productPrice) => {

      if (!user?.id) {
        navigate('/user-login-page');
        return;
      }

      await fetch(`${API}/api/product/addproducttocart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: user.id, // 🔥 replace with logged user id
          product_id: productId,
          quantity: 1,
          price : productPrice
        }),
      });
  
      showWebMessage("product Added Added to cart");
    };


  return (

    <section className="top-category-section" style={{ marginBottom: "20px" }} >

      {/* HEADER */}

      <div className="top-category-header">

        <div>

          <p className="top-category-subtitle">
            Fresh Collection
          </p>

          <h2 className="top-category-title">
            Top Picks
          </h2>

        </div>

        <Link to='/Shop' className="top-category-view-btn">

          View All

          <i className="bi bi-arrow-right"></i>

        </Link>

      </div>

      {/* SWIPER */}

      <Swiper
        modules={[
          Navigation,
          Pagination,
          Autoplay,
        ]}

        className="top-category-swiper"

        navigation={true}

        pagination={{
          clickable: true,
        }}

        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}

        loop={true}

        spaceBetween={15}

        slidesPerView={1}

       breakpoints={{

          320: {
            slidesPerView: 1,
            spaceBetween: 15,
          },

          576: {
            slidesPerView: 1,
            spaceBetween: 15,
          },

          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },

          992: {
            slidesPerView: 3,
            spaceBetween: 25,
          },

          1200: {
            slidesPerView: 4,
            spaceBetween: 25,
          },

        }}
      >

        {categories.map((item) => (

          <SwiperSlide key={item.id}>

            <div className="top-category-card">

              <Link to={`single-product-page/${item.id}`}>

              {/* IMAGE */}

              <div className="top-category-image">

                <img
                  src={item.image}
                  alt={item.name}
                />

              </div>

              {/* OVERLAY */}

              <div className="top-category-overlay">

                <div className="top-category-content">

                  <h3>
                    {item.name}
                  </h3>

                  <div className="top-category-price-box">
                  {item.sale_p ? (
                    <div className="top-category-price">
                      <span className="top-category-old-price">₹{item.price}</span>
                      <span className="top-category-sale-price">₹{item.sale_p}</span>
                    </div>
                  ) : (
                    <div className="top-category-price">
                      <span className="top-category-sale-price">₹{item.price}</span>
                    </div>
                  )}
                </div>

                  {item.custom_pieces_k && item.custom_pieces_k.length > 0 ? (

                    <div  className="top-category-btn">

                    View Option

                    <i className="bi bi-arrow-right"></i>

                  </div>

                  ) : (

                    <button
                      className="top-category-btn"
                      onClick={(e) => {

                        e.preventDefault();
                        e.stopPropagation();

                        addToCart(
                          item.id,
                          item.sale_p || item.price
                        );
                        
                      }}
                    >
                      Add to Cart

                      <i className="bi bi-arrow-right"></i>

                    </button>

                  )}


                </div>

              </div>
              </Link>

            </div>
          </SwiperSlide>

        ))}

      </Swiper>

    </section>
  );
}

export default TopPicks;