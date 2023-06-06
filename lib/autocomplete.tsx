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
import { addressAutocomplete } from "@/components/location-autocomplete";
import { Link } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { useRouter } from "next/router";

interface CustomGeoapifyGeocoderAutocompleteOptions
  extends GeoapifyGeocoderAutocompleteOptions {
  options?: {
    markerIcon?: string;
  };
}

const CustomerLocation = () => {
  const router = useRouter();
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
    geometry: { coordinates: number[] };
  }) {
    setPickupLocation({
      label: value?.properties.formatted,
      coordinates: value?.geometry.coordinates as [number, number],
    });
    if (!!value) {
      mapRef.current.setView(
        [value?.geometry.coordinates[1], value?.geometry.coordinates[0]],
        13
      );
    }
  }

  function onDropSelect(value: {
    properties: { formatted: any };
    geometry: { coordinates: number[] };
  }): void {
    setDropLocation({
      label: value?.properties?.formatted,
      coordinates: value?.geometry.coordinates as [number, number],
    });
    if (!!value) {
      mapRef.current.setView(
        [value?.geometry.coordinates[1], value?.geometry.coordinates[0]],
        13
      );
    }
  }

  async function onRequestClick(e: any) {
    e.preventDefault();
    const url = `https://api.geoapify.com/v1/routing?waypoints=${dropLocation.coordinates[1]},${dropLocation.coordinates[0]}|${pickupLocation.coordinates[1]},${pickupLocation.coordinates[0]}&mode=drive&apiKey=6f0ae9a14f374257b6700c22d4ec7d92`;
    console.log(url);
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data.features[0].properties.distance);
      const distance = data.features[0].properties.distance;
      window.confirm(
        `You will be travelling ${distance} metres. This would cost you ${
          Math.ceil(distance / 1000) * 15
        } INR. Would you like to confirm this ride?`
      );
    }
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
          setLiveLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          mapRef.current.setView(
            [position.coords.latitude, position.coords.longitude],
            13
          );
        },
        (error) => {
          console.log("Error getting live location:", error.message);
          setLiveLocation([10.21737, 76.321]);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
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

  useEffect(() => {
    addressAutocomplete(
      document.getElementById("autocomplete-container-pickup"),
      (data: any) => onPickupSelect(data),
      { placeholder: "Enter pickup location" }
    );

    addressAutocomplete(
      document.getElementById("autocomplete-container-drop"),
      (data: any) => onDropSelect(data),
      { placeholder: "Enter drop location" }
    );
  }, []);

  return (
    <div>
      <Router>
        <div className="container mx-auto px-4 py-6">
          <form className="max-w-md mx-auto">
            <div className="mb-4 flex flex-col justify-start items-start">
              <label htmlFor="pickup" className="block font-medium mb-2">
                Pickup Location
              </label>
              <div
                className="autocomplete-container"
                id="autocomplete-container-pickup"
                key={"autocomplete-container-pickup"}
              ></div>
            </div>
            <div className="mb-4 flex flex-col justify-start items-start">
              <label htmlFor="drop" className="block font-medium mb-2">
                Drop Location
              </label>
              <div
                className="autocomplete-container"
                id="autocomplete-container-drop"
                key={"autocomplete-container-drop"}
              ></div>
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
            <div className="flex justify-center">
              <button
                onClick={() => router.push("/profile")}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-600"
                style={{ position: "absolute", top: "10px", right: "10px" }}
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default CustomerLocation;
