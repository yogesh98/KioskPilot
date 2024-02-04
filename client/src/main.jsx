import React, {Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
} from "react-router-dom";
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import App from './App.jsx'
import './index.css'
import theme from './styles/theme.js';
import { Pocketbase } from '@yogeshp98/pocketbase-react';
import LoaderComponent from "./components/Loader/LoaderComponent";
 

const serverURL = import.meta.env.VITE_POCKET_BASE_SERVER_URL

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<LoaderComponent />}>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <Pocketbase
              serverURL={serverURL}
            >
              <App />
            </Pocketbase>
        </ChakraProvider>
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>,
)