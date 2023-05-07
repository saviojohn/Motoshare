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
        <Link href="/driver">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
            Bike Registration
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
