import React, { useState } from "react";
import Head from "next/head";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { LatLngExpression, LeafletMouseEvent } from "leaflet";

const NextCustomerPage = () => {
  const [pickUpLocation, setPickUpLocation] =
    useState<LatLngExpression | null>(null);
  const [dropOffLocation, setDropOffLocation] =
    useState<LatLngExpression | null>(null);

  const handleMapClick = (event: LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;
    if (!pickUpLocation) {
      setPickUpLocation([lat, lng]);
    } else if (!dropOffLocation) {
      setDropOffLocation([lat, lng]);
    }
  };

  const MapEventsComponent = () => {
    useMapEvents({
      click: handleMapClick,
    });

    return null;
  };

  return (
    <>
      <Head>
        <title>Next Customer Page</title>
      </Head>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">Next Customer Page</h1>
        <div className="mb-4">
          <label htmlFor="pickup" className="block font-medium mb-2">
            Pick-up Location
          </label>
          <input
            id="pickup"
            type="text"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter Pick-up Location"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dropoff" className="block font-medium mb-2">
            Drop-off Location
          </label>
          <input
            id="dropoff"
            type="text"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter Drop-off Location"
          />
        </div>
        <div className="mb-4">
          <MapContainer
            center={[0, 0]} // Set the initial center of the map
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {pickUpLocation && (
              <Marker position={pickUpLocation}>
                <Popup>Pick-up location</Popup>
              </Marker>
            )}
            {dropOffLocation && (
              <Marker position={dropOffLocation}>
                <Popup>Drop-off location</Popup>
              </Marker>
            )}
            <MapEventsComponent />
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default NextCustomerPage;
