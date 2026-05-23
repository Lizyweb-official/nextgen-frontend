import '../../../css/style-1.css';
import '../../../css/style-2.css';
import '../../../css/style-3.css';
import '../../../css/style-4.css';
import '../../../css/style.css';

import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function OrderAvailableCity() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [stateName, setStateName] = useState("");
    const [countryName, setCountryName] = useState("");

    const [cityName, setCityName] = useState("");
    const [postcode, setPostcode] = useState("");

    // GET ALL DATA
    const fetchData = async () => {

        try {

            const response = await fetch(`${API}/api/admin/getallordercity`);

            const result = await response.json();

            setData(result);

            // STATE
            const stateData = result.find(
                (item) => item.type === "state"
            );

            // COUNTRY
            const countryData = result.find(
                (item) => item.type === "country"
            );

            if (stateData) {
                setStateName(stateData.name);
            }

            if (countryData) {
                setCountryName(countryData.name);
            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // UPDATE
    const updateByType = async (name, type) => {

        if (!name) {
            alert(`${type} is required`);
            return;
        }

        try {

            const response = await fetch(
                `${API}/api/admin/updatenamebytype`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        type
                    }),
                }
            );

            const result = await response.json();

            if (result.success) {

                alert(`${type} updated successfully`);

                fetchData();

            } else {

                alert(result.message || "Update failed");

            }

        } catch (error) {

            console.log(error);

            alert("Something went wrong");

        }
    };

    // ADD CITY + POSTCODE
    const addPostcodeCity = async () => {

        if (!cityName) {
            alert("City name is required");
            return;
        }

        if (!postcode) {
            alert("Postcode is required");
            return;
        }

        // JOIN CITY + POSTCODE
        const finalValue = `${cityName},${postcode}`;

        try {

            const response = await fetch(
                `${API}/api/admin/addordercity`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        City: finalValue,
                        type: "city"
                    }),
                }
            );

            const result = await response.json();

            if (result.success) {

                alert("Added successfully");

                setCityName("");
                setPostcode("");

                fetchData();

            } else {

                alert(result.message || "Failed to add");

            }

        } catch (error) {

            console.log(error);

            alert("Something went wrong");

        }
    };

    // DELETE
    const deleteCity = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `${API}/api/admin/deleteordercitybyid/${id}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.json();

            if (result.success) {

                alert("Deleted successfully");

                fetchData();

            } else {

                alert(result.message || "Delete failed");

            }

        } catch (error) {

            console.log(error);

            alert("Something went wrong");

        }
    };

    // FILTER POSTCODE TYPE
    const postcodeCities = data.filter(
        (item) => item.type === "city"
    );

    return (
        <>        
            <div className="admin-db-orders-city-root">
                <h2 className="admin-db-orders-city-heading">
                Order Available City Settings
                </h2>
        
                {loading ? (
                <p className="admin-db-orders-city-loading">Loading…</p>
                ) : (
                <>
                    {/* STATE */}
                    <div className="admin-db-orders-city-card">
                    <p className="admin-db-orders-city-card-title">State</p>
                    <div className="admin-db-orders-city-input-group">
                        <input
                        className="admin-db-orders-city-input"
                        type="text"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="Enter state"
                        />
                    </div>
                    <button
                        className="admin-db-orders-city-btn"
                        onClick={() => updateByType(stateName, "state")}
                    >
                        Update State
                    </button>
                    </div>
        
                    {/* COUNTRY */}
                    <div className="admin-db-orders-city-card">
                    <p className="admin-db-orders-city-card-title">Country</p>
                    <div className="admin-db-orders-city-input-group">
                        <input
                        className="admin-db-orders-city-input"
                        type="text"
                        value={countryName}
                        onChange={(e) => setCountryName(e.target.value)}
                        placeholder="Enter country"
                        />
                    </div>
                    <button
                        className="admin-db-orders-city-btn"
                        onClick={() => updateByType(countryName, "country")}
                    >
                        Update Country
                    </button>
                    </div>
        
                    {/* ADD CITY + POSTCODE */}
                    <div className="admin-db-orders-city-card">
                    <p className="admin-db-orders-city-card-title">
                        Add City With Postcode
                    </p>
                    <div className="admin-db-orders-city-input-group">
                        <input
                        className="admin-db-orders-city-input"
                        type="text"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                        placeholder="Enter city name"
                        />
                        <input
                        className="admin-db-orders-city-input"
                        type="text"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        placeholder="Enter postcode"
                        />
                    </div>
                    <button
                        className="admin-db-orders-city-btn admin-db-orders-city-btn-add"
                        onClick={addPostcodeCity}
                    >
                        + Add City
                    </button>
                    </div>
        
                    {/* LIST */}
                    <div className="admin-db-orders-city-list-card">
                    <p className="admin-db-orders-city-card-title">
                        Available Postcode Cities
                        {postcodeCities.length > 0 && (
                        <span className="admin-db-orders-city-badge">
                            {postcodeCities.length}
                        </span>
                        )}
                    </p>
        
                    {postcodeCities.length === 0 ? (
                        <p className="admin-db-orders-city-list-empty">
                        No postcode cities added yet
                        </p>
                    ) : (
                        postcodeCities.map((item) => (
                        <div key={item.id} className="admin-db-orders-city-list-item">
                            <span className="admin-db-orders-city-item-name">
                            <span className="admin-db-orders-city-item-dot" />
                            {item.name}
                            </span>
                            <button
                            className="admin-db-orders-city-btn-delete"
                            onClick={() => deleteCity(item.id)}
                            >
                            Delete
                            </button>
                        </div>
                        ))
                    )}
                    </div>
                </>
                )}
            </div>
            </>
    );
}

export default OrderAvailableCity;