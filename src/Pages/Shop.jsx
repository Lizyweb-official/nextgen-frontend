import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import { useEffect, useState } from "react";
import { Link ,useParams} from "react-router-dom";



const API = import.meta.env.VITE_API_URL;

function Shop() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const { catId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // ✅ GET IMAGE URL
  const getImageUrl = async (id) => {
    try {
      const res = await fetch(`${API}/api/getimagebyid/${id}`);
      const data = await res.json();
      return data.url; // make sure backend returns {url: "..."}
    } catch {
      return "";
    }
  };


    const loadAllProducts = async () => {
    setActiveCat(null);

    const res = await fetch(`${API}/api/product/getallproducts`);
    const data = await res.json();

    const fullProducts = await Promise.all(
      data.map(async (p) => {
        const image = await getImageUrl(p.image_id);
        return { ...p, image };
      })
    );
    setCurrentPage(1);
    setProducts(fullProducts);
  };

  useEffect(() => {
    const init = async () => {
      // load categories
      const res = await fetch(`${API}/api/product/getallcategories`);
      const data = await res.json();

      const updated = await Promise.all(
        data.map(async (cat) => ({
          ...cat,
          image: await getImageUrl(cat.image_id),
        }))
      );

      setCategories(updated);

      // 🔥 CHECK IF CATEGORY ID EXISTS
      if (catId) {
        loadProducts(catId);
      } else {
        loadAllProducts();
      }
    };

    init();
  }, [catId]);


  // ✅ LOAD PRODUCTS BY CATEGORY
  const loadProducts = async (catId) => {
    setActiveCat(catId);

    // 1. get product ids
    const res = await fetch(
      `${API}/api/product/getproductsbycategory/${catId}`
    );
    const ids = await res.json();

    // 2. get full product details
    const fullProducts = await Promise.all(
      ids.map(async (item) => {
        const res = await fetch(
          `${API}/api/product/getproduct/${item.product_id}`
        );
        const data = await res.json();

        const image = await getImageUrl(data.image_id);

        return { ...data, image };
        setCurrentPage(1);
      })
    );

    setProducts(fullProducts);
  };

  // ✅ ADD TO CART
  const addToCart = async (productId) => {
    await fetch(`${API}/api/product/addproducttocart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: 1, // 🔥 replace with logged user id
        product_id: productId,
        quantity: 1,
      }),
    });

    alert("Added to cart");
  };



  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;

  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="container mt-4">
      
      {/* ================= CATEGORIES ================= */}
      <div className="d-flex gap-3 overflow-auto mb-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`text-center p-2 border rounded ${
              activeCat === cat.id ? "bg-dark text-white" : ""
            }`}
            style={{ minWidth: "120px", cursor: "pointer" }}
            onClick={() => loadProducts(cat.id)}
          >
            <img
              src={cat.image}
              alt={cat.name}
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
            <p className="mt-2 mb-0">{cat.name}</p>
          </div>
        ))}
      </div>


      {/* ================= PRODUCTS ================= */}
      <div className="row">
        {currentProducts.map((p) => (
          <div className="col-md-3 mb-4" key={p.id}>
            
            <Link to={`/single-product-page/${p.id}`} className="text-decoration-none text-dark">
              
              <div className="card h-100">
                <img
                  src={p.image}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />

                <div className="card-body">
                  <h6>{p.name}</h6>

                  {/* one line description */}
                  <p className="text-muted" style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {p.short_description}
                  </p>

                  {/* custom field */}
                  {p.custom_fields?.map((f, i) => (
                    <small key={i} className="d-block">
                      {f.field_name}: {f.field_value}
                    </small>
                  ))}

                  {/* price */}
                  <div className="mt-2">
                    <span className="text-muted text-decoration-line-through me-2">
                      ₹{p.base_price}
                    </span>
                    <span className="fw-bold text-success">
                      ₹{p.sale_price}
                    </span>
                  </div>
                </div>

                <div className="card-footer bg-white border-0">
                  <button
                    className="btn btn-dark w-100"
                    onClick={(e) => {
                      e.preventDefault(); // 🔥 prevent Link click
                      addToCart(p.id);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

            </Link>

          </div>
        ))}
      </div>


      <div className="d-flex justify-content-center mt-4 gap-2 flex-wrap">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`btn ${
              currentPage === i + 1 ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
}
export default Shop