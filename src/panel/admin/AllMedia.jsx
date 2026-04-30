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
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>

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
            <div style={{ padding: "20px" }}>
            <h2 style={{ paddingBottom: "40px" }}>All Media</h2>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "15px"
            }}>
                {images.map((img) => (
                <div key={img.id} style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "8px",
                    textAlign: "left"
                }}>
                    <img
                    src={img.url}
                    alt="gallery"
                    style={{ width: "100%", height: "150px", objectFit: "cover" }}
                    />
                    
                        <a href={img.url} style={{ wordBreak: "break-all",display: "block"}}>
                            {(img.url)}
                        </a>

                    <button
                    onClick={() => deleteImage(img.id)}
                    style={{
                        marginTop: "10px",
                        background: "red",
                        color: "#fff",
                        border: "none",
                        padding: "8px 12px",
                        cursor: "pointer",
                        borderRadius: "5px"
                    }}
                    >
                    Delete
                    </button>
                </div>
                ))}
            </div>
            </div>

        </>
    );
}


export default AllMedia;