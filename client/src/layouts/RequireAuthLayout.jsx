import React, { useEffect } from 'react'
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from '@yogeshp98/pocketbase-react';
import LoaderComponent from '../components/Loader/LoaderComponent';

export default function RequireAuthLayout({ redirectTo }) {
    const {isSignedIn} = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        if(isSignedIn !== null && !isSignedIn){
            navigate(redirectTo)
        }
    },[isSignedIn]);
    return isSignedIn ? <Outlet /> : <LoaderComponent />
}