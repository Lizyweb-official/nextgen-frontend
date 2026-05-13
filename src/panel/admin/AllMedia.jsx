import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style-4.css';
import '../../css/style.css';

import { useState, useEffect } from "react";
const API = import.meta.env.VITE_API_URL;

function AllMedia(){

    const [file, setFile] = useState(null);

    const handleUpload = async () => {
    try {
        // check file selected
        if (!file) {
        alert("Please select an image first");
        return;
        }

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch(`${API}/api/upload-image`, {
        method: "POST",
        body: formData
        });

        // try parsing JSON safely
        let data;
        try {
            data = await res.json();
        } catch {
            data = await res.text();
        }

        // handle server errors
        if (!res.ok) {
            throw new Error(data.message || data || "Upload failed");
        }

        console.log("Upload success:", data);
        alert("Image uploaded successfully");

    } catch (err) {
        console.error("Upload error:", err.message);

        alert(err.message || "Something went wrong");
    }
};

    return(
    <>         
        <div className="admin-media-tab-upload-wrapper">
            <input
                type="file"
                className="admin-media-tab-upload-input"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <div className="admin-media-tab-upload-icon">
                <svg viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
            </div>

            <p className="admin-media-tab-upload-label">
                Click or drag a file to upload
            </p>
            <p className="admin-media-tab-upload-sub">
                PNG, JPG, GIF, MP4 up to 50MB
            </p>

            <span className={`admin-media-tab-upload-filename ${file ? "admin-media-tab-upload-filename--visible" : ""}`}>
                {file?.name}
            </span>
            </div>

            <button
            onClick={handleUpload}
            disabled={!file}
            className="admin-media-tab-upload-btn"
            >
            Upload
            </button>

            <MediaGallery />
        </>
    );
}

function MediaGallery(){

    const [images, setImages] = useState([]);

    // Fetch images
    const fetchImages = async () => {
        try {
        const res = await fetch(`${API}/api/getallimages`);
        const data = await res.json();
        setImages(data);
        } catch (err) {
        console.error("Error fetching images:", err);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const deleteImage = async (id) => {
        const res = await fetch(`http://localhost:5000/api/deleteimagemedia/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();
        alert(data.message);

        // refresh images
        fetchImages();
    };

    return(
        <>
           <div className="admin-media-tab-wrapper">
                <div className="admin-media-tab-header">
                    <h2 className="admin-media-tab-title">All Media</h2>
                    <span className="admin-media-tab-count">{images.length} files</span>
                </div>

                <div className="admin-media-tab-grid">
                    {images.length === 0 ? (
                    <div className="admin-media-tab-empty">No media files yet.</div>
                    ) : (
                    images.map((img) => (
                        <div key={img.id} className="admin-media-tab-card">

                        <div className="admin-media-tab-img-wrap">
                            <img
                            src={img.url}
                            alt="gallery"
                            className="admin-media-tab-img"
                            />
                            <div className="admin-media-tab-overlay">
                            <span className="admin-media-tab-overlay-label">VIEW</span>
                            </div>
                        </div>

                        <div className="admin-media-tab-body">
                            <a
                            href={img.url}
                            className="admin-media-tab-url"
                            title={img.url}
                            >
                            {img.url}
                            </a>

                            <button
                            onClick={() => deleteImage(img.id)}
                            className="admin-media-tab-delete-btn"
                            >
                            Delete
                            </button>
                        </div>

                        </div>
                    ))
                    )}
                </div>
                </div>

        </>
    );
}


export default AllMedia;