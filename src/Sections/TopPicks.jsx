import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';
// import r1 from'../media/Website-Images/images-2/chickenskin.png ; 
// import r2 from'../media/Website-Images/images-2/pomfret.png ; 
// import r3 from'../media/Website-Images/images-2/breast.png ; 
// import r4 from'../media/Website-Images/images-2/premiumcut1.png ; 
// import r5 from'../media/Website-Images/images-2/premiumcut2.png ; 


const products = [
  {
    id: 1,
    name: "Chicken Curry Cut (Skin On)",
    qty: "10 to 12 Pcs",
    weight: "960 - 1000 Gms",
    oldPrice: 355,
    newPrice: 349,
    // image: r1, // replace with actual image URL
  },
  {
    id: 2,
    name: "Freshwater Pomfret - Yellow",
    qty: "6 to 8 Pcs",
    weight: "Gross: 500 - 700 Gms | Net: 350 - 490 Gms",
    oldPrice: 179,
    newPrice: 169,
    // image: r2,
  },
  {
    id: 3,
    name: "Chicken Breast Boneless",
    qty: "2-3 Pcs",
    weight: "240 - 280 Gms",
    oldPrice: 185,
    newPrice: 179,
    // image: r3,
  },
  {
    id: 4,
    name: "Premium - Curry Cut (Skin On)",
    qty: "5 to 6 Pcs",
    weight: "480 - 500 Gms",
    oldPrice: 179,
    newPrice: 175,
    // image: r4,
  },
  {
    id: 5,
    name: "Premium - Curry Cut (Skin On)",
    qty: "5 to 6 Pcs",
    weight: "480 - 500 Gms",
    oldPrice: 175,
    newPrice: 169,
    // image: r5,
  },
];

function ClockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#888"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ProductCard({ product }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={styles.card}>
      {/* Image */}
      <div style={styles.imageWrapper}>
        {/* {product.image ? (
          <img src={product.image} alt={product.name} style={styles.image} />
        ) : (
          <div style={styles.imagePlaceholder} />
        )} */}
      </div>

      {/* Name */}
      <p style={styles.productName}>{product.name}</p>

      {/* Qty */}
      <p style={styles.productQty}>{product.qty}</p>

      {/* Weight */}
      <div style={styles.weightRow}>
        <ClockIcon />
        <span style={styles.weightText}>{product.weight}</span>
      </div>

      {/* Price + Add */}
      <div style={styles.priceRow}>
        <div style={styles.prices}>
          <span style={styles.oldPrice}>₹{product.oldPrice}</span>
          <span style={styles.newPrice}>₹{product.newPrice}</span>
        </div>
        <button
          onClick={handleAdd}
          style={{
            ...styles.addBtn,
            background: added ? "#b00018" : "#d0021b",
          }}
        >
          {added ? "✓" : "Add"}
        </button>
      </div>
    </div>
  );
}

export default function TopPicks() {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Top Picks For You</h2>
      <div style={styles.row}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  section: {
    padding: "24px 16px",
    fontFamily: "'Segoe UI', sans-serif",
    background: "#fff",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "16px",
  },
  row: {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    paddingBottom: "8px",
  },
  card: {
    minWidth: "180px",
    maxWidth: "200px",
    flexShrink: 0,
    background: "#fff5f5",
    borderRadius: "14px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  imageWrapper: {
    width: "100%",
    height: "130px",
    borderRadius: "10px",
    overflow: "hidden",
    background: "#f5c6c6",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #f5c6c6, #e8a8a8)",
  },
  productName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1a1a1a",
    lineHeight: "1.3",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  productQty: {
    fontSize: "11px",
    color: "#555",
    margin: 0,
  },
  weightRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "4px",
  },
  weightText: {
    fontSize: "11px",
    color: "#666",
    lineHeight: "1.3",
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "4px",
  },
  prices: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  oldPrice: {
    fontSize: "12px",
    color: "#999",
    textDecoration: "line-through",
  },
  newPrice: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1a1a1a",
  },
  addBtn: {
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "7px 16px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background 0.15s",
  },
};
