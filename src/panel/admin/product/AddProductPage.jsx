import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style.css';
import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    image_id: "",
    base_price: "",
    sale_price: "",
    categories: [],
    custom_fields: []
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  const [showGallery, setShowGallery] = useState(false);

  // ✅ Load categories & images
  useEffect(() => {
    fetch(`${API}/product/getallcategories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));

    fetch(`${API}/getallimages`)
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(err => console.error(err));
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
        setForm({
        ...form,
        name: value,
        slug: generateSlug(value) // 🔥 auto update slug
        });
    } else {
        setForm({ ...form, [name]: value });
    }

  };

  // ✅ Category select
  const handleCategoryChange = (id) => {
    let updated = [...form.categories];

    if (updated.includes(id)) {
      updated = updated.filter(c => c !== id);
    } else {
      updated.push(id);
    }

    setForm({ ...form, categories: updated });
  };

  // ✅ Custom fields
  const addCustomField = () => {
    setForm({
      ...form,
      custom_fields: [
        ...form.custom_fields,
        { field_name: "", field_value: "" }
      ]
    });
  };

  const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")   // remove special chars
        .replace(/\s+/g, "-")           // spaces → -
        .replace(/-+/g, "-");           // remove extra -
    };

  const handleCustomFieldChange = (index, key, value) => {
    const updated = [...form.custom_fields];
    updated[index][key] = value;
    setForm({ ...form, custom_fields: updated });
  };

  const removeCustomField = (index) => {
    const updated = form.custom_fields.filter((_, i) => i !== index);
    setForm({ ...form, custom_fields: updated });
  };

  // ✅ Submit (ONLY ADD)
  const handleSubmit = () => {
   
  // ✅ Required field validation
  if (!form.name.trim()) {
    alert("Product Name is required");
    return;
  }

  if (!form.description.trim()) {
    alert("Description is required");
    return;
  }

  if (!form.base_price) {
    alert("Base Price is required");
    return;
  }

  // ✅ Prepare data (set defaults)
  const payload = {
    ...form,
    slug: form.slug || null,
    short_description: form.short_description || null,
    image_id: form.image_id || null,
    sale_price: form.sale_price || null,
    categories: form.categories.length > 0 ? form.categories : [27],
    custom_fields: form.custom_fields || []
  };

  fetch(`${API}/product/addproduct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      alert("Product Added Successfully");

      setForm({
        name: "",
        slug: "",
        description: "",
        short_description: "",
        image_id: "",
        base_price: "",
        sale_price: "",
        categories: [],
        custom_fields: []
      });
    })
    .catch(err => console.error(err));
  };

  return (
   <div className="admin-db-add-product-sec-wrapper">
  <h2 className="admin-db-add-product-sec-heading">Add Product</h2>

  {/* Name */}
  <div className="admin-db-add-product-sec-field">
    <label className="admin-db-add-product-sec-label">Product Name</label>
    <input
      className="admin-db-add-product-sec-input"
      name="name"
      placeholder="Enter product name"
      value={form.name}
      onChange={handleChange}
    />
  </div>

  {/* Slug */}
  <div className="admin-db-add-product-sec-field">
    <label className="admin-db-add-product-sec-label">Slug</label>
    <input
      className="admin-db-add-product-sec-input"
      name="slug"
      placeholder="auto-generated or enter manually"
      value={form.slug}
      onChange={handleChange}
    />
  </div>

  {/* Description */}
  <div className="admin-db-add-product-sec-field">
    <label className="admin-db-add-product-sec-label">Description</label>
    <textarea
      className="admin-db-add-product-sec-textarea"
      name="description"
      placeholder="Enter full product description"
      value={form.description}
      onChange={handleChange}
    />
  </div>

  {/* Short Description */}
  <div className="admin-db-add-product-sec-field">
    <label className="admin-db-add-product-sec-label">Short Description</label>
    <textarea
      className="admin-db-add-product-sec-textarea"
      name="short_description"
      placeholder="Brief summary (shown in listings)"
      value={form.short_description}
      onChange={handleChange}
    />
  </div>

  {/* Pricing */}
  <h4 className="admin-db-add-product-sec-section-title">Pricing</h4>
  <div className="admin-db-add-product-sec-price-row">
    <div className="admin-db-add-product-sec-field">
      <label className="admin-db-add-product-sec-label">Base Price</label>
      <input
        className="admin-db-add-product-sec-input"
        name="base_price"
        placeholder="₹ 0.00"
        value={form.base_price}
        onChange={handleChange}
      />
    </div>

    <div className="admin-db-add-product-sec-field">
      <label className="admin-db-add-product-sec-label">Sale Price</label>
      <input
        className="admin-db-add-product-sec-input"
        name="sale_price"
        placeholder="₹ 0.00"
        value={form.sale_price}
        onChange={handleChange}
      />
    </div>
  </div>

  {/* Image */}
  <h4 className="admin-db-add-product-sec-section-title">Product Image</h4>
  <div className="admin-db-add-product-sec-image-block">
    <button
    type="button"   // ✅ IMPORTANT FIX
    className="admin-db-add-product-sec-select-img-btn"
    onClick={() => setShowGallery(true)}
    >
    📷 Select Image
    </button>



    {showGallery && (
            <div className="admin-db-add-product-sec-gallery-overlay">
                <div className="admin-db-add-product-sec-gallery-modal">

                <div className="admin-db-add-product-sec-gallery-header">
                    <h3 className="admin-db-add-product-sec-gallery-title">
                    Select Image
                </h3>

                <button
                type="button"
                className="admin-db-add-product-sec-gallery-close-btn"
                onClick={() => setShowGallery(false)}
                >
                Close
                </button>
            </div>

            <div className="admin-db-add-product-sec-gallery-grid">
                {images.map(img => (
                <img
                    key={img.id}
                    className="admin-db-add-product-sec-gallery-img"
                    src={img.url}
                    alt=""
                    onClick={() => {
                    setForm({ ...form, image_id: img.id });
                    setShowGallery(false);
                    }}
                />
                ))}
            </div>

            </div>
        </div>
        )}

    {form.image_id && (
      <div className="admin-db-add-product-sec-selected-image-wrap">
        <img
          className="admin-db-add-product-sec-selected-thumb"
          src={images.find(i => i.id == form.image_id)?.url}
          alt=""
        />
        <button
            type="button"
            className="admin-db-add-product-sec-remove-img-btn"
            onClick={() => setForm({ ...form, image_id: "" })}
            >
            Remove Image
        </button>
      </div>
    )}
  </div>

  {/* Categories */}
  <h4 className="admin-db-add-product-sec-section-title">Categories</h4>
  <div className="admin-db-add-product-sec-categories-list">
    {categories.map(cat => (
      <label key={cat.id} className="admin-db-add-product-sec-category-item">
        <input
          className="admin-db-add-product-sec-category-checkbox"
          type="checkbox"
          checked={form.categories.includes(cat.id)}
          onChange={() => handleCategoryChange(cat.id)}
        />
        {cat.name}
      </label>
    ))}
  </div>

  <div className="admin-db-add-product-sec-divider" />

  {/* Custom Fields */}
  <h4 className="admin-db-add-product-sec-section-title">Custom Fields</h4>

  {form.custom_fields.map((field, index) => (
    <div key={index} className="admin-db-add-product-sec-custom-field-row">
      <input
        className="admin-db-add-product-sec-input"
        placeholder="Field Name (e.g. Weight)"
        value={field.field_name}
        onChange={(e) =>
          handleCustomFieldChange(index, "field_name", e.target.value)
        }
      />
      <input
        className="admin-db-add-product-sec-input"
        placeholder="Field Value (e.g. 1kg)"
        value={field.field_value}
        onChange={(e) =>
          handleCustomFieldChange(index, "field_value", e.target.value)
        }
      />
      <button
        className="admin-db-add-product-sec-remove-field-btn"
        onClick={() => removeCustomField(index)}
      >
        Remove
      </button>
    </div>
  ))}

  <button
    className="admin-db-add-product-sec-add-field-btn"
    onClick={addCustomField}
  >
    + Add Field
  </button>

  {/* Save */}
  <button
    className="admin-db-add-product-sec-save-btn"
    onClick={handleSubmit}
  >
    Save Product
  </button>
</div>
  );
}

export default AddProductPage;