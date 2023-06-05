import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getDatabase, ref, child, push, update } from "firebase/database";

const CustomerForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const router = useRouter();

  function submitData(e: { preventDefault: () => void }) {
    e.preventDefault();
    const customer = { name, email, password, phone, gender };
    const db = getDatabase();

    let newPostKey = push(child(ref(db), "posts")).key;

    let updates: any = {};
    updates["/customers/" + newPostKey] = customer;

    return update(ref(db), updates)
      .then(() => {
        window.alert("Registration Completed");
        router.push("/");
      })
      .catch((error) => console.error(error));
  }

  function requestRide() {
    router.push("/nextcustomerpage");
  }

  return (
    <>
      <Head>
        <title>Customer Form</title>
      </Head>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">Customer Form</h1>
        <form className="max-w-md mx-auto" onSubmit={submitData}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block font-medium mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
        <div className="mt-4">
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-600"
            onClick={requestRide}
          >
            Book Ride
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomerForm;
