import '../../css/style-1.css';
import '../../css/style-2.css';
import '../../css/style-3.css';
import '../../css/style-4.css';
import '../../css/style.css';

import React, { useState , useEffect } from "react";

import ProductCategories from './product/ProductCategories';
import AddProductPage from './product/AddProductPage';
import AllProducts from './product/AllProducts';


function ProductManage(){
    const [activeTab, setActiveTab] = useState("allproducts");
    
    return(
        <>
        <div className="admin-db-product-maintab-container">

            {/* Tabs Header */}
            <div className="admin-db-product-maintab-header">

                <button
                className={`admin-db-product-maintab-btn ${
                    activeTab === "allproducts" ? "admin-db-product-maintab-active" : ""
                }`}
                onClick={() => setActiveTab("allproducts")}
                >
                All Products
                </button>

                <button
                className={`admin-db-product-maintab-btn ${
                    activeTab === "addnewproduct" ? "admin-db-product-maintab-active" : ""
                }`}
                onClick={() => setActiveTab("addnewproduct")}
                >
                Add New Product
                </button>

                <button
                className={`admin-db-product-maintab-btn ${
                    activeTab === "Categories" ? "admin-db-product-maintab-active" : ""
                }`}
                onClick={() => setActiveTab("Categories")}
                >
                Categories
                </button>


            </div>

            {/* Tabs Content */}
            <div className="admin-db-product-maintab-content">
                {activeTab === "allproducts" && (
                <div className="admin-db-product-maintab-panel">
                    <AllProducts/>
                </div>
                )}

                {activeTab === "addnewproduct" && (
                <div className="admin-db-product-maintab-panel">
                    <AddProductPage/>
                </div>
                )}

                {activeTab === "Categories" && (
                <div className="admin-db-product-maintab-panel">
                    <ProductCategories/>
                </div>
                )}

            </div>

        </div>

    </>
    );
}

export default ProductManage;