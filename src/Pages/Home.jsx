import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import React, { useEffect, useState ,useRef} from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import { Link,useNavigate } from "react-router-dom";


import slider1 from "../media/Website-Images/images-3/b1.png";
import slider2 from "../media/Website-Images/images-3/b2.png";
import slider3 from "../media/Website-Images/images-3/b3.png";


import "swiper/css";



import bg1 from "../media/Website-Images/images-3/bgimage.png";

import Cta from '../Sections/Cta';   
import HomeCategories from '../Sections/HomeCategories';

import a1 from "../media/Website-Images/images-3/e1.jpg";
import a2 from "../media/Website-Images/images-3/e2.jpg";
import a3 from "../media/Website-Images/images-3/e8.jpg";
import a4 from "../media/Website-Images/images-3/e4.jpg";
import a5 from "../media/Website-Images/images-3/e5.jpg";
import a6 from "../media/Website-Images/images-3/e6.jpg";
import a7 from "../media/Website-Images/images-3/e7.jpg";



function Home(){

  return(

  <>

  <Hero/>
  <MeatFeatures/>
  <HomeCategories/>
  <BestProduct/>
  <WhyChoose/>
  <Testimonial/>
  <Cta/>
  </>
  
  );
}


function Hero() {
  const slides = [slider1,slider2,slider3];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">
      {slides.map((img, i) => (
        <div
          key={i}
          className={`hero-slide ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
    </section>
  );
}




function MeatFeatures() {
  return (
    <section className="mf-container">
      <div className="mf-wrapper">

        {/* ITEM 1 */}
        <div className="mf-item">
          <i className="bi bi-award mf-icon"></i>
          <div>
            <h4>100% Fresh Meat</h4>
            <p>Sourced from trusted farms and delivered fresh</p>
          </div>
        </div>

        {/* ITEM 2 */}
        <div className="mf-item">
          <i className="bi bi-truck mf-icon"></i>
          <div>
            <h4>Fast & Free Delivery</h4>
            <p>Free delivery on orders over $100</p>
          </div>
        </div>

        {/* ITEM 3 */}
        <div className="mf-item">
          <i className="bi bi-shield-check mf-icon"></i>
          <div>
            <h4>Quality Guaranteed</h4>
            <p>Premium quality meat you can trust</p>
          </div>
        </div>

        {/* ITEM 4 */}
        <div className="mf-item">
          <i className="bi bi-lock mf-icon"></i>
          <div>
            <h4>Secure Payment</h4>
            <p>Safe and secure payment options</p>
          </div>
        </div>

      </div>
    </section>
  );
}


  



function BestProduct() {
  const [cart, setCart] = useState({});
  const [wish, setWish] = useState({});

  const products = [
    { id: 1, name: "Premium Boneless Cut", category: "Beef",    price: "$24.99", old: "$29.99", off: "17%", badge: "hot",   rating: "★★★★★", count: "4.9", image: a1 },
    { id: 2, name: "Chicken Breast",       category: "Chicken", price: "$8.99",  old: "$11.99", off: "25%", badge: "fresh", rating: "★★★★☆", count: "4.6", image: a2 },
    { id: 3, name: "Lamb Chops",           category: "Lamb",    price: "$22.99", old: "$27.99", off: "18%", badge: "new",   rating: "★★★★★", count: "4.8", image: a3 },
    { id: 4, name: "Chicken Wings",        category: "Chicken", price: "$10.99", old: "$13.99", off: "21%", badge: "hot",   rating: "★★★★☆", count: "4.5", image: a4 },
    { id: 5, name: "Chicken Mince",        category: "Chicken", price: "$9.99",  old: "$12.99", off: "23%", badge: "fresh", rating: "★★★★★", count: "4.7", image: a5 },
    { id: 6, name: "Chicken Feet",         category: "Chicken", price: "$11.99", old: "$14.99", off: "20%", badge: "new",   rating: "★★★☆☆", count: "4.2", image: a6 },
  ];


  const handleCart = (id) => {
    setCart(p => ({ ...p, [id]: true }));
    setTimeout(() => setCart(p => ({ ...p, [id]: false })), 2000);
  };

  return (
    <div className="best-product">
      <div className="bp-header">
        <h2><span className="bp-bar"></span>Top Selling Products</h2>
        <Link to = "/Shop">View All →</Link>
      </div>

      <Swiper
        modules={[Autoplay]}
        slidesPerView={4}
        spaceBetween={16}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        breakpoints={{
          0:    { slidesPerView: 1 },
          576:  { slidesPerView: 2 },
          768:  { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="bp-card">
              <div className="bp-img-box">
                <span className={`bp-badge ${item.badge}`}>{item.badge.toUpperCase()}</span>
                <button
                  className={`bp-wish ${wish[item.id] ? "active" : ""}`}
                  onClick={() => setWish(p => ({ ...p, [item.id]: !p[item.id] }))}
                >{wish[item.id] ? "♥" : "♡"}</button>
                <img src={item.image} alt={item.name} />
              </div>
              <div className="bp-body">
                <p className="bp-tag">{item.category}</p>
                <h3>{item.name}</h3>
                <div className="bp-stars">{item.rating} <span>({item.count})</span></div>
                <div className="bp-price-row">
                  <span className="bp-price">{item.price}</span>
                  <span className="bp-unit">/kg</span>
                  <span className="bp-old">{item.old}</span>
                  <span className="bp-off">-{item.off}</span>
                </div>
                <button
                  className={`bp-btn ${cart[item.id] ? "added" : "add"}`}
                  onClick={() => handleCart(item.id)}
                >
                  {cart[item.id] ? "✓ Added" : "Add to Cart"}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function WhyChoose() {
  return (
    <section
      className="why-container"
      style={{ backgroundImage: `url(${bg1})` }}  // 👈 only image here
    >
      <div className="overlay"></div> {/* 👈 gradient layer */}

      <div className="why-content">
        {/* <p className="tag">WHY CHOOSE CHICKFRESH?</p> */}

        <h1 style={{color:"#fff"}}>
          Quality You Can Trust, <br /> Every Time
        </h1>

        <p className="desc"  style={{color:"#fff"}}>
          From our farm to your kitchen — we ensure the highest standards of
          quality, hygiene & freshness.
        </p>

        <div className="features" style={{color:"#fff"}}>
          <div className="feature-box">
            <i className="bi bi-shield-check" style={{color:"#fff"}}></i>
            <h4 style={{color:"#fff"}}>No Antibiotics</h4>
            <p style={{color:"#fff"}}>Healthy & safe chicken</p>
          </div>

          <div className="feature-box" >
            <i className="bi bi-droplet-half" style={{color:"#fff"}}></i>
            <h4 style={{color:"#fff"}}>No Hormones</h4>
            <p style={{color:"#fff"}}>Naturally raised</p>
          </div>

          <div className="feature-box">
            <i className="bi bi-patch-check" style={{color:"#fff"}}></i>
            <h4  style={{color:"#fff"}}>Quality Tested</h4>
            <p style={{color:"#fff"}}>Every batch is tested</p>
          </div>

          <div className="feature-box">
            <i className="bi bi-snow" style={{color:"#fff"}}></i>
            <h4 style={{color:"#fff"}}>Cold Chain Delivery</h4>
            <p style={{color:"#fff"}}>Maintains freshness till delivery</p>
          </div>
        </div>
      </div>

      <div className="why-image">
        {/* <img src={bg1} alt="Fresh Chicken" /> */}

        {/* <div className="badge">
          <p>FARM FRESH</p>
          <span>PREMIUM QUALITY</span>
        </div> */}
      </div>
    </section>
  );
}

function Testimonial(){
  
const testimonials = [
   
  {
    name: "Arun Kumar",
    role: "Food Lover",
    message:
      "The chicken is always fresh and perfectly packed. Delivery is super fast. Best service in the city!",
    image: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Priya S",
    role: "Home Chef",
    message:
      "Quality is top-notch! I regularly order for my family. Very hygienic and tasty meat.",
    image: "https://i.pravatar.cc/100?img=32",
  },
  {
    name: "Rahul M",
    role: "Restaurant Owner",
    message:
      "Consistent supply and premium quality chicken. My customers love the taste!",
    image: "https://i.pravatar.cc/100?img=45",
  },
];


return(
    <>

    <section className="testimonial-section">
      <div className="ts-header">
        <h2>What Our Customers Say</h2>
        <p>Real reviews from happy customers</p>
      </div>

      <div className="ts-grid">
        {testimonials.map((item, index) => (
          <div className="ts-card" key={index}>
            <div className="ts-top">
              <img src={item.image} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                <span>{item.role}</span>
              </div>
            </div>

            <p className="ts-message">“{item.message}”</p>
          </div>
        ))}
      </div>
    </section>

    </>
  )
}

export default Home;
