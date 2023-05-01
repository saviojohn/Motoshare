import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const UploadDocs = () => {
  const router = useRouter();

  const handleUpload = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // handle the file upload here
    // after the upload is complete, navigate to the new page
    router.push("/driver_success_page");
  };

  return (
    <>
      <Head>
        <title>Upload Documents</title>
      </Head>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">

          <form className="mt-8 space-y-6" onSubmit={handleUpload}>
            <div className="rounded-md shadow-sm">
              <div className="mb-2">
                <label
                  htmlFor="bikeOwnerName"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Bike Owner Name
                </label>
                <input
                  id="bikeOwnerName"
                  type="text"
                  className="appearance-none w-full px-3 py-2 text-gray-700 bg-white border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  // required
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="bikeOwnerAdharCard"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Bike Owner Adhar Card
                </label>
                <input
                  id="bikeOwnerAdharCard"
                  type="file"
                  className="appearance-none w-full px-3 py-2 text-gray-700 bg-white border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  // required
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="currentBikeUser"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Current Bike User
                </label>
                <input
                  id="currentBikeUser"
                  type="text"
                  className="appearance-none w-full px-3 py-2 text-gray-700 bg-white border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  // required
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="currentBikeUserAdharCard"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Current Bike User Adhar Card
                </label>
                <input
                  id="currentBikeUserAdharCard"
                  type="file"
                  className="appearance-none w-full px-3 py-2 text-gray-700 bg-white border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  // required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="currentBikeUserLicence"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Current Bike User Licence
                </label>
                <input
                  id="currentBikeUserLicence"
                  type="file"
                  className="appearance-none w-full px-3 py-2 text-gray-700 bg-white border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  // required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadDocs;
