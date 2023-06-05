import { child, getDatabase, push, ref, update } from "firebase/database";
import React, { useState, ChangeEvent } from "react";


const Driver_successForm = () => {

    function offerRides()
    {
      navigator.geolocation.getCurrentPosition(updateLocationdb);
    }
    function updateLocationdb(position)
    {
      const bikeOwnerId = sessionStorage.getItem("currentDriverId");
        const driverlocation = {
          bikeOwnerId,
          position
        };
        const db = getDatabase();
    
        let newPostKey = push(child(ref(db), "availableDrivers")).key;
    
        let updates: any = {};
        updates["/availableDrivers/" + newPostKey] = driverlocation;
    
        return update(ref(db), updates)
          .then(() => {
            
          })
          .catch((error) => console.error(error));
      }
    }

    return (
        <div>
          <div className="">Hello</div>
          <div>
            <button
              className="w-full flex justify-center py-2 px-4 rounded font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              offerRides
            </button>
          </div>
          
        </div>
      );
    };

