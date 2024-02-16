import React, { useEffect, useState } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";


export default function PropFormComponent({componentId, propMap, propValues, onUpdatePropValues}) {
	return (
		<Flex h={'100%'} w={'100%'} p={2} flexDir={'column'}>
			<FormControl
				flexGrow={1}
				overflowY={'auto'}
			>
				{
					Object.keys(propMap).map((key) => {
						return (<Box key={key+'|'+componentId}>
							<FormLabel>{propMap[key]?.label}</FormLabel>
							{propMap[key]?.inputType === 'input' ? <Input {...propMap[key]?.componentProps} value={propValues && propValues[key]? propValues[key] : ''} onChange={(e) => onUpdatePropValues(key, e.target.value) } /> : null}
						</Box>);
					})
				}
			</FormControl>
		</Flex>
  	);
}