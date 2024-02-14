import React, {useEffect} from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Box, Flex, useColorModeValue } from '@chakra-ui/react'

export default function BaseLayout() {
	const navigate = useNavigate();
	const location = useLocation();
	useEffect(() => {
		if (location.pathname === "/") {
			navigate("/login");
		}
	});

	return (
		<Flex id="app_container" bg={useColorModeValue('', 'gray.800')} minH='100%'>
				<Outlet />
		</Flex>
  	);
}