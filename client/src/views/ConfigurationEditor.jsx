import React, { useEffect, useState, useCallback } from "react";
import { Box, Flex, Image, Modal, ModalContent, ModalOverlay, Spinner, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { useClientContext } from "@yogeshp98/pocketbase-react";
import { useParams } from "react-router-dom";

import RGL, { WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
const ReactGridLayout = WidthProvider(RGL);

export default function ConfigurationEditor() {
    const widget_common_styles = {
        borderRadius: '15px',
        borderColor: useColorModeValue('gray.200', 'whiteAlpha.300'),
        borderWidth: 2,
        bg: useColorModeValue('gray.100', 'gray.900'),
    };
    
    const pbClient = useClientContext();
    const params = useParams();
    const [config, setConfig] = useState({});
    const [currentPage, setCurrentPage] = useState({});
    const [pages, setPages] = useState(null);
    const [scaleFactor, setScaleFactor] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        pbClient.collection('configurations').getOne(params.configurationId).then((config) => {
            const layoutContainer = document.getElementById('layoutContainer');
            if (layoutContainer && config.height && config.width) {
                let containerRect = layoutContainer.getBoundingClientRect();
                const containerAspectRatio = containerRect.width / containerRect.height;
                const configAspectRatio = config.width / config.height;

                let scaleFactor;
                if (configAspectRatio > containerAspectRatio) {
                    scaleFactor = containerRect.width / config.width;
                } else {
                    scaleFactor = containerRect.height / config.height;
                }
                console.log(scaleFactor);
                const adjustedScaleFactor = Math.floor(scaleFactor / 10) * 10
                console.log(adjustedScaleFactor);
                setScaleFactor(adjustedScaleFactor);
                setConfig(config);
                setPages(config.pages);
            }
            setLoading(false);
        });
    }, [pbClient, params.configurationId]);

    const adjustedWidth = config.width ? config.width * scaleFactor : "auto";
    const adjustedHeight = config.height ? config.height * scaleFactor : "auto";

    return (
        <>
            <Flex
                id="configurationEditorBoundingBox"
                borderRadius={'15px'}
                flexGrow={1}
            >
                <Stack
                    overflowY={'auto'}
                    overflowX={'hidden'}
                    minW={'300px'}
                    maxW={'300px'}
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
                <Flex id="layoutContainer" flexGrow={1} alignItems={'center'} justifyContent={'center'}>
                    <Box id="scaledContainer" w={adjustedWidth} h={adjustedHeight}>
                        {!loading ? 
                            <Box id="LayoutBox" borderWidth={2} w={adjustedWidth} h={adjustedHeight}>
                                {/* <Box>
                                    This should be a scaled box
                                </Box> */}
                                {console.log(config)}
                                <ReactGridLayout
                                    className="layout"
                                    pad
                                    width={adjustedWidth}
                                    height={adjustedHeight}
                                    layout={currentPage?.layout}
                                    onLayoutChange={(l) => setCurrentPage({...currentPage, "layout": l})}
                                    compactType={null}
                                    cols={config.columns}
                                    rows={config.rows}
                                    maxRows={config.rows}
                                    rowHeight={10 * scaleFactor}
                                    containerPadding={[0,0]}
                                    margin={[0,0]}
                                >
                                    <Box key={1} borderWidth={2}>
                                        <span className="text">{1}</span>
                                    </Box>
                                    <Box key={2} borderWidth={2}>
                                        <span className="text">{2}</span>
                                    </Box>
                                </ReactGridLayout>
                            </Box> 
                            : <Spinner size={'xl'}/>}
                    </Box>
                </Flex>
                <Stack
                    overflowY={'auto'}
                    overflowX={'hidden'}
                    minW={'300px'}
                    maxW={'300px'}
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
            </Flex>
            {/* <Modal isOpen={loading} isCentered>
                <ModalOverlay/>
                <ModalContent
                    alignItems={'center'} 
                    justifyContent={'center'}
                    minH={'200px'}
                >
                    <Spinner size={'xl'}/>
                </ModalContent>
            </Modal> */}
        </>
    );
}
