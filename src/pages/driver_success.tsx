import { child, getDatabase, push, ref, update } from "firebase/database";
import React, { useState, ChangeEvent } from "react";


const Driver_successForm = () => {

    function offerRides()
    {
      navigator.geolocation.getCurrentPosition(updateLocationdb);
    }

    function updateLocationdb(position: any)
    {
      const bikeOwnerId = sessionStorage.getItem("currentDriverId");
        const driverlocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        const db = getDatabase();
    
        let updates: any = {};
        updates["/activeDriverLocations/" + bikeOwnerId] = driverlocation;
    
        return update(ref(db), updates)
          .then(() => {
            
          })
          .catch((error) => {
              console.error(error)
          });
    }

    return (
        <div>
          <div>
            <button onClick={offerRides}
              className="w-full flex justify-center py-2 px-4 rounded font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Offer Rides
            </button>
          </div>
        </div>
      );
    };

export default Driver_successForm;