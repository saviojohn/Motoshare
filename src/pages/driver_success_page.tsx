import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  MapContainerProps,
} from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { Link } from "react-router-dom";

const DriverSuccessPage = () => {
  const [driverLocation, setDriverLocation] = useState<LatLngExpression | null>(
    null
  );
  const [customerLocation, setCustomerLocation] =
    useState<LatLngExpression | null>(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setDriverLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      (error) => {
        console.log(error);
      }
    );

    // Set the customer location
    setCustomerLocation([37.3821168339051, -122.07830467821675]); // Replace with actual customer location

    // Clean up the watchPosition when the component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const mapProps: MapContainerProps = {
    center: driverLocation as LatLngExpression,
    zoom: 13,
    style: { height: "400px", width: "100%" },
  };

  // Profile button click handler
  const handleProfileClick = () => {
    // Navigate to the driver profile page
    // Replace the path with the actual path to the driver profile page
    window.location.href = "/driver-profile";
  };

  return (
    <>
      <Head>
        <title>Success</title>
      </Head>
      <div className="flex flex-col h-screen">
        <div className="bg-gray-100 p-4">
          <img
            src="/profile-icon.png"
            alt="Profile Icon"
            className="w-8 h-8 rounded-full float-right cursor-pointer"
            onClick={handleProfileClick}
          />
          <div className="bg-gray-100 justify-center mt-[2rem] p-4 mb-[8rem]">
            <div className="text-gray-800 text-center">Popup message here</div>
          </div>
        </div>
        <div className="flex-grow relative h-[50%]">
          {driverLocation && (
            <MapContainer {...mapProps}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {driverLocation && (
                <Marker position={driverLocation}>
                  <Popup>Your location</Popup>
                </Marker>
              )}
              {customerLocation && (
                <Marker position={customerLocation}>
                  <Popup>Customer location</Popup>
                </Marker>
              )}
              {/* Profile button */}
              <button className="absolute top-4 right-4">
                <Link to="/driver-profile">Profile</Link>
              </button>
            </MapContainer>
          )}
          <button
            className="absolute bottom-4 right-4"
            onClick={() => setDriverLocation(null)}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default DriverSuccessPage;
