import React, { useRef, useState } from "react";
import { Box, Button, Flex, HStack, IconButton, Input, Text, VStack } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

export default function FileUploadComponent({ files, saveFiles }) {
    const fileUploadRef = useRef();

    const onFileChange = (event) => {
        let newFiles = [...files, ...event.target.files];
        saveFiles(newFiles);
    }
    const onDeleteFile = (index) => {
        let newFiles = [...files];
        newFiles.splice(index, 1);
        saveFiles(newFiles);
    }

    return (<>
        <Flex h={'100%'} w={'100%'} minH={'200px'} flexDir={'column'} overflowY={'auto'}>
            <Box maxW={'100%'} mb={2}>
                <input id="file_upload_input" type="file" ref={fileUploadRef} onChange={onFileChange} style={{ display: 'none', overflowX: 'hidden' }} />
                {fileUploadRef.current ? <Button color="primary" onClick={() => fileUploadRef.current.click()}>
                    Upload
                </Button> : null}
            </Box>
            <VStack overflowX={"hidden"}>
                {files ?
                    files.map((file, index) => {
                        return (
                            <HStack key={file} maxW={"100%"}>
                                <Text overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={"nowrap"}>
                                    {file}
                                </Text>
                                <IconButton colorScheme="red" variant={'ghost'} icon={<DeleteIcon />} onClick={() => onDeleteFile(index)} />
                            </HStack>
                        );
                    })


                    : null}
            </VStack>
        </Flex >
    </>);
}