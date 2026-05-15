import '../css/style-1.css';
import '../css/style-2.css';
import '../css/style-3.css';
import '../css/style-4.css';
import '../css/style.css';

import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from "react";
import { Link ,useParams} from "react-router-dom";


const API = import.meta.env.VITE_API_URL;

function Shop() {

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCat, setActiveCat] = useState(null);

  const { catId } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const productsPerPage = 12;

  // ================= GET IMAGE URL =================

  const getImageUrl = async (id) => {
    try {

      const res = await fetch(`${API}/api/getimagebyid/${id}`);

      const data = await res.json();

      return data.url;

    } catch {

      return "";

    }
  };

  // ================= LOAD ALL PRODUCTS =================

  const loadAllProducts = async () => {

    setActiveCat(null);

    const res = await fetch(
      `${API}/api/product/getallproducts`
    );

    const data = await res.json();

    const fullProducts = await Promise.all(

      data.map(async (p) => {

        const image = await getImageUrl(
          p.image_id
        );

        return {
          ...p,
          image
        };

      })

    );

    setProducts(fullProducts);
    setCurrentPage(1);

  };

  // ================= LOAD PRODUCTS BY CATEGORY =================

  const loadProducts = async (catId) => {

    setActiveCat(catId);

    // get product ids

    const res = await fetch(
      `${API}/api/product/getproductsbycategory/${catId}`
    );

    const ids = await res.json();

    // get full product details
    const fullProducts = await Promise.all(

      ids.map(async (item) => {
        const res = await fetch(
          `${API}/api/product/getproduct/${item.product_id}`
        );

        const data = await res.json();

        const image = await getImageUrl(
          data.image_id
        );

        return {
          ...data,
          image
        };

      })

    );

    setProducts(fullProducts);

    setCurrentPage(1);

  };

  // ================= INITIAL LOAD =================

  useEffect(() => {

    const init = async () => {

      // load categories

      const res = await fetch(
        `${API}/api/product/getallcategories`
      );

      const data = await res.json();

      const updated = await Promise.all(

        data.map(async (cat) => ({

          ...cat,

          image: await getImageUrl(
            cat.image_id
          ),

        }))

      );

      setCategories(updated);

      // check if category exists

      if (catId) {

        loadProducts(catId);

      } else {

        loadAllProducts();

      }

    };

    init();

  }, [catId]);

  // ================= ADD TO CART =================

  // ✅ ADD TO CART
  const addToCart = async (productId,productPrice) => {
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

  // ================= PAGINATION =================

  const indexOfLast =
    currentPage * productsPerPage;

  const indexOfFirst =
    indexOfLast - productsPerPage;

  const currentProducts =
    products.slice(indexOfFirst, indexOfLast);

  const totalPages =
    Math.ceil(products.length / productsPerPage);

  return (

    <div className="container shop-page">

      {/* ================= CATEGORIES ================= */}

      <div className="category-wrapper">

        {categories.map((cat) => (

          <div
            key={cat.id}
            className={`category-item ${
              activeCat === cat.id
                ? "active-category"
                : ""
            }`}
            onClick={() => loadProducts(cat.id)}
          >

            <img
              src={cat.image}
              alt={cat.name}
              className="category-image"
            />

            <p className="category-name">
              {cat.name}
            </p>

          </div>

        ))}

      </div>

      {/* ================= PRODUCTS ================= */}

      <div className="row product-row">

        {currentProducts.map((p) => (

          <div
            className="col-lg-3 col-md-4 col-sm-6"
            key={p.id}
          >

            <Link
              to={`/single-product-page/${p.id}`}
              className="text-decoration-none text-dark"
            >

              <div className="card h-100 product-card">

                {/* PRODUCT IMAGE */}

                <div className='product-imgbox'>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="card-img-top product-image"
                  />
                </div>

                {/* PRODUCT CONTENT */}

                <div className="card-body">
                  <h6 className="product-title">
                    {p.name}
                  </h6>

                  {/* DESCRIPTION */}

                  <p className="product-description">
                    {p.short_description}
                  </p>

                  {/* CUSTOM FIELDS */}

                  {p.custom_fields?.map((f, i) => (

                    <small
                      key={i}
                      className="d-block product-field"
                    >

                      {f.field_name}: {f.field_value}

                    </small>

                  ))}

                  {/* PRICE */}

                  <div className="mt-2 product-price-box">

                    {p.sale_price ? (

                      <>

                        <span className="old-price">

                          ₹{p.base_price}

                        </span>

                        <span className="sale-price">

                          ₹{p.sale_price}

                        </span>

                      </>

                    ) : (

                      <span className="normal-price">

                        ₹{p.base_price}

                      </span>

                    )}

                  </div>
                </div>

                {/* FOOTER */}

                <div className="card-footer bg-white border-0 product-footer">

                  {p.custom_pieces_k && p.custom_pieces_k.length > 0 ? (

                    <button
                      className="btn btn-dark w-100 add-cart-btn"
                      onClick={(e) => {

                        e.preventDefault();
                        e.stopPropagation();

                        window.location.href = `/single-product-page/${p.id}`;

                      }}
                    >
                      View Option
                    </button>

                  ) : (

                    <button
                      className="btn btn-dark w-100 add-cart-btn"
                      onClick={(e) => {

                        e.preventDefault();
                        e.stopPropagation();

                        addToCart(
                          p.id,
                          p.sale_price || p.base_price
                        );

                      }}
                    >
                      Add to Cart
                    </button>

                  )}

                </div>

              </div>

            </Link>

          </div>

        ))}

      </div>

      {/* ================= PAGINATION ================= */}

      <div className="pagination-wrapper">

        {[...Array(totalPages)].map((_, i) => (

          <button
            key={i}
            className={`btn ${
              currentPage === i + 1
                ? "btn-dark"
                : "btn-outline-dark"
            }`}
            onClick={() =>
              setCurrentPage(i + 1)
            }
          >

            {i + 1}

          </button>

        ))}

      </div>

    </div>

  );
}

export default Shop;