import React, { useState, ChangeEvent } from "react";
import Head from "next/head";
import { getDatabase, ref, child, push, update } from "firebase/database";
import router from "next/router";

const BikeDetailsForm = () => {
  const [bikeOwnerName, setBikeOwnerName] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submitData(e: { preventDefault: () => void }) {
    e.preventDefault();
    const driver = {
      bikeOwnerName,
      bikeModel,
      aadhaarNumber,
      vehicleNumber,
      email,
      password,
    };
    const db = getDatabase();

    let newDriverId = push(child(ref(db), "drivers")).key;

    let updates: any = {};
    updates["/drivers/" + newDriverId] = driver;

    return update(ref(db), updates)
      .then(() => {
        sessionStorage.setItem("currentDriverId", newDriverId as string);
        window.alert("Registration Completed");
        router.push("/driver_success");
      })
      .catch((error) => console.error(error));
  }

  return (
    <>
      <Head>
        <title>Bike Details </title>
      </Head>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">Bike Details </h1>
        <form className="max-w-md mx-auto" onSubmit={submitData}>
          <div className="mb-4">
            <label htmlFor="bikeOwnerName" className="block font-medium mb-2">
              Bike Owner Name
            </label>
            <input
              id="bikeOwnerName"
              type="text"
              className="w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={bikeOwnerName}
              onChange={(e) => setBikeOwnerName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bikeModel" className="block font-medium mb-2">
              Bike Model
            </label>
            <input
              id="bikeModel"
              type="text"
              className="w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={bikeModel}
              onChange={(e) => setBikeModel(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="aadhaarNumber" className="block font-medium mb-2">
              Aadhar Number
            </label>
            <input
              id="aadhaarNumber"
              type="number"
              className="w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="vehicleNumber" className="block font-medium mb-2">
              Vehicle Number
            </label>
            <input
              id="vehicleNumber"
              type="number"
              className="w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
            />
          </div>

          <div className="rounded-md shadow-sm">
            <div className="mb-2">
              <label
                htmlFor="email"
                className="block font-medium mb-2 text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                // required
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="password"
                className="block font-medium mb-2 text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                // required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 rounded font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BikeDetailsForm;
