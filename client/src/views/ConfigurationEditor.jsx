import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Flex, HStack, IconButton, Input, InputGroup, InputRightElement, Select, Spinner, Stack, Tooltip, VStack, useColorModeValue } from '@chakra-ui/react';
import { AddIcon, ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, DeleteIcon, ExternalLinkIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { BsFloppy } from "react-icons/bs";
import { useAppContent, useClientContext } from "@yogeshp98/pocketbase-react";
import { useParams } from "react-router-dom";

import componentMap from "../components/Kiosk/ComponentMap";

import RGL, { WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import PropFormComponent from "../components/Common/PropFormComponent";
import FileUploadComponent from "../components/Common/FileUploadComponent";
const ReactGridLayout = WidthProvider(RGL);

export default function ConfigurationEditor() {
    const widget_common_styles = {
        borderRadius: 'md',
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
    const [previewLoading, setPreviewLoading] = useState(true);
    const [selectedComponent, setSelectedComponent] = useState(-1);
    const { records: kiosks } = useAppContent('kiosks', true);
    let draggingFromOutside = null;
    let timeout = null;

    const refreshConfig = useCallback(() => {
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
                adjustedScaleFactor = Math.floor(scaleFactor * 100) / 100
                setScaleFactor(adjustedScaleFactor);
                setConfig(config);
                setPages(config.pages);
            }
            setLoading(false);
        });
    })

    useEffect(() => {
        setLoading(true);
        refreshConfig();
    }, [pbClient, params.configurationId]);

    useEffect(() => {
        setPreviewLoading(true);
        if (config['id']) {
            let previewConfig = { ...config };
            delete (previewConfig['id']);
            delete (previewConfig['collectionId']);
            delete (previewConfig['collectionName']);
            previewConfig['id'] = '_preview_config';
            previewConfig['pages'] = pages;
            previewConfig['files'] = [];
            pbClient.collection('configurations').update('_preview_config', previewConfig).then(() => {
                if (timeout) clearTimeout(timeout);
                timeout = setTimeout(() => setPreviewLoading(false), 250);
            })
        }
    }, [config, pages]);

    const createNewPage = () => {
        let val = document.getElementById('new_page_input').value;
        if (val) {
            let newPages = [...pages, { 'name': val }];
            setPages(newPages);
            setCurrentPage(newPages.length - 1);
        }
        document.getElementById('new_page_input').value = '';
    }

    const onDeletePage = () => {
        let newPages = [...pages];
        newPages.splice(currentPage, 1);
        setCurrentPage(-1);
        setPages(newPages);
    }

    const updateLayoutOnPages = (layout, layoutItem = null) => {
        if (layoutItem) {
            const index = layout.findIndex(item => item['i'] === layoutItem['i']);
            setSelectedComponent(index);
        }
        let newPages = [...pages];
        newPages[currentPage] = { ...newPages[currentPage], "layout": layout }
        setPages(newPages);
    }

    const onDrop = (layout, layoutItem) => {
        let newLayout = pages[currentPage].layout ? [...pages[currentPage].layout] : [];
        const uuid = crypto.randomUUID();
        layoutItem['i'] = draggingFromOutside + '|' + uuid;
        layoutItem['w'] = Math.floor(config.columns > 10 ? config.columns / 10 : 1);
        layoutItem['h'] = Math.floor(config.rows > 10 ? config.rows / 10 : 1);
        draggingFromOutside = null;
        newLayout.push(layoutItem);
        updateLayoutOnPages(newLayout, layoutItem);
    };

    const savePages = () => {
        setLoading(true);
        pbClient.collection('configurations').update(config.id, { "pages": pages }).then((config) => {
            setConfig(config);
            setPages(config.pages);
            setLoading(false);
        })
    }

    const saveFiles = (files) => {
        setLoading(true);
        pbClient.collection('configurations').update(config.id, { "files": files }).then((config) => {
            setConfig(config);
            setLoading(false);
        })
    }

    const onUpdatePropValues = (i) => (key, value) => {
        let newPages = [...pages];
        newPages[currentPage]['propValues'] = { ...newPages[currentPage]['propValues'] };
        newPages[currentPage]['propValues'][i] = { ...newPages[currentPage]['propValues'][i] }
        newPages[currentPage]['propValues'][i][key] = value;
        setPages(newPages);
    }

    const pushToKiosk = () => {
        setLoading(true);
        const kioskId = document.getElementById('kiosk_select').value;
        const configId = config.id;
        pbClient.collection('kiosks').update(kioskId, { "configuration": configId }).then(() => setLoading(false))
    }

    const onDeleteComponent = () => {
        let newPages = [...pages];
        try {
            delete newPages[currentPage]['propValues'][pages[currentPage].layout[selectedComponent]['i']]
        } catch (e) {
        }
        newPages[currentPage].layout.splice(selectedComponent, 1);
        setSelectedComponent(-1);
        setPages(newPages);
    }

    const bringFoward = () => {
        let newLayout = pages[currentPage].layout ? [...pages[currentPage].layout] : [];
        if (selectedComponent >= 0 && selectedComponent < newLayout.length - 1) {
            [newLayout[selectedComponent], newLayout[selectedComponent + 1]] = [newLayout[selectedComponent + 1], newLayout[selectedComponent]];
            setSelectedComponent(selectedComponent + 1);
        }
        updateLayoutOnPages(newLayout);
    }

    const pushBackward = () => {
        let newLayout = pages[currentPage].layout ? [...pages[currentPage].layout] : [];
        if (selectedComponent > 0 && selectedComponent < newLayout.length) {
            [newLayout[selectedComponent], newLayout[selectedComponent - 1]] = [newLayout[selectedComponent - 1], newLayout[selectedComponent]];
            setSelectedComponent(selectedComponent - 1);
        }
        updateLayoutOnPages(newLayout);
    }

    const adjustedWidth = config.width ? config.width * scaleFactor : "auto";
    const adjustedHeight = config.height ? config.height * scaleFactor : "auto";
    return (
        <>
            <Flex
                id="configurationEditorBoundingBox"
                borderRadius={'15px'}
                h={'100%'}
                overflow={'hidden'}
            >
                <Stack
                    minW={'300px'}
                    maxW={'300px'}
                    p={2}
                >
                    <HStack
                        {...widget_common_styles}
                    >
                        <Input
                            id="new_page_input"
                            placeholder="New Page Name"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') createNewPage();
                            }}
                            variant={'unstyled'}
                            mx={2}
                        />
                        <IconButton variant={'ghost'} colorScheme="blue" icon={<AddIcon />} onClick={createNewPage} />
                    </HStack>
                    <HStack
                        {...widget_common_styles}
                    >
                        <Tooltip label={'Delete Page'}>
                            <IconButton colorScheme="red" variant={'ghost'} icon={<DeleteIcon />} isDisabled={currentPage <= 0} onClick={onDeletePage} />
                        </Tooltip>
                        <Select
                            placeholder="Select a Page"
                            value={currentPage}
                            onChange={(e) => setCurrentPage(e.target.value)}
                            variant={'unstyled'}
                        >
                            {
                                pages.map((item, index) => {
                                    return <option key={index} value={index} >{item.name}</option>
                                })
                            }
                        </Select>
                    </HStack>
                    <Flex
                        flexGrow={1}
                        overflowY={'auto'}
                        overflowX={'hidden'}
                        justifyContent={'space-between'}
                        flexWrap={'wrap'}
                        {...widget_common_styles}
                    >
                        {
                            Object.keys(componentMap).map((componentKey) => {
                                return (<Box key={componentKey} h={'25%'} w={'40%'} borderRadius={'md'} borderWidth={2} m={2} bgColor={useColorModeValue('gray.300', 'gray.700')}
                                >
                                    <div
                                        className="droppable-element"
                                        draggable={true}
                                        onDragStart={(e) => draggingFromOutside = componentKey}
                                        unselectable="on"
                                        style={{ height: '100%' }}
                                    >
                                        <Flex
                                            h={'100%'}
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                        >
                                            {componentKey}
                                        </Flex>
                                    </div>
                                </Box>
                                );
                            })
                        }
                    </Flex>
                    <Button
                        isDisabled={previewLoading}
                        leftIcon={previewLoading ? <Spinner size={'sm'} /> : <ExternalLinkIcon />}
                        onClick={() => window.open('/kiosk/_preview_kiosk_/', '_blank').focus()}
                    >
                        Open Preview
                    </Button>
                </Stack>
                <Flex id="layoutContainer" flexGrow={1} alignItems={'center'} justifyContent={'center'}>
                    <Box id="scaledContainer" w={adjustedWidth} h={adjustedHeight}>
                        {!loading ?
                            <Box id="LayoutBox" key={currentPage} outline={'2px solid #ffffff29'} w={adjustedWidth} h={adjustedHeight} {...widget_common_styles} borderWidth={0}>
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
                                    containerPadding={[0, 0]}
                                    margin={[0, 0]}
                                    allowOverlap={true}
                                    isDroppable={true}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                    }}
                                >
                                    {
                                        pages && pages[currentPage]?.layout?.map((component, index) => {
                                            const [componentName] = component['i'].split('|');
                                            const DyanmicComponent = componentMap[componentName][0];
                                            const props = pages[currentPage]?.propValues && pages[currentPage]?.propValues[component['i']] ? pages[currentPage]?.propValues[component['i']] : null;
                                            return <Box key={component['i']} outline={selectedComponent === index ? '2px solid #ffffff29' : ''} h={'100%'} w={'100%'}>
                                                <DyanmicComponent {...component} pages={pages.map(v => v.name)} scaleFactor={scaleFactor} {...props} />
                                            </Box>
                                        })
                                    }
                                </ReactGridLayout> : <Flex h={'100%'} w={'100%'} alignItems={'center'} justifyContent={'center'}>Choose a page to begin</Flex>}
                            </Box>
                            : <Spinner size={'xl'} />}
                    </Box>
                </Flex>
                <VStack
                    minW={'300px'}
                    maxW={'300px'}
                    h={'100%'}
                    align={'stretch'}
                    p={2}
                >
                    <HStack alignItems={'center'} justifyContent={'end'}>
                        <Tooltip label={'Clear Selection'}>
                            <IconButton flexGrow={1} colorScheme="orange" variant={'outline'} icon={<SmallCloseIcon />} isDisabled={selectedComponent < 0} onClick={() => setSelectedComponent(-1)} />
                        </Tooltip>
                        <Tooltip label='Bring Forward'>
                            <IconButton flexGrow={1} colorScheme="blue" variant={'outline'} icon={<ArrowUpIcon />} isDisabled={selectedComponent < 0} onClick={bringFoward} />
                        </Tooltip>
                        <Tooltip label={'Push Backward'}>
                            <IconButton flexGrow={1} colorScheme="blue" variant={'outline'} icon={<ArrowDownIcon />} isDisabled={selectedComponent < 0} onClick={pushBackward} />
                        </Tooltip>
                        <Tooltip label={'Delete Component'}>
                            <IconButton flexGrow={1} colorScheme="red" icon={<DeleteIcon />} isDisabled={selectedComponent < 0} onClick={onDeleteComponent} />
                        </Tooltip>
                    </HStack>
                    <Box
                        flexGrow={1}
                        overflowY={'auto'}
                        p={2}
                        maxH={"calc(45% - 1rem)"}
                        minH={"calc(45% - 1rem)"}
                        {...widget_common_styles}
                    >
                        {pages?.length >= 0 && pages[currentPage]?.layout && selectedComponent >= 0 ?
                            <PropFormComponent
                                config={config}
                                currentPage={pages[currentPage]?.name}
                                componentId={pages[currentPage]?.layout[selectedComponent]?.['i']}
                                propMap={componentMap[pages[currentPage]?.layout[selectedComponent]?.['i'].split('|')[0]][1]}
                                propValues={pages[currentPage]?.propValues ? pages[currentPage].propValues[pages[currentPage]?.layout[selectedComponent]?.['i']] : {}}
                                onUpdatePropValues={onUpdatePropValues(pages[currentPage]?.layout[selectedComponent]?.['i'])}
                            />
                            : <Flex h={'100%'} w={'100%'} alignItems={'center'} justifyContent={'center'}>No component selected</Flex>}
                    </Box>
                    <Box
                        flexGrow={1}
                        overflowY={'auto'}
                        p={2}
                        {...widget_common_styles}
                        maxH={"calc(45% - 1rem)"}
                    >
                        <FileUploadComponent files={config.files} saveFiles={saveFiles} />
                    </Box>
                    <Flex>
                        <Tooltip label='Save configuration'>
                            <IconButton mr={2} colorScheme={'blue'} variant={'outline'} icon={<BsFloppy />} onClick={savePages} />
                        </Tooltip>
                        <Select id="kiosk_select" flexGrow={1}>
                            {kiosks?.map((k) => <option key={k.id} value={k.id} >{k.name} kiosk</option>)}
                        </Select>
                        <Tooltip label='Push to Kiosk'>
                            <IconButton ml={2} colorScheme={'blue'} icon={<ArrowRightIcon />} onClick={pushToKiosk} />
                        </Tooltip>
                    </Flex>
                </VStack>
            </Flex>
        </>
    );
}
