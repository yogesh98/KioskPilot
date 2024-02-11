import React from 'react'
import {
  Routes,
  Route,
} from "react-router-dom";

import './App.css'

import BaseLayout from './layouts/BaseLayout';
import RequireAuthLayout from './layouts/RequireAuthLayout';
import { Login } from './views/Login';
import DashboardLayout from './layouts/DashboardLayout';
import ConfigurationEditor from './views/ConfigurationEditor';
import TestComponent from './views/Test';
import ScaledLayout from './views/Test';
import ConfigurationViewer from './views/ConfigurationViewer';

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
