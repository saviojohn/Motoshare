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
          <div>
            <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
              Upload Documents
            </h1>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleUpload}>
            <div className="rounded-md shadow-sm">
              <div className="mb-2">
                <label
                  htmlFor="driverLicence"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Driving Licence
                </label>
                <input
                  id="driverLicence"
                  type="file"
                  className="appearance-none w-full px-3 py-2 text-gray-700 bg-white border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  required
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="noc"
                  className="block text-gray-700 font-bold mb-2"
                >
                  NOC (No Objection Certificate)
                </label>
                <input
                  id="noc"
                  type="file"
                  className="appearance-none w-full px-3 py-2 text-gray-700 bg-white border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="rc"
                  className="block text-gray-700 font-bold mb-2"
                >
                  RC (Registration Certificate)
                </label>
                <input
                  id="rc"
                  type="file"
                  className="appearance-none w-full px-3 py-2 text-gray-700 bg-white border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadDocs;
