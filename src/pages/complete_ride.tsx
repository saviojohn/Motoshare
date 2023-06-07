import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import {get, getDatabase, ref, remove, update } from 'firebase/database';
import L from 'leaflet';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
const RideDetails: React.FC = () => {

    const router = useRouter();
    const [rideInfo, updateRideInfo] = useState({});
    useEffect(() => {
        const fetchData = async () => {
        const {customer} = router.query;
        const db = getDatabase();
        const user = getAuth().currentUser;
        let snapshot = await get(ref(db, 'activeRides/' + customer));
        const ride = snapshot.val();
        updateRideInfo(ride);
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
        }
        fetchData();
    }, []);

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

    const handleCompleteRide = async () => {
        const confirmRideCompletion = window.confirm(
            `Are you sure you want to complete the trip?\nFare: ${rideInfo.fare}INR`
        );

        if (confirmRideCompletion) {
            // Remove the current ride from the database
            const {customer} = router.query;
            const database = getDatabase();
            let snapshot = await get(ref(database, 'activeRides/' + customer));
            const ride = snapshot.val();
            update(ref(getDatabase()), {['completedRides/' + customer]:ride})
                .then(() => {
                    const rideRef = ref(database, 'activeRides/'+customer); // Replace 'current' with your specific ride identifier
                    remove(rideRef);
                    window.alert("ride completed. looking for new customers");
                    router.push('/driver_success');
                });
        }
    };
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Ride Details</h2>
            <div id="map" className="h-64 mb-4"></div>
            <button
                className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 focus:outline-none"
                onClick={handleCompleteRide}
            >
                Complete Ride
            </button>
        </div>
    );
};

export default RideDetails;
