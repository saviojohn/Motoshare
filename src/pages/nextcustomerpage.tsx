import React, { useState } from "react";
import Head from "next/head";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

const CustomerLocation = () => {
  const [pickupLocation, setPickupLocation] = useState({
    label: "",
    coordinates: [0, 0] as [number, number],
  });
  const [dropLocation, setDropLocation] = useState({
    label: "",
    coordinates: [0, 0] as [number, number],
  });

  function onPickupSelect(value: {
    properties: { formatted: any };
    geometry: { lng: number; lat: number };
  }) {
    setPickupLocation({
      label: value.properties.formatted,
      coordinates: [value.geometry.lng, value.geometry.lat],
    });
  }

  function onDropSelect(value: {
    properties: { formatted: any };
    geometry: { lng: number; lat: number };
  }): void {
    setDropLocation({
      label: value.properties.formatted,
      coordinates: [value.geometry.lng, value.geometry.lat],
    });
  }

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
            <GeoapifyContext apiKey="6f0ae9a14f374257b6700c22d4ec7d92">
              <GeoapifyGeocoderAutocomplete
                placeholder="Enter pickup location"
                placeSelect={onPickupSelect}
              />
            </GeoapifyContext>
          </div>
          <div className="mb-4">
            <label htmlFor="drop" className="block font-medium mb-2">
              Drop Location
            </label>
            <GeoapifyContext apiKey="6f0ae9a14f374257b6700c22d4ec7d92">
              <GeoapifyGeocoderAutocomplete
                placeholder="Enter drop location"
                placeSelect={onDropSelect}
              />
            </GeoapifyContext>
          </div>
        </form>
        <div className="mt-8">
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: "400px" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {pickupLocation.label &&
              pickupLocation.coordinates.length === 2 && (
                <Marker position={pickupLocation.coordinates}>
                  <Popup>{pickupLocation.label}</Popup>
                </Marker>
              )}
            {dropLocation.label && dropLocation.coordinates.length === 2 && (
              <Marker position={dropLocation.coordinates}>
                <Popup>{dropLocation.label}</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default CustomerLocation;
