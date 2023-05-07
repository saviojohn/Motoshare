// import '@/styles/globals.css'
// import type { AppProps } from 'next/app'
// import "leaflet/dist/leaflet.css";
// import "leaflet/dist/images/marker-icon.png";
// import "leaflet/dist/images/marker-shadow.png";
// import {firebaseConfig} from "@/firebase/firebase.config";
// import { initializeApp } from "firebase/app";

// export default function App({ Component, pageProps }: AppProps) {
//   initializeApp(firebaseConfig);
//   return <Component {...pageProps} />
// }
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import { firebaseConfig } from "@/firebase/firebase.config";
import { initializeApp } from "firebase/app";

// Initialize Firebase app
initializeApp(firebaseConfig);

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
