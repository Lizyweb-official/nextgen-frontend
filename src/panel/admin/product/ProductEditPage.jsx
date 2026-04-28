import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style-4.css';
import '../../../css/style.css';

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    short_description: "",
    image_id: null,
    base_price: "",
    sale_price: "",
    categories: [],
    custom_fields: []
  });

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showGallery, setShowGallery] = useState(false);

  const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")   // remove special chars
        .replace(/\s+/g, "-")           // spaces → hyphens
        .replace(/-+/g, "-");           // remove duplicate hyphens
    };

  // 🔹 Fetch Product
  const getProduct = async () => {
    const res = await fetch(`${API}/product/getproduct/${id}`);
    const data = await res.json();

    setForm({
      name: data.name || "",
      slug: data.slug || "",
      description: data.description || "",
      short_description: data.short_description || "",
      image_id: data.image_id || null,
      base_price: data.base_price || "",
      sale_price: data.sale_price || "",
      categories: data.categories?.map(c => c.id) || [],
      custom_fields: data.custom_fields || []
    });
  };

  // 🔹 Fetch Images
  const getImages = async () => {
    const res = await fetch(`${API}/getallimages`);
    const data = await res.json();
    setImages(data);
  };

  // 🔹 Fetch Categories
  const getCategories = async () => {
    const res = await fetch(`${API}/product/getallcategories`);
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    getProduct();
    getImages();
    getCategories();
  }, []);

  // 🔹 Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-generate slug when name changes
    if (name === "name") {
        setForm({
        ...form,
        name: value,
        slug: generateSlug(value)
        });
    } else {
        setForm({ ...form, [name]: value });
  }  };

  // 🔹 Category Toggle
  const toggleCategory = (catId) => {
    let updated = [...form.categories];

    if (updated.includes(catId)) {
      updated = updated.filter(id => id !== catId);
    } else {
      updated.push(catId);
    }

    setForm({ ...form, categories: updated });
  };

  // 🔹 Custom Fields
  const handleFieldChange = (index, key, value) => {
    const updated = [...form.custom_fields];
    updated[index][key] = value;
    setForm({ ...form, custom_fields: updated });
  };

  const addField = () => {
    setForm({
      ...form,
      custom_fields: [...form.custom_fields, { field_name: "", field_value: "" }]
    });
  };

  const removeField = (index) => {
    const updated = form.custom_fields.filter((_, i) => i !== index);
    setForm({ ...form, custom_fields: updated });
  };

  // 🔹 Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategories =
      form.categories.length > 0 ? form.categories : [27]; // default

    await fetch(`${API}/product/updateproduct/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        categories: finalCategories
      })
    });

    alert("Product updated successfully");
  };

  return (
    <div className="product-edit-form-container container mt-4">
        <h2 className="product-edit-form-title mb-4">Edit Product</h2>

        <form onSubmit={handleSubmit} className="product-edit-form">

            {/* Name */}
            <div className="product-edit-form-group mb-3">
            <label className="product-edit-form-label">Product Name</label>
            <input
                className="product-edit-form-input form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
            />
            </div>

            {/* Slug */}
            <div className="product-edit-form-group mb-3">
            <label className="product-edit-form-label">Slug</label>
            <input
                className="product-edit-form-input form-control"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="Enter product slug"
            />
            </div>

            {/* Description */}
            <div className="product-edit-form-group mb-3">
            <label className="product-edit-form-label">Full Description</label>
            <textarea
                className="product-edit-form-textarea form-control"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter full product description"
            />
            </div>

            {/* Short Description */}
            <div className="product-edit-form-group mb-3">
            <label className="product-edit-form-label">Short Description</label>
            <textarea
                className="product-edit-form-textarea form-control"
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                placeholder="Enter short description"
            />
            </div>

            {/* Pricing */}
            <div className="product-edit-form-group mb-3">
            <label className="product-edit-form-label">Pricing</label>
            <div className="product-edit-form-row d-flex gap-2">
                <input
                className="product-edit-form-input form-control"
                name="base_price"
                value={form.base_price}
                onChange={handleChange}
                placeholder="Base Price"
                />
                <input
                className="product-edit-form-input form-control"
                name="sale_price"
                value={form.sale_price}
                onChange={handleChange}
                placeholder="Sale Price"
                />
            </div>
            </div>

            {/* Image Section */}
            <div className="product-edit-form-group mb-3">
            <label className="product-edit-form-label">Product Image</label>

            <div className="product-edit-form-actions">
                <button
                type="button"
                className="product-edit-form-btn btn btn-secondary"
                onClick={() => setShowGallery(true)}
                >
                Select Image
                </button>

                {form.image_id && (
                <button
                    type="button"
                    className="product-edit-form-btn btn btn-danger ms-2"
                    onClick={() => setForm({ ...form, image_id: null })}
                >
                    Remove Image
                </button>
                )}
            </div>
            </div>

            {/* Image Preview */}
            {form.image_id && (
            <div className="product-edit-form-preview mb-3">
                <label className="product-edit-form-label">Preview</label><br />
                <img
                className="product-edit-form-image"
                src={images.find(i => i.id === form.image_id)?.url}
                alt=""
                width="100"
                />
            </div>
            )}

            {/* Gallery Popup */}
            {showGallery && (
            <div className="product-edit-form-gallery border p-3 mt-3">
                <h5 className="product-edit-form-subtitle">Select Image</h5>
                <div className="product-edit-form-gallery-grid d-flex flex-wrap">
                {images.map(img => (
                    <img
                    key={img.id}
                    src={img.url}
                    alt=""
                    width="80"
                    height="80"
                    className="product-edit-form-gallery-img"
                    style={{ margin: "5px", cursor: "pointer" }}
                    onClick={() => {
                        setForm({ ...form, image_id: img.id });
                        setShowGallery(false);
                    }}
                    />
                ))}
                </div>
            </div>
            )}

            {/* Categories */}
            <div className="product-edit-form-group mt-4">
            <h5 className="product-edit-form-subtitle">Categories</h5>
            <div className="product-edit-form-checkbox-group">
                {categories.map(cat => (
                <div key={cat.id} className="product-edit-form-checkbox-item">
                    <input
                    type="checkbox"
                    checked={form.categories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    />
                    <label className="ms-2">{cat.name}</label>
                </div>
                ))}
            </div>
            </div>

            {/* Custom Fields */}
            <div className="product-edit-form-group mt-4">
            <h5 className="product-edit-form-subtitle">Custom Fields</h5>

            {form.custom_fields.map((field, index) => (
                <div key={index} className="product-edit-form-field-row d-flex mb-2">
                <input
                    className="product-edit-form-input form-control me-2"
                    placeholder="Field Name"
                    value={field.field_name}
                    onChange={(e) =>
                    handleFieldChange(index, "field_name", e.target.value)
                    }
                />
                <input
                    className="product-edit-form-input form-control me-2"
                    placeholder="Field Value"
                    value={field.field_value}
                    onChange={(e) =>
                    handleFieldChange(index, "field_value", e.target.value)
                    }
                />
                <button
                    type="button"
                    className="product-edit-form-btn btn btn-danger"
                    onClick={() => removeField(index)}
                >
                    X
                </button>
                </div>
            ))}

            <button
                type="button"
                className="product-edit-form-btn btn btn-secondary"
                onClick={addField}
            >
                Add Field
            </button>
            </div>

            <br />

            <button className="product-edit-form-submit btn btn-success">
            Update Product
            </button>

        </form>
        </div>
  );
}

export default ProductEditPage;