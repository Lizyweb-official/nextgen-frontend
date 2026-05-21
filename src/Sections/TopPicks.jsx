<<<<<<< HEAD
const products = [
  {
    id: 1,
    name: "Whole Chicken with Head & Feet",
    qty: "Processed • With/Without Skin",
    weight: "1kg–1.5kg | 1.5kg–2kg | 2kg–2.5kg",
    oldPrice: 16,
    newPrice: 15,
    tag: "Free Delivery",
    tagStyle: "coral",
    img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80&auto=format&fit=crop",
  },

  {
    id: 2,
    name: "Whole Chicken without Head & Feet",
    qty: "Processed • With/Without Skin",
    weight: "1kg–1.5kg | 1.5kg–2kg | 2kg–2.5kg",
    oldPrice: 16,
    newPrice: 15,
    tag: "Fresh",
    tagStyle: "teal",
    img: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&q=80&auto=format&fit=crop",
  },

  {
    id: 3,
    name: "Whole Chicken – Custom Cuts",
    qty: "4 / 6 / 8 / 10 / 12 / 16 / 18 / 20 pcs",
    weight: "Custom Cut • Extra RM 2",
    oldPrice: 17,
    newPrice: 15,
    tag: "Custom",
    tagStyle: "purple",
    img: "https://images.unsplash.com/photo-1529692236671-f1deff8f7d2b?w=400&q=80&auto=format&fit=crop",
  },

  {
    id: 4,
    name: "Whole Leg",
    qty: "2 / 4 / 6 / 8 pcs",
    weight: "Extra RM 2 • Premium Cut",
    oldPrice: 17,
    newPrice: 15,
    tag: "Popular",
    tagStyle: "amber",
    img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80&auto=format&fit=crop",
  },

  {
    id: 5,
    name: "Drumsticks",
    qty: "2 / 4 / 6 / 8 pcs",
    weight: "Extra RM 2 • Tender Pieces",
    oldPrice: 17,
    newPrice: 15,
    tag: "Hot Sale",
    tagStyle: "coral",
    img: "https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=400&q=80&auto=format&fit=crop",
  },

  {
    id: 6,
    name: "Boneless Breast",
    qty: "Premium Boneless Cut",
    weight: "Extra RM 2",
    oldPrice: 17,
    newPrice: 15,
    tag: "Healthy",
    tagStyle: "teal",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&auto=format&fit=crop",
  },

  {
    id: 7,
    name: "Chicken Wings",
    qty: "2 / 4 / 6 / 8 pcs",
    weight: "Extra RM 2 • Crispy Wings",
    oldPrice: 17,
    newPrice: 15,
    tag: "Snack",
    tagStyle: "purple",
    img: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80&auto=format&fit=crop",
  },

  {
    id: 8,
    name: "Boneless Chicken Cubes",
    qty: "4 / 6 / 8 pcs",
    weight: "Extra RM 2 • Ready to Cook",
    oldPrice: 17,
    newPrice: 15,
    tag: "Ready Cut",
    tagStyle: "amber",
    img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80&auto=format&fit=crop",
  },
];
const tagColors = {
  coral: { bg: "#FAECE7", color: "#712B13" },
  teal:  { bg: "#E1F5EE", color: "#085041" },
  purple:{ bg: "#EEEDFE", color: "#3C3489" },
  amber: { bg: "#FAEEDA", color: "#633806" },
};

function ProductCard({ product, onAdd }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded]   = useState(false);
  const [hovered, setHovered] = useState(false);

  const discount = Math.round(
    ((product.oldPrice - product.newPrice) / product.oldPrice) * 100
  );
  const tag = product.tagStyle ? tagColors[product.tagStyle] : null;
