import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    signInWithEmailAndPassword(getAuth(), email, password)
        .then((userCredential) => {
          // Access the signed-in user
          const user = userCredential.user;

          // Retrieve the user's custom claims (roles)
          return user.getIdTokenResult()
              .then((idTokenResult) => {
                if (idTokenResult.claims.name == 'driver') {
                  // User is a driver
                  router.push('/driver_success');
                } else {
                  // User is not a driver (assume rider)
                  router.push('/nextcustomerpage');
                }
              });
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
        });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-medium mb-4">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            {/* <Link
              href="/forgot-password"
              className="text-gray-600 hover:text-indigo-500"
            >
              Forgot your password?
            </Link> */}
          </div>
          <button
            type="submit"
            className="block w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
