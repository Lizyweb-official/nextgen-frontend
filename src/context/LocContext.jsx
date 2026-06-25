import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const LocContext = createContext();

const API = import.meta.env.VITE_API_URL;


export const LocProvider = ({ children }) => {
  const { user } = useAuth();

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
  const syncLocation = async () => {
    try {
      // Existing localStorage sync
      const savedLocation = JSON.parse(
        localStorage.getItem("deliveryLocation") || "null"
      );

      setLocationData(savedLocation);

      // Fetch user details if logged in
      if (user?.id) {
        const response = await fetch(
          `${API}/api/getuserdetailsbyuid`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: user.id,
            }),
          }
        );

        const data = await response.json();
      }
    } catch (err) {
      console.error(err);
      setLocationData(null);
    }
  };

  syncLocation();

  window.addEventListener("storage", syncLocation);

  return () => {
    window.removeEventListener("storage", syncLocation);
  };
}, [user?.id]);

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
  }, [user]);

  const saveLocation = async (data) => {
    localStorage.setItem(
      "deliveryLocation",
      JSON.stringify(data)
    );

     let userDetails = {};

      try {
        const responseone = await fetch(
          `${API}/api/getuserdetailsbyuid`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid: user?.id }),
          }
        );

        userDetails = await responseone.json();

        console.log("User Details:", userDetails);
      } catch (err) {
        console.error(err);
      }

      try {
        const response = await fetch(
          `${API}/api/updateuserdetails`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: user?.id,

              name: userDetails?.name || "",
              contactNumber: userDetails?.contactNumber || "",
              street: userDetails?.street || "",

              city: data.city,
              state: userDetails?.state || "",

              pincode: data.postcode,

              emailAddress: userDetails?.emailAddress || "",
            }),
          }
        );

        const updatedData = await response.json();
        console.log(updatedData);
      } catch (err) {
        console.error(err);
      }
          

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