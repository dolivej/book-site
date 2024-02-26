import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/react';
 
function MyApp({ Component, pageProps }) {
  return <>
    <Component {...pageProps} />
    <Analytics />
  </>
}

//forcing dynamic page behavior to get new data from database
export const dynamic = 'force-dynamic';

export default MyApp
