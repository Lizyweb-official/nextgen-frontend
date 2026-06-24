import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const LocContext = createContext();

const API = import.meta.env.VITE_API_URL;

export const LocProvider = ({ children }) => {
  const [locationData, setLocationData] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("deliveryLocation") || "null"
      );
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncLocation = () => {
      try {
        const savedLocation = JSON.parse(
          localStorage.getItem("deliveryLocation") || "null"
        );

        setLocationData(savedLocation);
      } catch {
        setLocationData(null);
      }
    };

    window.addEventListener("storage", syncLocation);

    return () => {
      window.removeEventListener("storage", syncLocation);
    };
  }, []);

  const saveLocation = (data) => {
    localStorage.setItem(
      "deliveryLocation",
      JSON.stringify(data)
    );

    setLocationData(data);
  };

  const clearLocation = () => {
    localStorage.removeItem("deliveryLocation");
    setLocationData(null);
  };

  const checkPostcode = async (postcode) => {
    if (!postcode?.trim()) {
      throw new Error("Please enter a postcode");
    }

    const response = await fetch(
      `${API}/api/location/checkpostcodeel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postcode: postcode.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Something went wrong"
      );
    }

    const locationInfo = {
      postcode: data.postcode,
      city: data.city,
      state: data.state,
      available: data.withinRadius,
    };

    saveLocation(locationInfo);

    return locationInfo;
  };

  return (
    <LocContext.Provider
      value={{
        locationData,
        setLocationData: saveLocation,
        clearLocation,
        checkPostcode,
      }}
    >
      {children}
    </LocContext.Provider>
  );
};

export const useLocation = () => {
  return useContext(LocContext);
};