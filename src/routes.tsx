import App from "./App";
import Cms from "./containers/Cms"
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
      {
        path: "cms",
        element: <Cms />,
        children:[
          {
            path:"kiosks",
            element: <div>kiosk</div>,
          },
          {
            path:"modules",
            element: <div>modules</div>,
          },
          {
            path:"assign",
            element: <div>assign</div>,
          }
        ]
      },
    ]
  },

]);
