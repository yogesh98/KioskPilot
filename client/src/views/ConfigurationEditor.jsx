import React, { useEffect, useState, useCallback } from "react";
import { Box, Flex, Image, Spinner, Stack, Text, useColorModeValue } from '@chakra-ui/react'

export default function ConfigurationEditor() {
    const widget_common_styles = {
        "borderRadius": '15px',
        "borderColor": useColorModeValue('gray.200', 'whitealpha.300'),
        "borderWidth": 4,
        "bg": useColorModeValue('gray.100', 'gray.900'),
    }
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
        borderRadius={'15px'} 
        minH={'100%'}
    >
        <Stack
            overflowY={'scroll'}
            minWidth={'200px'}
        >
            <Box
                flexGrow={1}
                {...widget_common_styles}
            >
                
            </Box>

            <Box
                flexGrow={1}
                {...widget_common_styles}
            >
                
            </Box>
        </Stack>
        <Box id="layoutContainer">

        </Box>
    </Flex>
    </>
  	);
}