import React from "react";
import { Box, Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";


export default function PropFormComponent({propMap, propValues, onSave}) {
	console.log(propMap);
	console.log(propValues);
	return (
		<Flex h={'100%'} w={'100%'} p={2} flexDir={'column'}>
			<FormControl
				flexGrow={1}
				overflowY={'auto'}
			>
				{
					Object.keys(propMap).map((key) => {
						return (<Box key={key}>
							<FormLabel>{propMap[key]?.label}</FormLabel>
							{propMap[key]?.inputType === 'input' ? <Input {...propMap[key]?.componentProps} value={propValues[key]} /> : null}
						</Box>);
					})
				}
			</FormControl>
			<Button mt={2} w={'100%'} onClick={onSave}>Save</Button>
		</Flex>
  	);
}