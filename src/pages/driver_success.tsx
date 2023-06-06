import UserInformation from "@/components/user.profile";
import { getAuth } from "firebase/auth";
import { child, getDatabase, onValue, push, ref, remove, update } from "firebase/database";
import { useRouter } from "next/router";
import React, { useState, ChangeEvent, useEffect } from "react";

const Driver_successForm = () => {
    const router = useRouter();
    const [userInfo, updateUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleOfflineClick = () => {
        setIsLoading(false);
        const db = getDatabase();
        const bikeOwnerId = getAuth().currentUser.uid;
        remove(ref(db, "/activeDriverLocations/" + bikeOwnerId))
            .then(() => {
                window.alert('you are offline now');
            })
            .catch((error) => {
                console.error(error)
            });
    };
    useEffect(() => {
        try {
            const db = getDatabase();
            const user = getAuth().currentUser;
            const entity = user.displayName == 'driver'? 'drivers': 'customers';
            const profile = ref(db, entity+'/' + user.uid);
            onValue(profile, (snapshot) => {
                const data = snapshot.val();
                updateUserInfo(data);
            });
        } catch (e) {
            router.push('/sign_in');
        }
    }, [])
    function offerRides()
    {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(updateLocationdb);
    }

    function updateLocationdb(position: any)
    {
      const bikeOwnerId = getAuth().currentUser.uid;
        const driverlocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        const db = getDatabase();
    
        let updates: any = {};
        updates["/activeDriverLocations/" + bikeOwnerId] = driverlocation;
    
        return update(ref(db), updates)
          .then(() => {
                pollForRides()
          })
          .catch((error) => {
              console.error(error)
          });
    }

    function pollForRides() {
        const db = getDatabase();
        const user = getAuth().currentUser;
        const profile = ref(db, 'allotedRides/' + user.uid);
        onValue(profile, (snapshot) => {
            const data = snapshot.val();
            updateAllotedRide(data);
        });
    }

    function updateAllotedRide(data: any) {
        if (data) {
            window.alert("ride alloted");
        }
    }

    return (
        <div>
            <div className="flex justify-center">
                <button
                    onClick={() => router.push("/profile")}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-600"
                    style={{ position: "absolute", top: "10px", right: "10px" }}
                >
                    Profile
                </button>
            </div>
            <div className="container mx-auto">
                <UserInformation userInfo={userInfo} />
                {!isLoading && (<button style={{ float: 'right', margin: 5 }}
                        onClick={offerRides}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-600"
                >
                    Offer Rides
                </button>)}
                {isLoading && (
                        <button
                            style={{ float: 'right', margin: 5 }}
                            onClick={handleOfflineClick}
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-600"
                        >
                            Go Offline
                        </button>
                )}
            </div>
            <div className="container mx-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-screen">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
                        <p className="ml-4">Looking for customers...</p>
                    </div>
                ) : null}

            </div>
        </div>
      );
    };

export default Driver_successForm;