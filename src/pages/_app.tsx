import { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import '@/styles/global.css';
import '@fontsource/inter';

import { setup } from 'twind';
import twindConfig from '../twind.config';

if (typeof window !== `undefined`) {
  setup(twindConfig);
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return     <>
      <Component {...pageProps} />
      <Analytics />
    </>;
}
