import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { ColorModeProvider } from './components/ui/color-mode';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider>
          <RouterProvider router={router} />
        </ColorModeProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
