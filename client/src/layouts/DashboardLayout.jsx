import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Flex } from '@chakra-ui/react'
import Navbar from "../components/Navbar/Navbar";

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        console.log(location.pathname)
        if(location.pathname === '/dashboard/' || location.pathname === '/dashboard'){
            navigate("cms")
        }
    }, [location.pathname]);
	return (
    <>
    <Flex id="dashboard_bounding_box" maxH={'100vh'} flexDir={'column'}>
        <Box w="100vw" h={'72px'}>
            <Navbar/>
        </Box>
        <Box h={'calc(100vh - 72px)'}>
            <Outlet />
        </Box>
    </Flex>
    </>
  	);
}