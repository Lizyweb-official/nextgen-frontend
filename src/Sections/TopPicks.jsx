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

function TopPicks() {

  const categories = [

    {
      id: 1,
      name: "Boneless Chicken",
      image: P1,
      items: "12 Items",
    },

    {
      id: 2,
      name: "Chicken Breast",
      image: P2,
      items: "8 Items",
    },

    {
      id: 3,
      name: "Chicken Thigh",
      image: P3,
      items: "10 Items",
    },

    {
      id: 4,
      name: "Leg Piece",
      image: P4,
      items: "15 Items",
    },

    {
      id: 5,
      name: "Chicken Wings",
      image: P5,
      items: "20 Items",
    },

    {
      id: 6,
      name: "Chicken Tenderloin",
      image: P6,
      items: "7 Items",
    },

    {
      id: 7,
      name: "Chicken Mince",
      image: P7,
      items: "9 Items",
    },

    {
      id: 8,
      name: "Chicken Liver",
      image: P8,
      items: "5 Items",
    },

    {
      id: 9,
      name: "Chicken Gizzard",
      image: P9,
      items: "6 Items",
    },

    {
      id: 10,
      name: "Chicken Neck",
      image: P10,
      items: "11 Items",
    },

    {
      id: 11,
      name: "Chicken Back",
      image: P11,
      items: "4 Items",
    },

    {
      id: 12,
      name: "Chicken Feet",
      image: P12,
      items: "13 Items",
    },

  ];

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

        <button className="top-category-view-btn">

          View All

          <i className="bi bi-arrow-right"></i>

        </button>

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

        spaceBetween={25}

        slidesPerView={4}

        breakpoints={{

          320: {
            slidesPerView: 1.2,
          },

          576: {
            slidesPerView: 2,
          },

          768: {
            slidesPerView: 2.5,
          },

          992: {
            slidesPerView: 3,
          },

          1200: {
            slidesPerView: 4,
          },

        }}
      >

        {categories.map((item) => (

          <SwiperSlide key={item.id}>

            <div className="top-category-card">

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

                  <span className="top-category-count">
                    {item.items}
                  </span>

                  <h3>
                    {item.name}
                  </h3>

                  <button className="top-category-btn">

                    Shop Now

                    <i className="bi bi-arrow-right"></i>

                  </button>

                </div>

              </div>

            </div>

          </SwiperSlide>

        ))}

      </Swiper>

    </section>
  );
}

export default TopPicks;