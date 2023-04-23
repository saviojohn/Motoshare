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
      <h1 className="text-3xl font-bold mb-8">Select User Type</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/driver">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Driver
          </button>
        </Link>
        <Link href="/customer">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Customer
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SelectUserType;
