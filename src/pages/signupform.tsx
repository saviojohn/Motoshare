import { useState } from 'react';
import firebase from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import Head from 'next/head';
import { getDatabase, ref, update } from 'firebase/database';
import { useRouter } from 'next/router';

function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const [bikeModel, setBikeModel] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const router = useRouter();

    const handleSignUp = (e) => {
        e.preventDefault();

        createUserWithEmailAndPassword(getAuth(), email, password)
            .then((userCredential) => {
                // Access the newly created user
                const user = userCredential.user;

                // Set custom user type
                return updateProfile(user, {
                    displayName: userType == 'driver'? 'driver': 'customer',
                }).then(() => {
                    // User profile updated successfully
                    console.log('Custom user type added.');

                    // Additional logic for driver type
                    if (userType === 'driver') {
                        // Update the user's custom claims (roles)
                        return getAuth().currentUser.getIdTokenResult(true)
                            .then((idTokenResult) => {
                                // Set custom claims
                                localStorage.setItem(user.uid, 'driver');
                                        // Update additional driver details in the database
                                        const driverDetails = {
                                            vehicleNumber,
                                            aadharNumber,
                                            bikeModel,
                                            name,
                                            gender,
                                            email,
                                            phone,
                                            address
                                        };

                                        // Save driver details to the Firebase Realtime Database
                                        return update(ref(getDatabase()), {['drivers/' + user.uid]:driverDetails})
                                            .then(() => {
                                                window.alert("You are registered successfully, please sign in :)");
                                                router.push('/sign_in');
                                            });

                            });
                    } else {
                        // Save rider details to the Firebase Realtime Database
                        const riderDetails = {
                            name,
                            gender,
                            email,
                            phone,
                            address
                        };

                        return update(ref(getDatabase()), {['customers/' + user.uid]:riderDetails})
                            .then(() => {
                                window.alert("You are registered successfully, please sign in :)");
                                router.push('/sign_in');
                            });
                    }
                })
                    .catch(error => console.error(error));
            })
            .catch((error) => {
                // Handle errors
                console.error(error);
            });
    };

    return (
        <>
            <Head>
                <title>Customer Form</title>
            </Head>
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold mb-4">Customer Form</h1>
                <form onSubmit={handleSignUp}>

                    <div className="mb-4">
                        <label htmlFor="name" className="block font-medium mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block font-medium mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block font-medium mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="name" className="block font-medium mb-2">Address</label>
                        <input
                            type="text"
                            id="address"
                            className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="block font-medium mb-2">
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="gender" className="block font-medium mb-2">
                            Gender
                        </label>
                        <select
                            id="gender"
                            className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            defaultValue=""
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="userType" className="block font-medium mb-2">User Type</label>
                        <select
                            id="userType"
                            className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                        >
                            <option value="customer">Customer</option>
                            <option value="driver" >Driver</option>
                        </select>
                    </div>

                    {userType === 'driver' && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="vehicleNumber" className="block font-medium mb-2">Vehicle Number</label>
                                <input
                                    type="text"
                                    id="vehicleNumber"
                                    className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Vehicle Number"
                                    value={vehicleNumber}
                                    onChange={(e) => setVehicleNumber(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="aadharNumber" className="block font-medium mb-2">Aadhar Number</label>
                                <input
                                    type="text"
                                    id="aadharNumber"
                                    className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Aadhar Number"
                                    value={aadharNumber}
                                    onChange={(e) => setAadharNumber(e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="bikeModel" className="block font-medium mb-2">Bike Model</label>
                                <input
                                    type="text"
                                    id="bikeModel"
                                    className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Bike Model"
                                    value={bikeModel}
                                    onChange={(e) => setBikeModel(e.target.value)}
                                />
                            </div>

                        </>)}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                    </form>
            </div>
        </>

    );
}

export default SignUpForm;
