import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";


import "bootstrap/dist/css/bootstrap.min.css";


import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

const products = [
  {
    id: 1,
    name: "Chicken Curry Cut (Skin On)",
    qty: "10–12 pcs",
    weight: "960–1000 gms",
    oldPrice: 355,
    newPrice: 349,
    icon: "bi-egg-fried",
    tag: "Popular",
    tagStyle: "coral",
  },
  {
    id: 2,
    name: "Freshwater Pomfret — Yellow",
    qty: "6–8 pcs",
    weight: "Gross 500–700 gms · Net 350–490 gms",
    oldPrice: 179,
    newPrice: 169,
    icon: "bi-water",
    tag: "Fresh catch",
    tagStyle: "teal",
  },
  {
    id: 3,
    name: "Chicken Breast Boneless",
    qty: "2–3 pcs",
    weight: "240–280 gms",
    oldPrice: 185,
    newPrice: 179,
    icon: "bi-box2",
    tag: null,
    tagStyle: null,
  },
  {
    id: 4,
    name: "Premium Curry Cut (Skin On)",
    qty: "5–6 pcs",
    weight: "480–500 gms",
    oldPrice: 179,
    newPrice: 175,
    icon: "bi-award",
    tag: "New",
    tagStyle: "purple",
  },
  {
    id: 5,
    name: "Premium Curry Cut (Skin On)",
    qty: "5–6 pcs",
    weight: "480–500 gms",
    oldPrice: 175,
    newPrice: 169,
    icon: "bi-award",
    tag: "Limited",
    tagStyle: "amber",
  },
];

const tagColors = {
  coral:  { bg: "#FAECE7", color: "#712B13" },
  teal:   { bg: "#E1F5EE", color: "#085041" },
  purple: { bg: "#EEEDFE", color: "#3C3489" },
  amber:  { bg: "#FAEEDA", color: "#633806" },
};

function ProductCard({ product, onAdd }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const discount = Math.round((product.oldPrice - product.newPrice) / product.oldPrice * 100);
  const tag = product.tagStyle ? tagColors[product.tagStyle] : null;

  const handleAdd = () => {
    if (added) return;
    setAdded(true);
    onAdd();
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div style={styles.card}>
      <div style={styles.imgArea}>
        <i className={`bi ${product.icon}`} style={styles.mainIcon} aria-hidden="true" />
        {tag && (
          <span style={{ ...styles.tag, background: tag.bg, color: tag.color }}>
            {product.tag}
          </span>
        )}
        <button
          onClick={() => setWished(w => !w)}
          style={styles.wishBtn}
          aria-label="Save to wishlist"
        >
          <i
            className={wished ? "bi bi-heart-fill" : "bi bi-heart"}
            style={{ fontSize: 13, color: wished ? "#D4537E" : "#aaa" }}
          />
        </button>
      </div>

      <div style={styles.body}>
        <p style={styles.name}>{product.name}</p>

        <div style={styles.metaRow}>
          <span style={styles.metaItem}>
            <i className="bi bi-box" style={styles.metaIcon} />
            {product.qty}
          </span>
          <span style={styles.metaDot}>·</span>
          <span style={styles.metaItem}>
            <i className="bi bi-rulers" style={styles.metaIcon} />
            {product.weight}
          </span>
        </div>

        <div style={styles.divider} />

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
            <i
              className={added ? "bi bi-check-lg" : "bi bi-plus-lg"}
              style={{ fontSize: 14, color: added ? "#3B6D11" : "#222" }}
            />
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
        <div>
          <p style={styles.eyebrow}>Curated for you</p>
          <h2 style={styles.title}>Top picks</h2>
        </div>
        <button style={styles.viewAll}>
          View all <i className="bi bi-arrow-right" style={{ fontSize: 12 }} />
        </button>
      </div>

      <div style={styles.row}>
        {products.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onAdd={() => setCartCount(c => c + 1)}
          />
        ))}
      </div>

      {cartCount > 0 && (
        <div style={styles.cartBar}>
          <i className="bi bi-bag" style={{ fontSize: 15, color: "#555" }} />
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
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    background: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "18px",
  },
  eyebrow: {
    fontSize: "10px",
    fontWeight: "600",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    color: "#999",
    margin: "0 0 4px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
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
    display: "flex",
    gap: "13px",
    overflowX: "auto",
    paddingBottom: "10px",
    scrollbarWidth: "thin",
  },
  card: {
    minWidth: "175px",
    maxWidth: "190px",
    flexShrink: 0,
    background: "#fff",
    border: "0.5px solid #e8e8e8",
    borderRadius: "16px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  imgArea: {
    width: "100%",
    height: "130px",
    background: "#f7f7f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flexShrink: 0,
  },
  mainIcon: {
    fontSize: "48px",
    color: "#bbb",
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
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "4px",
    color: "#999",
    fontSize: "11px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
  },
  metaIcon: {
    fontSize: "11px",
    color: "#bbb",
  },
  metaDot: {
    color: "#ccc",
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
    fontSize: "17px",
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
