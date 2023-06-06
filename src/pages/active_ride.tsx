import UserInformation from "@/components/user.profile";
import { getAuth } from "firebase/auth";
import {get, getDatabase, onValue, ref } from "firebase/database";
import { useRouter } from "next/router";
import {useEffect, useState } from "react";

const ActiveRide = () => {
    const [rideInfo, updateRideInfo] = useState({});
    const [driverInfo, updateDriverInfo] = useState({});

    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getDatabase();
                const user = getAuth().currentUser;
                let snapshot = await get(ref(db, 'activeRides/' + user.uid));
                const ride = snapshot.val();
                updateRideInfo(ride);
                snapshot = await get(ref(db, 'drivers/' + ride.driver));
                updateDriverInfo(snapshot.val());
            } catch (e) {
                console.log(e);
                //router.push('/sign_in');
            }
        }
        fetchData();
    }, [])
    return (
        <div>
            {rideInfo.otp ? (<div className="bg-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-4">Share OTP for the Ride</h2>
                    <div className="flex items-center justify-between">
                        <label className="mr-4">OTP:</label>
                        <span>{rideInfo.otp}</span>
                    </div>
                </div>
            </div>
            ) : null}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-4">Driver Details</h2>
                <UserInformation userInfo={driverInfo}></UserInformation>
            </div>
        </div>
    );
};

export default ActiveRide;
