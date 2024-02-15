import React, { useEffect, useState } from "react";
import { Box, Button, Flex, HStack, IconButton, Select, Spinner, Stack, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, DeleteIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { BsFloppy } from "react-icons/bs";
import { useAppContent, useClientContext } from "@yogeshp98/pocketbase-react";
import { useParams } from "react-router-dom";

import componentMap from "../components/Kiosk/ComponentMap";
import TestComponent from "../components/Kiosk/TestComponent/TestComponent";

import RGL, { WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import PropFormComponent from "../components/Common/PropFormComponent";
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
    const [currentPage, setCurrentPage] = useState('');
    const [pages, setPages] = useState([]);
    const [scaleFactor, setScaleFactor] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedComponent, setSelectedComponent] = useState(-1);
    const {records: kiosks} = useAppContent('kiosks', true);
    let draggingFromOutside = null;

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


    const updateLayoutOnPages = (layout, layoutItem) => {
        const index = layout.findIndex(item => item['i'] === layoutItem['i']);
        setSelectedComponent(index);
        let newPages = [...pages];
        newPages[currentPage] = {...newPages[currentPage], "layout": layout}
        setPages(newPages);
    }

    const onDrop = (layout, layoutItem) => {
        let newLayout = pages[currentPage].layout ? [...pages[currentPage].layout] : [];
        const uuid = crypto.randomUUID();
        layoutItem['i'] = draggingFromOutside+'|'+uuid;
        layoutItem['w'] = Math.floor(config.columns/ 10);
        layoutItem['h'] = Math.floor(config.rows / 10);
        draggingFromOutside = null;
        newLayout.push(layoutItem);
        updateLayoutOnPages(newLayout, layoutItem);
    };

    const savePages = () => {
        setLoading(true);
        pbClient.collection('configurations').update(config.id, {"pages": pages}).then((config) => {
            setConfig(config);
            setPages(config.pages);
            setLoading(false);
        })
    }

    const onUpdatePropValues = (i) => (values) => {

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
                                        onDragStart={(e) => draggingFromOutside = componentKey}
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
                                            const [componentName] = component['i'].split('|');
                                            const DyanmicComponent = componentMap[componentName][0];
                                            return <Box key={component['i']} borderWidth={selectedComponent === index ? 2 : 0} h={'100%'} w={'100%'}>
                                                    <DyanmicComponent {...component} scaleFactor={scaleFactor}/>
                                            </Box>
                                        })

                                    }
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
                    <HStack alignItems={'center'} justifyContent={'end'}>
                        <Tooltip label={'Clear Selection'}>
                            <IconButton flexGrow={1} icon={<SmallCloseIcon/>} onClick={() => setSelectedComponent(-1)}/>
                        </Tooltip>
                        <Tooltip label='Bring Forward'>
                            <IconButton flexGrow={1} icon={<ArrowUpIcon/>} />
                        </Tooltip>
                        <Tooltip label={'Push Backward'}>
                            <IconButton flexGrow={1} icon={<ArrowDownIcon/>} />
                        </Tooltip>
                        <Tooltip label={'Delete Component'}>
                            <IconButton flexGrow={1} icon={<DeleteIcon/>} />
                        </Tooltip>
                    </HStack>
                    <Box
                        flexGrow={1}
                        {...widget_common_styles}
                    >
                        {pages?.length >= 0 && pages[currentPage]?.layout && selectedComponent >= 0 ? 
                            <PropFormComponent
                                propMap={componentMap[pages[currentPage]?.layout[selectedComponent]['i'].split('|')[0]][1]}
                                propValues={pages[currentPage].propValues ? pages[currentPage].propValues[pages[currentPage]?.layout[selectedComponent]['i']] : {}}
                                onSave={onUpdatePropValues(componentMap[pages[currentPage]?.layout[selectedComponent]['i']])}
                            />                    
                        : null}
                    </Box>
                    <Flex>
                        <Tooltip label='Save configuration'>
                            <IconButton mr={2} icon={<BsFloppy/>} onClick={savePages} />
                        </Tooltip>
                        <Select id="kiosk_select" flexGrow={1}>
                            {kiosks.map((k) => <option key={k.id} value={k.id} >{k.name} kiosk</option>)}
                        </Select>
                        <Tooltip label='Push to Kiosk'>
                            <IconButton ml={2} icon={<ArrowRightIcon/>} onClick={pushToKiosk} />
                        </Tooltip>
                    </Flex>
                </Stack>
            </Flex>
        </>
    );
}
