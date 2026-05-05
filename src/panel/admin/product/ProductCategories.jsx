import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style-4.css';
import '../../../css/style.css';

import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function ProductCategories() {
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    parent_id: "",
    image_id: ""
  });

  // ---------------- FETCH DATA ----------------
  const fetchData = async () => {
    const catRes = await fetch(`${API}/api/product/getallcategories`);
    const catData = await catRes.json();

    const imgRes = await fetch(`${API}/api/getallimages`);
    const imgData = await imgRes.json();

    setCategories(catData);
    setImages(imgData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- HANDLE FORM ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setForm(prev => ({
        ...prev,
        name: value,
        slug: value.toLowerCase().replace(/\s+/g, "-")
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // ---------------- ADD / UPDATE ----------------
  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      slug: form.slug,
      parent_id: form.parent_id ? Number(form.parent_id) : null,
      image_id: form.image_id ? Number(form.image_id) : null
    };

    console.log("Submitting:", payload);

    if (editData) {
      await fetch(`${API}/api/product/updatecategory/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch(`${API}/api/product/addcategory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    setShowModal(false);
    setEditData(null);
    setForm({ name: "", slug: "", parent_id: "", image_id: "" });

    fetchData();
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    await fetch(`${API}/api/product/deletecategory/${id}`, {
      method: "DELETE"
    });
    fetchData();
  };

  // ---------------- EDIT ----------------
  const handleEdit = (cat) => {
    setEditData(cat);
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      parent_id: cat.parent_id || "",
      image_id: cat.image_id || ""
    });
    setShowModal(true);
  };

  // ---------------- TREE ----------------
  const buildTree = (parentId = null) => {
    return categories
      .filter(c => c.parent_id === parentId)
      .map(c => ({
        ...c,
        children: buildTree(c.id)
      }));
  };

  const tree = buildTree();

  // ---------------- IMAGE ----------------
  const getImageUrl = (id) => {
    const img = images.find(i => i.id === id);
    return img ? img.url : "";
  };

  // ---------------- SEARCH ----------------
  const filterTree = (nodes) => {
    return nodes
      .map(node => {
        if (
          node.name.toLowerCase().includes(search.toLowerCase()) ||
          (node.children && node.children.length)
        ) {
          return {
            ...node,
            children: filterTree(node.children || [])
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  const filteredTree = search ? filterTree(tree) : tree;

  // ---------------- RENDER ----------------
  const renderTree = (nodes, level = 0) => {
    return nodes.map(node => (
      <React.Fragment key={node.id}>
        <tr>
          {/* <td>{node.id}</td> */}

          <td>
            {node.image_id && (
              <img src={getImageUrl(node.image_id)} width="50" alt="" />
            )}
          </td>

          <td style={{ paddingLeft: `${level * 20}px` }}>
            {level === 0 ? "" : "↳ "}
            {node.name}
          </td>

          <td>{node.slug}</td>

          <td>
            <button class="admin-db-pro-cat-edit-del-btn" onClick={() => handleEdit(node)}>Edit</button>
            <button class="admin-db-pro-cat-edit-del-btn" onClick={() => handleDelete(node.id)}>Delete</button>
          </td>
        </tr>

        {node.children.length > 0 && renderTree(node.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <>
    <div className="admin-db-pro-cat-wrapper">

  {/* ── HEADER ── */}
  <div className="admin-db-pro-cat-header">
    <h2 className="admin-db-pro-cat-title">Category Manager</h2>
    <div className="admin-db-pro-cat-toolbar">
      <input
        type="text"
        className="admin-db-pro-cat-search"
        placeholder="Search categories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="admin-db-pro-cat-add-btn" onClick={() => setShowModal(true)}>
        <span>+</span> Add Category
      </button>
    </div>
  </div>

  {/* ── TABLE ── */}
  <div className="admin-db-pro-cat-table-wrap">
    <table className="admin-db-pro-cat-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Slug</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{renderTree(filteredTree)}</tbody>
    </table>
  </div>

  {/* ── CATEGORY MODAL ── */}
  {showModal && (
    <div className="admin-db-pro-cat-overlay">
      <div className="admin-db-pro-cat-modal">
        <h3 className="admin-db-pro-cat-modal-title">
          {editData ? "Edit Category" : "Add Category"}
        </h3>

        <div className="admin-db-pro-cat-field">
          <label className="admin-db-pro-cat-label">Name</label>
          <input
            name="name"
            className="admin-db-pro-cat-input"
            placeholder="e.g. Electronics"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="admin-db-pro-cat-field">
          <label className="admin-db-pro-cat-label">Slug</label>
          <input
            name="slug"
            className="admin-db-pro-cat-input"
            placeholder="e.g. electronics"
            value={form.slug}
            onChange={handleChange}
          />
        </div>

        <div className="admin-db-pro-cat-field">
          <label className="admin-db-pro-cat-label">Parent Category</label>
          <select
            name="parent_id"
            className="admin-db-pro-cat-select"
            value={form.parent_id || ""}
            onChange={handleChange}
          >
            <option value="">No Parent</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-db-pro-cat-field">
          <label className="admin-db-pro-cat-label">Image</label>
          <button
            className="admin-db-pro-cat-img-select-btn"
            onClick={() => setShowImageModal(true)}
          >
            🖼 Select Image
          </button>
          {form.image_id && (
            <div className="admin-db-pro-cat-img-preview">
              <img src={getImageUrl(Number(form.image_id))} alt="" />
            </div>
          )}
        </div>

        <div className="admin-db-pro-cat-modal-actions">
          <button className="admin-db-pro-cat-submit-btn" onClick={handleSubmit}>
            {editData ? "Update" : "Add"}
          </button>
          <button className="admin-db-pro-cat-cancel-btn" onClick={() => setShowModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}

  {/* ── IMAGE GALLERY MODAL ── */}
  {showImageModal && (
    <div className="admin-db-pro-cat-overlay">
      <div className="admin-db-pro-cat-img-gallery-modal">
        <div className="admin-db-pro-cat-gallery-header">
          <h3 className="admin-db-pro-cat-gallery-title">Select Image</h3>
          <button
            className="admin-db-pro-cat-gallery-close"
            onClick={() => setShowImageModal(false)}
          >
            ✕
          </button>
        </div>

        <div className="admin-db-pro-cat-gallery-grid">
          {images.map((img) => (
            <div
              key={img.id}
              className={`admin-db-pro-cat-gallery-item${
                form.image_id === img.id ? " selected" : ""
              }`}
              onClick={() => {
                setForm((prev) => ({ ...prev, image_id: img.id }));
                setShowImageModal(false);
              }}
            >
              <img src={img.url} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
</div>
  </>
  )
}

// ---------------- STYLES ----------------
const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)"
};

const modalContent = {
  background: "#fff",
  padding: "20px",
  margin: "100px auto",
  width: "300px"
};

export default ProductCategories;