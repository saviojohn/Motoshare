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
        <div className="bg-turquoise-500 py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">Motoshare</h1>
                </div>
            </div>
        </div>


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
