import React, { useState } from "react";
import Head from "next/head";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const CustomerLocation = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");

  const handlePickupLocation = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPickupLocation(event.target.value);
  };

  const handleDropLocation = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setDropLocation(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Customer Location</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha384-zqvGKtOdqDwrH2QoVvKgZNhWCBpxHr0TWX9Rc1BpKcgt7sPZocYInB0VxSy0ca94"
          crossOrigin=""
        />
      </Head>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">Customer Location</h1>
        <form className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="pickup" className="block font-medium mb-2">
              Pickup Location
            </label>
            <input
              id="pickup"
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={pickupLocation}
              onChange={handlePickupLocation}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="drop" className="block font-medium mb-2">
              Drop Location
            </label>
            <input
              id="drop"
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={dropLocation}
              onChange={handleDropLocation}
            />
          </div>
        </form>
        <div className="mt-8">
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: "400px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {pickupLocation && (
              <Marker position={[51.505, -0.09]}>
                <Popup>{pickupLocation}</Popup>
              </Marker>
            )}
            {dropLocation && (
              <Marker position={[51.51, -0.1]}>
                <Popup>{dropLocation}</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default CustomerLocation;
