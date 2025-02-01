"use client"; // Keep this if you're using Next.js App Router

import { useState } from "react";

export default function OpenDoor() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const allowedKeys = ["A", "B", "C", "D", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const doorname = "maindoor";
  const deviceId = "11223355";

  const handleKeyPress = (key) => {
    if (pin.length < 6) {
      setPin((prev) => prev + key);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://sxera9zsa1.execute-api.ap-southeast-2.amazonaws.com/dev/device/opendoor",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ doorname, deviceId, virtualPin: pin }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(`? Success: ${data.message || "Door opened!"}`);
      } else {
        setMessage(`? Error: ${data.error || "Invalid PIN"}`);
      }
    } catch (error) {
      setMessage("? Error: Unable to connect to server.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-lg font-semibold mb-2">Enter 6-digit PIN</h2>

        <div className="mb-4 p-2 border text-lg">{pin || "______"}</div>

        <div className="grid grid-cols-4 gap-2">
          {allowedKeys.map((key) => (
            <button
              key={key}
              className="px-4 py-2 bg-gray-200 rounded text-xl"
              onClick={() => handleKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-between">
          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleDelete}>
            Delete
          </button>
          <button
            className={`px-4 py-2 rounded ${pin.length === 6 ? "bg-green-500 text-white" : "bg-gray-300"}`}
            onClick={handleSubmit}
            disabled={pin.length !== 6 || loading}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>

        {message && <p className="mt-4 text-lg">{message}</p>}
      </div>
    </div>
  );
}
