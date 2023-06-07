import UserInformation from "@/components/user.profile";
import { getAuth } from "firebase/auth";
import {get, getDatabase, onValue, ref } from "firebase/database";
import { useRouter } from "next/router";
import {useEffect, useState } from "react";
import L from 'leaflet';
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
                const pickupLocation = [ride.latitude, ride.longitude]; // Example pickup location coordinates
                const dropLocation = [ride.dropLatitude, ride.dropLongitude];
                const map = L.map('map').setView(pickupLocation, 13);
                // Example drop-off location coordinates
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: 'Map data © OpenStreetMap contributors',
                }).addTo(map);

                L.marker(pickupLocation).addTo(map).bindPopup('Pickup Location');
                L.marker(dropLocation).addTo(map).bindPopup('Drop-off Location');
                fetchDrivingRoute(pickupLocation, dropLocation).then((route) => {
                    console.log(switchIndices(route));
                    const routePolyline = L.polyline([switchIndices(route)], { color: 'blue' }).addTo(map);
                    map.fitBounds(routePolyline.getBounds());
                })
                    .catch(() => {
                        const routePolyline = L.polyline([pickupLocation, dropLocation], { color: 'blue' }).addTo(map);
                        map.fitBounds(routePolyline.getBounds());

                    });
            } catch (e) {
                console.log(e);
                //router.push('/sign_in');
            }
        }
        fetchData();
    }, [])
    async function fetchDrivingRoute(startLocation, endLocation) {
        const apiKey = '6f0ae9a14f374257b6700c22d4ec7d92';
        const url = `https://api.geoapify.com/v1/routing?waypoints=${startLocation[0]},${startLocation[1]}|${endLocation[0]},${endLocation[1]}&mode=drive&apiKey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        const route = data.features[0].geometry.coordinates;
        console.log(route);
        return route;
    }

    function switchIndices(array: [any, any][]): [any, any][] {
        return array[0].map(([first, second]) => [second, first]);
    }

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
            <div id="map" className="h-64 mb-4"></div>
        </div>
    );
};

export default ActiveRide;
