import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style-4.css';
import '../../../css/style.css';

import React, { useEffect, useState } from "react";
import { Link ,useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const res = await fetch(`${API}/api/product/getallproducts`);
      const data = await res.json();

      const updatedProducts = await Promise.all(
        data.map(async (product) => {
          if (!product.image_id) {
            return { ...product, image_url: null };
          }

          try {
            const imgRes = await fetch(
              `${API}/api/getimagebyid/${product.image_id}`
            );
            const imgData = await imgRes.json();

            return {
              ...product,
              image_url: imgData.url,
            };
          } catch (err) {
            console.error("Image fetch failed:", err);
            return { ...product, image_url: null };
          }
        })
      );

      setProducts(updatedProducts);
      setFiltered(updatedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // 🔍 Search filter
  useEffect(() => {
    const result = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
    setCurrentPage(1); // reset page when searching
  }, [search, products]);

  // ❌ Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await fetch(`${API}/api/product/deleteproduct/${id}`, {
        method: "DELETE",
      });

      getProducts();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ✅ Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <>
    <div className="admin-p-allproduct-page">
  <div className="admin-p-allproduct-header">
    <h2 className="admin-p-allproduct-title">Product List</h2>
    <span className="admin-p-allproduct-count">Total: {filtered.length} products</span>
  </div>

  <div className="admin-p-allproduct-toolbar">
    <div className="admin-p-allproduct-search-wrap">
      <span className="admin-p-allproduct-search-icon">⌕</span>
      <input
        type="text"
        placeholder="Search by product name..."
        className="admin-p-allproduct-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  </div>

  <div className="admin-p-allproduct-table-wrap">
    <table className="admin-p-allproduct-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Image</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentProducts.map((product, index) => (
          <tr key={product.id}>
            <td className="admin-p-allproduct-num">{indexOfFirst + index + 1}</td>

            <td>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="admin-p-allproduct-img"
                />
              ) : (
                <div className="admin-p-allproduct-no-img">No img</div>
              )}
            </td>

            <td className="admin-p-allproduct-name">{product.name}</td>

            <td>
              {product.categories?.length
                ? product.categories.map((c) => (
                    <span key={c.name} className="admin-p-allproduct-badge">
                      {c.name}
                    </span>
                  ))
                : <span className="admin-p-allproduct-no-cat">—</span>}
            </td>

            <td>
              {product.sale_price && product.sale_price !== product.base_price ? (
                <>
                  <span className="admin-p-allproduct-price-orig">₹{product.base_price}</span>
                  <span className="admin-p-allproduct-price-sale">₹{product.sale_price}</span>
                </>
              ) : (
                <span className="admin-p-allproduct-price-reg">₹{product.base_price}</span>
              )}
            </td>

            <td>
              <div className="admin-p-allproduct-actions">
                <Link to={`/single-product-page/${product.id}`} className="admin-p-allproduct-btn admin-p-allproduct-btn-view">
                  View
                </Link>
                <Link to={`/product-editor/${product.id}`} className="admin-p-allproduct-btn admin-p-allproduct-btn-edit">
                  Edit
                </Link>
                <button
                  className="admin-p-allproduct-btn admin-p-allproduct-btn-delete"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}

        {filtered.length === 0 && (
          <tr>
            <td colSpan="6" className="admin-p-allproduct-empty">
              No products found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {totalPages > 1 && (
    <div className="admin-p-allproduct-pagination">
      <button
        className="admin-p-allproduct-page-btn"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        ‹
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={`admin-p-allproduct-page-btn ${currentPage === i + 1 ? "active" : ""}`}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}

      <button
        className="admin-p-allproduct-page-btn"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        ›
      </button>
    </div>
  )}
</div>
</>
  );
}

export default AllProducts;