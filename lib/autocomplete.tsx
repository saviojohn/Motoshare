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
import {get, getDatabase, ref, remove, update } from "firebase/database";
import { getAuth } from "firebase/auth";

interface CustomGeoapifyGeocoderAutocompleteOptions
  extends GeoapifyGeocoderAutocompleteOptions {
  options?: {
    markerIcon?: string;
  };
}

const CustomerLocation = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    e.preventDefault();
    const url = `https://api.geoapify.com/v1/routing?waypoints=${dropLocation.coordinates[1]},${dropLocation.coordinates[0]}|${pickupLocation.coordinates[1]},${pickupLocation.coordinates[0]}&mode=drive&apiKey=6f0ae9a14f374257b6700c22d4ec7d92`;
    console.log(url);
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data.features[0].properties.distance);
      const distance = data.features[0].properties.distance;
      if (distance > 50000) {
        window.alert("Sorry, we do not offer rides longer than 50km");
        return;
      }
      const map = mapRef.current;
      L.marker([pickupLocation.coordinates[0],pickupLocation.coordinates[1]]).addTo(map).bindPopup('Pickup Location');
      L.marker([dropLocation.coordinates[0],dropLocation.coordinates[1]]).addTo(map).bindPopup('Drop-off Location');
      const routePolyline = L.polyline([switchIndices(data.features[0].geometry.coordinates)], { color: 'blue' }).addTo(map);
      map.fitBounds(routePolyline.getBounds());
      const price = Math.ceil(distance / 1000) * 15;
      const answer = window.confirm(
        `You will be travelling ${distance} metres. This would cost you ${price} INR. Would you like to confirm this ride?`
      );
      if(answer) {
        const closestDriver = await findClosestDriver(...pickupLocation.coordinates);
        if (closestDriver.length == 0) {
          window.alert('We could not find a driver.');
          return;
        }
        bookRide(...closestDriver, price, ...pickupLocation.coordinates, ...dropLocation.coordinates);
      }
    }
  }

  function switchIndices(array: [any, any][]): [any, any][] {
    return array[0].map(([first, second]) => [second, first]);
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

  async function findClosestDriver(inputLon: number, inputLat: number) {
    try {
      const snapshot = await get(ref(getDatabase(), '/activeDriverLocations'));
      const coordinates = snapshot.val();

      console.log(coordinates);
      let closestDistance = Infinity;
      let closestCoordinates: number[] | null = null;

      Object.entries(coordinates)
          .forEach(([key, { latitude, longitude }]) => {
            if(key != 'null') {
              const distance = calculateDistance(inputLat, inputLon, latitude, longitude);
              if (distance < closestDistance) {
                closestDistance = distance;
                closestCoordinates = [key, latitude, longitude];
              }
            }
      });

      return closestCoordinates ?? [];
    } catch (error) {
      console.error('Error finding closest coordinates:', error);
      return [];
    }
  }


  const calculateDistance = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
  ) => {
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const degToRad = (deg: number) => deg * (Math.PI / 180);

    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degToRad(lat1)) *
        Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c; // Distance in kilometers
    return distance;
  };

  function bookRide(driver: string, latitude: number, longitude: number, fare: number, pickupLongitude: number, pickupLatitude: number, dropLongitude: number, dropLatitude: number) {
    const currentUser = getAuth().currentUser.uid;
    const db = getDatabase();
    remove(ref(db, "/activeDriverLocations/" + driver))
        .then(() => {
          const details = {
            driver,
            latitude: pickupLatitude,
            longitude: pickupLongitude,
            otp: generateOTP(),
            fare,
            dropLatitude,
            dropLongitude
          };

          console.log(details);
          // Save driver details to the Firebase Realtime Database
          return update(ref(getDatabase()), {['activeRides/' + currentUser]:details})
              .then(() => {
                setIsLoading(false);
                window.alert("We found you a driver :)");
                router.push('/active_ride');
              });
        })
        .catch((error) => {
          console.error(error)
        });
  }

  const generateOTP = (): string => {
    const otpLength = 6;
    let otp = '';

    for (let i = 0; i < otpLength; i++) {
      otp += Math.floor(Math.random() * 10).toString();
    }

    return otp;
  };


  return (
    <div>
      <Router>
        <div className="container mx-auto">
          {isLoading ? (
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
                <p className="ml-4">Looking for drivers...</p>
              </div>
          ) : null}

        </div>

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
              <button
                  onClick={() => router.push("/active_ride")}
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-600"
                  style={{ position: "absolute", top: "10px", right: "10px" }}
              >
                Active Ride
              </button>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default CustomerLocation;



