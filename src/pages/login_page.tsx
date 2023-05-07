import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  function submitData(e: { preventDefault: () => void }) {
    e.preventDefault();
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.alert("Login successful");
        router.push("/nextcustomerpage");
      })
      .catch((error) => {
        console.error(error);
        window.alert("Invalid email or password");
      });
  }

  return (
    <>
      <Head>
        <title>Login Form</title>
      </Head>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">Login Form</h1>
        <form className="max-w-md mx-auto" onSubmit={submitData}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="flex justify-center bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue active:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
