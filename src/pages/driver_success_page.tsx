import React, { useState, useEffect } from "react";
import Head from "next/head";
import { MapContainer, TileLayer, Marker, Popup, MapContainerProps } from "react-leaflet";
import { LatLngExpression } from "leaflet";

const DriverSuccessPage = () => {
  const [driverLocation, setDriverLocation] = useState<LatLngExpression | null>(
    null
  );
  const [customerLocation, setCustomerLocation] =
    useState<LatLngExpression | null>(null);

  useEffect(() => {
    // Use browser's geolocation API to get the current location of the user
    navigator.geolocation.getCurrentPosition(
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
  }, []);

  const mapProps: MapContainerProps = {
    center: driverLocation as LatLngExpression,
    zoom: 13,
    style: { height: "100%", width: "100%" }
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
          />
          <div className="bg-gray-100 justify-center mt-[2rem] p-4 mb-[8rem]">
            <div className="text-gray-800 text-center">Popup message here</div>
          </div>
        </div>
        <div className="flex-grow relative h-[50%]">
          {driverLocation && (
            <MapContainer {...mapProps}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={driverLocation}>
                <Popup>Your location</Popup>
              </Marker>
              {customerLocation && (
                <Marker position={customerLocation}>
                  <Popup>Customer location</Popup>
                </Marker>
              )}
            </MapContainer>
          )}
        </div>
      </div>
    </>
  );
};

export default DriverSuccessPage;
