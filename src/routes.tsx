import App from "./App";
import Cms from "./containers/Cms";
import { createBrowserRouter } from "react-router-dom";
import MainScreen from "./containers/MainScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "cms",
        element: <Cms />,
        children: [
          {
            path: "kiosks",
            element: <div>kiosk</div>,
          },
          {
            path: "modules",
            element: <div>modules</div>,
          },
          {
            path: "assign",
            element: <div>assign</div>,
          },
        ],
      },
      {
        path: "main/:kiosk_id",
        element: <MainScreen />,
      },
    ],
  },
]);
