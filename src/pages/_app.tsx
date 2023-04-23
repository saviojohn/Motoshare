import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";


export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
