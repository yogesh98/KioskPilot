import React, { useEffect, useState, useCallback } from "react";
import { Box, Flex, Image, Spinner, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import GridLayout from "react-grid-layout";

import 'react-grid-layout/css/styles.css' 
import 'react-resizable/css/styles.css' 

function CueDraggablePiece(props) {
    return (
        <Flex
            w="100%"
            h="100%"
            justifyContent="center"
            alignItems="center"
            borderWidth={useColorModeValue('2px', '')}
            borderRadius="lg"
            boxShadow={useColorModeValue('lg', 'dark-lg')}
            bg={useColorModeValue('gray.100', 'gray.900')}
            direction={'column'}
        >
            <Text fontSize={{ base: '14px', md: '20px', lg: '112x' }}>{props.description}</Text>
            <Text fontSize={{ base: '10px', md: '15px', lg: '100x' }}>{props.title}</Text>
        </Flex>
    );
}

export default function TestComponent() {
    const [loading, setLoading] = useState(true);
    const [layout, setLayout] = useState([]);

    const onLayoutChange = (l) => {
        setLayout(l);
    }

    useEffect(() => {
        setLoading(false)
        window.resizeTo(1080, 1920);
    }, []);

	return (
    <>
        <Box id="layoutContainer">
            <div
                // style={{transform: 'scale(0.5) translate(-50%, -50%)'}}
            >
                <GridLayout
                    cols={20}
                    rowHeight={30}
                    width={1080}
                    layout={layout}
                    onLayoutChange={(layout) => onLayoutChange(layout)}
                    style={{
                        height: '1920px',
                        width: '1080px',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                    }}
                    allowOverlap={true}
                    // transformScale={.5}
                >
                    <Box key={1}>
                        <span>Hello</span>
                    </Box>
                    <Box key={2}>
                        <span>Hello2</span>
                    </Box>
                </GridLayout> 
            </div>
        </Box>
    </>
  	);
}