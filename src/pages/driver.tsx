import React, { useState, ChangeEvent } from "react";
import Head from "next/head";
import Link from "next/link";

const BikeDetailsForm = () => {
  const [bikeModel, setBikeModel] = useState("");
  const [bikeType, setBikeType] = useState("");
  const [nocFile, setNocFile] = useState<FileList | null>(null);
  const [rcFile, setRcFile] = useState<FileList | null>(null);
  const [dlFile, setDlFile] = useState<FileList | null>(null);

  const handleNocFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNocFile(event.target.files);
  };

  const handleRcFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRcFile(event.target.files);
  };

  const handleDlFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDlFile(event.target.files);
  };

  return (
    <>
      <Head>
        <title>Bike Details Form</title>
      </Head>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">Bike Details Form</h1>
        <form className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="bikeType" className="block font-medium mb-2">
              Bike Type
            </label>
            <select
              id="bikeType"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue=""
              onChange={(e) => setBikeType(e.target.value)}
            >
              <option value="">Select Bike Type</option>
              <option value="electric">Electric Bike / Scooty</option>
              <option value="scooty">Scooty</option>
              <option value="normal">Normal Bike</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="bikeModel" className="block font-medium mb-2">
              Bike Model
            </label>
            <input
              id="bikeModel"
              type="text"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={bikeModel}
              onChange={(e) => setBikeModel(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="nocFile" className="block font-medium mb-2">
              NOC Document
            </label>
            <input
              id="nocFile"
              type="file"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleNocFileChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rcFile" className="block font-medium mb-2">
              RC Document
            </label>
            <input
              id="rcFile"
              type="file"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={handleRcFileChange}
            />
          </div>
          <div className="flex justify-center">
            <Link
              href="/nextdriverpage"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-600"
            >
              Next
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default BikeDetailsForm;