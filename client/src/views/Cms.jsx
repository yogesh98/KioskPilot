import React, { useEffect, useState, useCallback } from "react";
import { Box, Flex, Image, Spinner, Stack, useColorModeValue } from '@chakra-ui/react'
import { useAppContent } from "@yogeshp98/pocketbase-react";


export default function Cms() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false)
    }, []);

    if(loading){
        return (
            <>
                <Flex
                    borderRadius={'15px'} 
                    borderColor={useColorModeValue('gray.200', 'whitealpha.300')} 
                    borderWidth={4}
                    bg={useColorModeValue('gray.100', 'gray.900')}
                    h={'100%'}
                    alignItems={'center'} 
                    justifyContent={'center'}
                >
                    <Spinner size={'xl'}/>
                </Flex>
            </>
        )
    }
	return (
    <>
    <Flex 
        h={'100%'}
        borderRadius={'15px'} 
        borderColor={useColorModeValue('gray.200', 'whitealpha.300')} 
        borderWidth={4}
        bg={useColorModeValue('gray.100', 'gray.900')}
    >
        <Stack
            overflowY={'scroll'}
            borderRightWidth={4}
            minWidth={'120px'}
        >
            <Box>
                Drag and Drop box
            </Box>
        </Stack>
        <Box
            p={2}
            flexGrow={1}
        >
            Dashboard box
        </Box>   
    </Flex>
    </>
  	);
}