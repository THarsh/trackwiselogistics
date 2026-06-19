import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function CustomerTracking() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  const testFirebase = async () => {
    setMessage("Testing Firebase connection...");

    try {
      const docRef = doc(db, "shipments", "TRK1001");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
        setMessage("Firebase is working successfully.");
      } else {
        setMessage("Firebase connected, but document TRK1001 was not found.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Firebase test failed. Check console for error.");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Firebase Test</h1>

      <button onClick={testFirebase}>Test Firebase</button>

      <p>{message}</p>

      {data && (
        <div>
          <h2>Shipment Data</h2>
          <p>
            <strong>Tracking ID:</strong> {data.trackingId}
          </p>
          <p>
            <strong>Customer:</strong> {data.customerName}
          </p>
          <p>
            <strong>Status:</strong> {data.status}
          </p>
          <p>
            <strong>Location:</strong> {data.currentLocation}
          </p>
          <p>
            <strong>ETA:</strong> {data.eta}
          </p>
          <p>
            <strong>ETA:</strong> {data.email}
          </p>
        </div>
      )}
    </div>
  );
}

export default CustomerTracking;
