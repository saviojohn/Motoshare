import Head from "next/head";

const Customer = () => {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Head>
          <title>Customer</title>
        </Head>
        <h1 className="text-3xl font-bold mb-8">Customer</h1>
        <p>You have selected the customer user type.</p>
      </div>
    );
  };
  
  export default Customer;
  