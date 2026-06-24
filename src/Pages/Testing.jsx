import { useState } from "react";

function Testing() {
  const [postcode, setPostcode] = useState("");
  const [result, setResult] = useState(null);

  const checkPostcode = async () => {
    try {
            const response = await fetch(
        "http://localhost:5000/api/location/checkpostcodeel",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            postcode,
            }),
        }
        );

        const data = await response.json();

        console.log("State:", data.state);
        console.log("City:", data.city);
        console.log("Within Radius:", data.withinRadius);

      setResult(data.withinRadius);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Postcode"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
      />

      <button onClick={checkPostcode}>
        Check
      </button>

      {result !== null && (
        <p>
          {result
            ? "✅ Delivery Available"
            : "❌ Delivery Not Available"}
        </p>
      )}
    </div>
  );
}

export default Testing;