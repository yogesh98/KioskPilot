import React, { useEffect, useState, useCallback } from "react";
import { Box, Flex, Image, Modal, ModalContent, ModalOverlay, Spinner, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { useClientContext } from "@yogeshp98/pocketbase-react";
import { useParams } from "react-router-dom";

// export default function ConfigurationEditor() {
//     const widget_common_styles = {
//         "borderRadius": '15px',
//         "borderColor": useColorModeValue('gray.200', 'whitealpha.300'),
//         "borderWidth": 4,
//         "bg": useColorModeValue('gray.100', 'gray.900'),
//     }
//     const pbClient = useClientContext();
//     const params = useParams();
//     const [config, setConfig] = useState({});
//     const [scaleFactor, setScaleFactor] = useState(1);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         setLoading(true);
//         pbClient.collection('configurations').getOne(params.configurationId).then((config) => {
//             console.log(config);
//             const layoutContainer = document.getElementById('layoutContainer');
//             if (layoutContainer && config.height && config.width) {
//                 // const containerRect = layoutContainer.getBoundingClientRect();
//                 // console.log(containerRect);
//                 // const widthScale = containerRect.width / config.width;
//                 // const heightScale = containerRect.height / config.height;
//                 // const scaleFactor = Math.min(widthScale, heightScale);
//                 // const adjustedScaleFactor = Math.floor(scaleFactor * 100) / 100
//                 // setScaleFactor(adjustedScaleFactor);
//                 // setConfig(config);

//                 let containerRect = layoutContainer.getBoundingClientRect();
//                 const containerAspectRatio = containerRect.width / containerRect.height;
//                 const configAspectRatio = config.width / config.height;
//                 // console.log("Container", containerRect.width, containerRect.height);
//                 // console.log("containerAspectRatio", containerAspectRatio);
//                 // console.log("configAspectRatio", configAspectRatio);

//                 let scaleFactor;
//                 if (configAspectRatio > containerAspectRatio) {
//                     scaleFactor = containerRect.width / config.width;
//                 } else {
//                     scaleFactor = containerRect.height / config.height;
//                 }
    
//                 setScaleFactor(scaleFactor > 1 ? 1 : scaleFactor);
//                 setConfig(config);
//             }
//             setLoading(false);
//         })
//     }, [pbClient, params.configurationId]);

// 	return (
//     <>
//     <Flex 
//         id="configurationEditorBoundingBox"
//         borderRadius={'15px'}
//         flexGrow={1}
//     >
//         <Stack
//             overflowY={'scroll'}
//             minWidth={'300px'}
//             maxWidth={'300px'}
//         >
//             <Box
//                 flexGrow={1}
//                 {...widget_common_styles}
//             >
                
//             </Box>

//             <Box
//                 flexGrow={1}
//                 {...widget_common_styles}
//             >
                
//             </Box>
//         </Stack>
//         <Flex id="layoutContainer" flexGrow={1} alignItems={'center'} justifyContent={'center'}>
//             <Box id="scaledContainer" style={{transform: "scale("+scaleFactor+")"}}>
//                 {!loading ? <Box id="LayoutBox" borderWidth={2} h={config?.height} w={config?.width}>
//                     <Box>
//                         Should be Scaled box in center
//                     </Box>
//                 </Box> : <Box borderWidth={2}>Testing Box</Box> }
//             </Box>
//         </Flex>
//         <Stack
//             overflowY={'scroll'}
//             minWidth={'300px'}
//             maxWidth={'300px'}
//         >
//             <Box
//                 flexGrow={1}
//                 {...widget_common_styles}
//             >
                
//             </Box>

//             <Box
//                 flexGrow={1}
//                 {...widget_common_styles}
//             >
                
//             </Box>
//         </Stack>
//     </Flex>
//     {/* <Modal isOpen={!loading} isCentered>
//         <ModalOverlay/>
//         <ModalContent
//             alignItems={'center'} 
//             justifyContent={'center'}
//             minH={'200px'}
//         >
//             <Spinner size={'xl'}/>
//         </ModalContent>
//     </Modal> */}
//     </>
//   	);
// }


export default function ConfigurationEditor() {
    const widget_common_styles = {
        borderRadius: '15px',
        borderColor: useColorModeValue('gray.200', 'whiteAlpha.300'),
        borderWidth: 4,
        bg: useColorModeValue('gray.100', 'gray.900'),
    };
    
    const pbClient = useClientContext();
    const params = useParams();
    const [config, setConfig] = useState({});
    const [scaleFactor, setScaleFactor] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        pbClient.collection('configurations').getOne(params.configurationId).then((config) => {
            console.log(config);
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

                setScaleFactor(scaleFactor);
                setConfig(config);
            }
            setLoading(false);
        });
    }, [pbClient, params.configurationId]);

    // Dynamically adjust the size of the layout box
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
                    overflowY={'scroll'}
                    minWidth={'300px'}
                    maxWidth={'300px'}
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
                                <Box>
                                    Should be Scaled box in center
                                </Box>
                            </Box> 
                            : <Box borderWidth={2}>Testing Box</Box>}
                    </Box>
                </Flex>
                <Stack
                    overflowY={'scroll'}
                    minWidth={'300px'}
                    maxWidth={'300px'}
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
            <Modal isOpen={loading} isCentered>
                <ModalOverlay/>
                <ModalContent
                    alignItems={'center'} 
                    justifyContent={'center'}
                    minH={'200px'}
                >
                    <Spinner size={'xl'}/>
                </ModalContent>
            </Modal>
        </>
    );
}
