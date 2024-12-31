import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { Routes } from './provider/Route.tsx';
import { Provider } from 'react-redux';
import { store } from './provider/Store.tsx';
// import { ShadCNProvider, createTheme } from '@shadcn/ui';
import { Toaster } from 'sonner'; // Toast notification system

import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-cyan/theme.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <ShadCNProvider>  */}
      <PrimeReactProvider>
        <Provider store={store}>
          <Toaster position="top-right" closeButton />
          <RouterProvider router={Routes} />
        </Provider>
      </PrimeReactProvider>
    {/* </ShadCNProvider> */}
  </React.StrictMode>
);
