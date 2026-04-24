import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style.css';

import React, { useEffect, useState } from "react";
import { Link ,useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

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
      const res = await fetch(`${API}/product/getallproducts`);
      const data = await res.json();

      const updatedProducts = await Promise.all(
        data.map(async (product) => {
          if (!product.image_id) {
            return { ...product, image_url: null };
          }

          try {
            const imgRes = await fetch(
              `${API}/getimagebyid/${product.image_id}`
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
      await fetch(`${API}/product/deleteproduct/${id}`, {
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
    <div className="container mt-4">
      <h2>Product List</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search by product name..."
          className="form-control w-50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <h5>Total Products: {filtered.length}</h5>
      </div>

      <table className="table table-bordered">
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
              <td>{indexOfFirst + index + 1}</td>

              <td>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    width="60"
                    height="60"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ color: "#888", fontSize: "12px" }}>
                    No Image
                  </span>
                )}
              </td>

              <td>{product.name}</td>

              <td>
                {product.categories?.length
                  ? product.categories.map((c) => c.name).join(", ")
                  : "—"}
              </td>

              <td>
                {product.sale_price &&
                product.sale_price !== product.base_price ? (
                  <>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "gray",
                        marginRight: "8px",
                      }}
                    >
                      ₹{product.base_price}
                    </span>
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      ₹{product.sale_price}
                    </span>
                  </>
                ) : (
                  <span>₹{product.base_price}</span>
                )}
              </td>

              <td>
                <Link to={`/single-product-page/${product.id}`}>
                  <button className="btn btn-sm btn-info me-2">View</button>
                </Link>

                <Link to={`/product-editor/${product.id}`}>
                  <button className="btn btn-sm btn-primary me-2">Edit</button>
                </Link>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔥 Pagination Controls */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-sm btn-secondary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm me-1 ${
                currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-sm btn-secondary ms-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AllProducts;