import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
  GeoapifyGeocoderAutocompleteOptions,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import L from "leaflet";
import icon from "./location-icon.png";

interface CustomGeoapifyGeocoderAutocompleteOptions
  extends GeoapifyGeocoderAutocompleteOptions {
  options?: {
    markerIcon?: string;
  };
}

const CustomerLocation = () => {
  const [pickupLocation, setPickupLocation] = useState({
    label: "",
    coordinates: [0, 0] as [number, number],
  });
  const [dropLocation, setDropLocation] = useState({
    label: "",
    coordinates: [0, 0] as [number, number],
  });
  const [liveLocation, setLiveLocation] = useState<[number, number]>([
    10.21737, 76.321,
  ]);
  const mapRef = useRef<any>();

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

  function onRequestClick() {
    console.log("Request button clicked!");
    // Add your request code here
  }

  const locationIcon = L.icon({
    iconUrl: icon.src,
    iconRetinaUrl: icon.src,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });

  function getLiveLocation() {
    console.log("Getting live location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(
            "Live location retrieved:",
            position.coords.latitude,
            position.coords.longitude
          );
          setLiveLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          // Update the map center to the new live location
          mapRef.current.setView(
            [position.coords.latitude, position.coords.longitude],
            13
          );
        },
        (error) => {
          console.log("Error getting live location:", error.message);
          // Provide a default location as a fallback
          setLiveLocation([10.21737, 76.321]);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      // Provide a default location as a fallback
      setLiveLocation([10.21737, 76.321]);
    }
  }

  function onShowMyLocationClick() {
    getLiveLocation();
  }

  useEffect(() => {
    if (!liveLocation) {
      setLiveLocation([10.21737, 76.321]);
    }
  }, [liveLocation]);

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <form className="max-w-md mx-auto">
          <div className="mb-4 flex flex-col justify-start items-start">
            <label htmlFor="pickup" className="block font-medium mb-2">
              Pickup Location
            </label>
            <GeoapifyContext apiKey="6f0ae9a14f374257b6700c22d4ec7d92">
              <GeoapifyGeocoderAutocomplete
                placeholder="Enter pickup location"
                placeSelect={onPickupSelect}
                options={{
                  markerIcon:
                    "https://img.icons8.com/?size=512&id=67384&format=png",
                }}
                {...(Option as CustomGeoapifyGeocoderAutocompleteOptions)}
              />
            </GeoapifyContext>
          </div>
          <div className="mb-4 flex flex-col justify-start items-start">
            <label htmlFor="drop" className="block font-medium mb-2">
              Drop Location
            </label>
            <GeoapifyContext apiKey="6f0ae9a14f374257b6700c22d4ec7d92">
              <GeoapifyGeocoderAutocomplete
                placeholder="Enter drop location"
                placeSelect={onDropSelect}
                options={{
                  markerIcon:
                    "https://img.icons8.com/?size=512&id=67384&format=png",
                }}
                {...(Option as CustomGeoapifyGeocoderAutocompleteOptions)}
              />
            </GeoapifyContext>
          </div>
          <div className="mb-4 flex justify-end">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={onRequestClick}
            >
              Request
            </button>
          </div>
        </form>
        <div className="mt-8">
          <MapContainer
            center={liveLocation}
            zoom={13}
            style={{ height: "400px" }}
            ref={mapRef}
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
            {liveLocation && (
              <Marker position={liveLocation} icon={locationIcon}>
                <Popup>You are here</Popup>
              </Marker>
            )}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={onShowMyLocationClick}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 1000,
              }}
            >
              Show My Location
            </button>
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default CustomerLocation;
