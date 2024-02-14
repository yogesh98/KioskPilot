import React, { useEffect, useState } from "react";
import { Box, Button, Flex, IconButton, Select, Spinner, Stack, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { ArrowRightIcon } from "@chakra-ui/icons";
import { useAppContent, useClientContext } from "@yogeshp98/pocketbase-react";
import { useParams } from "react-router-dom";

import componentMap from "../components/Kiosk/ComponentMap";
import TestComponent from "../components/Kiosk/Components/TestComponent";

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
    const DynamicComponent = componentMap['Test'];
    const pbClient = useClientContext();
    const params = useParams();
    const [config, setConfig] = useState({});
    const [currentPage, setCurrentPage] = useState('');
    const [pages, setPages] = useState([]);
    const [scaleFactor, setScaleFactor] = useState(1);
    const [loading, setLoading] = useState(true);
    const {records: kiosks} = useAppContent('kiosks', true);
    let dragging = null;

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
                let adjustedScaleFactor = scaleFactor;
                if(scaleFactor > 1){
                    adjustedScaleFactor = Math.floor(scaleFactor / 10) * 10
                } else {
                    adjustedScaleFactor = Math.floor(scaleFactor * 10) / 10
                }
                setScaleFactor(adjustedScaleFactor);
                setConfig(config);
                setPages(config.pages);
            }
            setLoading(false);
        });
    }, [pbClient, params.configurationId]);


    const updateLayoutOnPages = (layout) => {
        console.log(layout);
        let newPages = [...pages];
        newPages[currentPage] = {...newPages[currentPage], "layout": layout}
        setPages(newPages);
    }

    const onDrop = (layout, layoutItem, _event) => {
        let newLayout = pages[currentPage].layout ? [...pages[currentPage].layout] : [];
        layoutItem['i'] = dragging+'_'+newLayout.length;
        dragging = null;
        newLayout.push(layoutItem);
        updateLayoutOnPages(newLayout);
    };

    const savePages = () => {
        setLoading(true);
        pbClient.collection('configurations').update(config.id, {"pages": pages}).then((config) => {
            setConfig(config);
            setPages(config.pages);
            setLoading(false);
        })
    }

    const pushToKiosk = () => {
        setLoading(true);
        const kioskId = document.getElementById('kiosk_select').value;
        const configId = config.id;
        pbClient.collection('kiosks').update(kioskId, {"configuration": configId}).then(() => setLoading(false))
    }

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
                    p={2}
                >
                    <Select 
                        placeholder="Select a Page"
                        value={currentPage}
                        onChange={(e) => setCurrentPage(e.target.value)}
                        {...widget_common_styles}
                    >
                        {
                            pages.map((item, index) => {
                                return <option key={index} value={index} >{item.name} page</option>
                            })
                        }
                    </Select>
                    <Box
                        flexGrow={1}
                        {...widget_common_styles}
                    >
                        {
                            Object.keys(componentMap).map((componentKey) => {
                                return (
                                    <div
                                        key={componentKey}
                                        className="droppable-element"
                                        draggable={true}
                                        onDragStart={(e) => dragging = componentKey}
                                        unselectable="on"
                                    >
                                        {componentKey}
                                    </div>
                                );
                            })
                        }
                    </Box>
                </Stack>                
                <Flex id="layoutContainer" flexGrow={1} alignItems={'center'} justifyContent={'center'}>
                    <Box id="scaledContainer" w={adjustedWidth} h={adjustedHeight}>
                        {!loading ? 
                            <Box id="LayoutBox" borderWidth={2} w={adjustedWidth} h={adjustedHeight}>
                                {currentPage != '' && currentPage >= 0 ? <ReactGridLayout
                                    className="layout"
                                    autoSize={false}
                                    width={adjustedWidth}
                                    height={adjustedHeight}
                                    layout={pages[currentPage]?.layout}
                                    onDragStop={updateLayoutOnPages}
                                    onResizeStop={updateLayoutOnPages}
                                    onDrop={onDrop}
                                    compactType={null}
                                    cols={config.columns}
                                    rows={config.rows}
                                    maxRows={config.rows}
                                    rowHeight={10 * scaleFactor}
                                    containerPadding={[0,0]}
                                    margin={[0,0]}
                                    allowOverlap={true}
                                    isDroppable={true}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                    }}
                                >
                                    {
                                        pages[currentPage]?.layout?.map((component, index) => {
                                            const componentName = component['i'].replace('_'+index, '');
                                            const DyanmicComponent = componentMap[componentName];
                                            return <Box key={component['i']}>
                                                    <DyanmicComponent {...component} scaleFactor={scaleFactor}/>
                                            </Box>
                                        })

                                    }
                                    {/* <Box key={1} borderWidth={2}>
                                        <Flex
                                                id="container_flex"
                                                h={'100%'}
                                                w={'100%'}
                                                alignItems={'center'}
                                                justifyContent={'center'}
                                            >
                                            <div  style={{transform: 'scale('+scaleFactor+') translate(0%, '+scaleFactorAsPercentage+'%)'}}> 
                                                <span className="text">{1}</span>
                                            </div>
                                        </Flex>
                                    </Box>
                                    <Box key={2} borderWidth={2}>
                                        <span className="text">{2}</span>
                                    </Box> */}
                                </ReactGridLayout> : <Box>Choose a page to begin</Box>}
                            </Box> 
                            : <Spinner size={'xl'}/>}
                    </Box>
                </Flex>
                <Stack
                    overflowY={'auto'}
                    overflowX={'hidden'}
                    minW={'300px'}
                    maxW={'300px'}
                    p={2}
                >
                    <Box
                        h={'50%'}
                        {...widget_common_styles}
                    >
                        
                    </Box>

                    <Box
                        h={'50%'}
                        {...widget_common_styles}
                    >
                        
                    </Box>
                    <Button onClick={savePages}>Save</Button>
                    <Flex>
                        <Select id="kiosk_select" flexGrow={1}>
                            {kiosks.map((k) => <option key={k.id} value={k.id} >{k.name} kiosk</option>)}
                        </Select>
                        <Tooltip label='Push to Kiosk'>
                            <IconButton ml={2} icon={<ArrowRightIcon/>} onClick={pushToKiosk} />
                        </Tooltip>
                    </Flex>
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
