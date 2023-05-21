import App from "./App";
import Cms from "./containers/Cms";
import { createBrowserRouter } from "react-router-dom";
import MainScreen from "./containers/MainScreen";
import CMSData from "./component/CMSData";

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
            element: <CMSData type={"kiosk"} />,
          },
          {
            path: "modules",
            element: <CMSData type={"modules"} />,
          },
          {
            path: "assign",
            element: <CMSData type={"assign"} />,
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
