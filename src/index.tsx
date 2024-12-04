import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, createSystem, defineConfig } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import router from './router';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {},
    },
  },
});

const system = createSystem(config);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
