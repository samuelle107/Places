import { PlaceProvider } from '@/context/place-context';
import '@/styles/globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { AppProps } from 'next/app';
import { type FC } from 'react';
import React from 'react';
import { MapProvider } from 'react-map-gl';

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <MapProvider>
      <PlaceProvider>
        <Component {...pageProps} />
      </PlaceProvider>
    </MapProvider>
  );
};

export default App;
