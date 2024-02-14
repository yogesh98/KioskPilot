import React from 'react'
import {
  Routes,
  Route,
} from "react-router-dom";

import './App.css'

import ScaledLayout from './views/Test';

const BaseLayout = React.lazy(() => import('./layouts/BaseLayout'));
const RequireAuthLayout = React.lazy(() => import('./layouts/RequireAuthLayout'));
const DashboardLayout = React.lazy(() => import('./layouts/DashboardLayout'));
const ConfigurationEditor = React.lazy(() => import('./views/ConfigurationEditor'));
const ConfigurationViewer = React.lazy(() =>  import('./views/ConfigurationViewer'));
const Login = React.lazy(() => import('./views/Login'));
const Signup = React.lazy(() => import('./views/Signup'));
const NotFound = React.lazy(() => import('./views/NotFound'));


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route path="login" element={<Login/>}/>
          <Route path="signup" element={<Signup/>}/>
          <Route path="dashboard/*" element={<RequireAuthLayout redirectTo="/login"/>}>
            <Route path="cms/*" element={<DashboardLayout/>}>
              <Route path=":configurationId" element={<ConfigurationEditor/>}/>
              <Route path="" element={<div/>}/>
            </Route>
          </Route>
          <Route path='kiosk/:kioskId/:pageIndex?' element={<ConfigurationViewer />} />
          <Route path='test' element={<ScaledLayout />}/>
          <Route path="*" element={<NotFound />}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