=======
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
>>>>>>> 6320b9ca3f2fd0bfdb6285f94e478a39f597fd6b

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
<<<<<<< HEAD
    <div
      style={{
        ...styles.card,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        borderColor: hovered ? "#d0d0d0" : "#e8e8e8",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div style={styles.imgArea}>
        <img
          src={product.img}
          alt={product.name}
          style={styles.img}
          loading="lazy"
        />
        <div style={styles.imgOverlay} />

        {tag && (
          <span style={{ ...styles.tag, background: tag.bg, color: tag.color }}>
            {product.tag}
          </span>
        )}

        <button
          onClick={() => setWished((w) => !w)}
          style={styles.wishBtn}
          aria-label="Save to wishlist"
        >
          {wished ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#D4537E" stroke="#D4537E" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          )}
        </button>
      </div>

      {/* Body */}
      <div style={styles.body}>
        <p style={styles.name}>{product.name}</p>

        <div style={styles.metaRow}>
          <span style={styles.metaItem}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            {product.qty}
          </span>
          <span style={{ color: "#ccc" }}>·</span>
          <span style={styles.metaItem}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" style={{ flexShrink: 0 }}>
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            {product.weight}
          </span>
        </div>
=======

    <section className="top-category-section" style={{ marginBottom: "20px" }} >

      {/* HEADER */}
>>>>>>> 6320b9ca3f2fd0bfdb6285f94e478a39f597fd6b

      <div className="top-category-header">

<<<<<<< HEAD
        <div style={styles.bottom}>
          <div style={styles.prices}>
            <span style={styles.oldPrice}>₹{product.oldPrice}</span>
            <div style={styles.priceRow}>
              <span style={styles.newPrice}>₹{product.newPrice}</span>
              <span style={styles.saveBadge}>{discount}% off</span>
            </div>
          </div>

          <button
            onClick={handleAdd}
            style={{
              ...styles.addBtn,
              background: added ? "#EAF3DE" : "#fff",
              borderColor: added ? "#97C459" : "#e0e0e0",
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TopPicks() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div style={styles.section}>
      <div style={styles.header}>
=======
>>>>>>> 6320b9ca3f2fd0bfdb6285f94e478a39f597fd6b
        <div>

          <p className="top-category-subtitle">
            Fresh Collection
          </p>

          <h2 className="top-category-title">
            Top Picks
          </h2>

        </div>
<<<<<<< HEAD
        <button style={styles.viewAll}>
          View all
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
=======

        <button className="top-category-view-btn">

          View All

          <i className="bi bi-arrow-right"></i>

>>>>>>> 6320b9ca3f2fd0bfdb6285f94e478a39f597fd6b
        </button>

      </div>

<<<<<<< HEAD
      <div style={styles.row}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAdd={() => setCartCount((c) => c + 1)}
          />
=======
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

>>>>>>> 6320b9ca3f2fd0bfdb6285f94e478a39f597fd6b
        ))}

<<<<<<< HEAD
      {cartCount > 0 && (
        <div style={styles.cartBar}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <span style={styles.cartText}>Added to cart</span>
          <span style={styles.cartCount}>
            {cartCount} {cartCount === 1 ? "item" : "items"}
          </span>
        </div>
      )}
    </div>
  );
}

const styles = {
  section: {
    padding: "24px 16px",
    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
    background: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "20px",
  },
  eyebrow: {
    fontSize: "10px",
    fontWeight: "600",
    letterSpacing: "1.8px",
    textTransform: "uppercase",
    color: "#999",
    margin: "0 0 4px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "500",
    fontStyle: "italic",
    fontFamily: "'Fraunces', Georgia, serif",
    color: "#111",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  viewAll: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "12px",
    color: "#555",
    background: "transparent",
    border: "0.5px solid #ddd",
    borderRadius: "8px",
    padding: "6px 12px",
    cursor: "pointer",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(178px, 1fr))",
    gap: "12px",
    width: "100%",
  },
  card: {
    width: "100%",
    background: "#fff",
    border: "0.5px solid #e8e8e8",
    borderRadius: "16px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease, border-color 0.2s ease",
  },
  imgArea: {
    position: "relative",
    width: "100%",
    height: "148px",
    overflow: "hidden",
    flexShrink: 0,
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  imgOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 55%)",
    pointerEvents: "none",
  },
  tag: {
    position: "absolute",
    top: "10px",
    left: "10px",
    fontSize: "10px",
    fontWeight: "600",
    letterSpacing: "0.3px",
    padding: "3px 8px",
    borderRadius: "20px",
  },
  wishBtn: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#fff",
    border: "0.5px solid #e8e8e8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
  },
  body: {
    padding: "11px 12px 13px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  },
  name: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#111",
    lineHeight: "1.35",
    margin: 0,
    minHeight: "36px",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "4px",
    color: "#999",
    fontSize: "11px",
    minHeight: "30px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
  },
  divider: {
    height: "0.5px",
    background: "#f0f0f0",
    margin: "2px 0",
  },
  bottom: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  prices: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  oldPrice: {
    fontSize: "11px",
    color: "#bbb",
    textDecoration: "line-through",
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  newPrice: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111",
    letterSpacing: "-0.3px",
  },
  saveBadge: {
    fontSize: "10px",
    fontWeight: "600",
    color: "#3B6D11",
    background: "#EAF3DE",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  addBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "0.5px solid #e0e0e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.15s, border-color 0.15s",
    padding: 0,
    flexShrink: 0,
  },
  cartBar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "14px",
    padding: "11px 14px",
    background: "#f7f7f5",
    borderRadius: "12px",
    border: "0.5px solid #e8e8e8",
    animation: "slideup 0.25s ease",
  },
  cartText: {
    flex: 1,
    fontSize: "13px",
    color: "#666",
  },
  cartCount: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#111",
  },
};
=======
      </Swiper>

    </section>
  );
}

export default TopPicks;
>>>>>>> 6320b9ca3f2fd0bfdb6285f94e478a39f597fd6b
