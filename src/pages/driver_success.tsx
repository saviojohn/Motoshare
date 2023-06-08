import UserInformation from "@/components/user.profile";
import { getAuth } from "firebase/auth";
import { child, get, getDatabase, onValue, push, ref, remove, update } from "firebase/database";
import { useRouter } from "next/router";
import React, { useState, ChangeEvent, useEffect } from "react";

const Driver_successForm = () => {
    const router = useRouter();
    const [userInfo, updateUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [customerInfo, setCustomerInfo] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [rideInfo, setRideInfo] = useState({});
    const [otp, setOtp] = useState('');

    const handleOtpSubmit = () => {
        if(otp == rideInfo.otp) {
            window.alert('otp confirmed, ride started');
            router.push('/complete_ride?customer='+customerId);
        } else {
            window.alert("otp did not match, sorry");
        }
    };

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
        console.log('getting location');
        navigator.geolocation.getCurrentPosition(updateLocationdb);
    }

    function updateLocationdb(position: any)
    {
        console.log('location acquired: '+position);
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
        const profile = ref(db, 'activeRides/');
        onValue(profile, (snapshot) => {
            const data = snapshot.val();
            if(data) {
                Object?.entries(data).forEach(([key, details]) => {
                    if(details.driver == user.uid) {
                        setCustomerId(key);
                        updateAllotedRide(key, details);
                    }
                });
            }
        });
    }

    async function updateAllotedRide(customerId: any, data: any) {
        window.alert("ride alloted");
        const db = getDatabase();
        const bikeOwnerId = getAuth().currentUser.uid;
        remove(ref(db, "/activeDriverLocations/" + bikeOwnerId))
            .then(() => {
                window.alert('you are offline now');
            })
            .catch((error) => {
                console.error(error)
            });
        setIsLoading(false);
        if (data) {
            let snapshot = await get(ref(db, 'customers/' + customerId));
            const customer = snapshot.val();
            setCustomerInfo(customer);
            setRideInfo(data);
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
                {!isLoading && !customerInfo ? (<button style={{ float: 'right', margin: 5 }}
                        onClick={offerRides}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-600"
                >
                    Offer Rides
                </button>) : null}
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

                {!isLoading && customerInfo ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Customer Information</h2>
                        <div className="mb-4">
                            <label className="block mb-1">Name:</label>
                            <p>{customerInfo.name}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Phone Number:</label>
                            <p>{customerInfo.phone}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Fare:</label>
                            <p>{rideInfo.fare}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">Pick Up Location:</label>
                            <p><a style={{ color: 'blue' }} href={"https://www.google.com/maps/dir/Current+Location/"+rideInfo.latitude+","+rideInfo.longitude} target="_blank">
                            Open in Google Maps
                            </a></p>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1">OTP:</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-4 py-2 w-40"
                                value={otp}
                                onChange={(event) => setOtp(event.target.value)}
                                maxLength={6}
                                minLength={6}
                                pattern="[0-9]{6}"
                                placeholder="Enter OTP"
                                required
                            />
                        </div>
                        <button
                            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 focus:outline-none"
                            onClick={handleOtpSubmit}
                        >
                            Confirm Pickup
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
      );
    };

export default Driver_successForm;