import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Flex } from '@chakra-ui/react'
import Navbar from "../components/Navbar/Navbar";

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    useEffect(() => {
        console.log(params);
        if(location.pathname === '/dashboard/' || location.pathname === '/dashboard'){
            navigate("cms")
        }
    }, [location.pathname]);
	return (
    <>
    <Flex id="dashboard_bounding_box" maxH={'100vh'} flexDir={'column'}>
        <Box w="100vw" >
            <Navbar/>
        </Box>
    	<Flex flexGrow={1} overflow={'auto'}>
            <Box m={2} flexGrow={1}>
    			<Outlet />
            </Box>
		</Flex>
    </Flex>
    </>
  	);
}