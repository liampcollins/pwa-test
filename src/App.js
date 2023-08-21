import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ShareTarget from "./ShareTarget";

function App() {
  const sendNotification = async () => {
    const sw = await navigator.serviceWorker.ready;

    function urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

      const rawData = atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    const vapidPublicKey =
      "BKCsNxoOoar5Gi0YCc7d43jN9on0bN6MK4-B8ETgGYxGQTQ9gluU2_kHJlEp_OFdGBOlpPCDIDzPnwSuBulibDQ";

    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });
    console.log("🚀 ~ sendNotification ~ subscription:", subscription);

    await fetch("/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscription }),
    });
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  const params = new URLSearchParams(window.location.search);
  const sharedUrl = params.get("url");

  return (
    <div className="App" style={{ margin: 100 }}>
      <button onClick={sendNotification}>Send Notification</button>
      <p>URL{sharedUrl}</p>
    </div>
  );
}

export default App;
