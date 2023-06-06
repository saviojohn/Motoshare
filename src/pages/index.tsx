import React from "react";
import Head from "next/head";
import Link from "next/link";
import "tailwindcss/tailwind.css";

const SelectUserType = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Head>
        <title>Select User Type</title>
      </Head>
      <div className="flex flex-col md:flex-row gap-4">
        <Link
          href="/driver"
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
        >
          Bike Registration
        </Link>
        <Link
          href="/customer"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Customer
        </Link>
      </div>
        <br/>
        <div className="flex flex-col md:flex-row gap-4">
            <Link
                href="/sign_in"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Sign In
            </Link>
            <Link
                href="/signupform"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Sign Up
            </Link>
        </div>
    </div>
  );
};


export default SelectUserType;
