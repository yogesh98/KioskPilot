import React, { useEffect, useState } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";


export default function PropFormComponent({componentId, propMap, propValues, onUpdatePropValues}) {

	const renderQuestion = (propMap, key) => {
		return (<>
				<FormLabel>{propMap[key]?.label}</FormLabel>
				{propMap[key]?.inputType === 'input' ? <Input {...propMap[key]?.componentProps} value={propValues && propValues[key]? propValues[key] : ''} onChange={(e) => onUpdatePropValues(key, e.target.value) } /> : null}
				{propMap[key]?.inputType === 'select' ? 
					<Select 
						{...propMap[key]?.componentProps} 
						value={propValues && propValues[key]? propValues[key] : ''}
						onChange={(e) => onUpdatePropValues(key, e.target.value)}
					>
						{Object.keys(propMap[key]?.options ?? {}).map((val, index) => <option key={val} value={val} >{propMap[key].options[val]}</option>)}
					</Select>
				: null}
		</>);
	}

	return (
		<Flex h={'100%'} w={'100%'} p={2} flexDir={'column'}>
			<FormControl
				flexGrow={1}
				overflowY={'auto'}
			>
				{
					Object.keys(propMap).map((key) => {
						return (<Box key={key+'|'+componentId}>
							<Box key={'main_question_'+key+'|'+componentId} mb={4}>
								{renderQuestion(propMap, key)}
							</Box>
							<Box key={'follow_up_question_'+key+'|'+componentId} mb={4}>
								{propMap && propMap[key] && propMap[key]['follow_up_questions'] && propValues && propValues[key] && propMap[key]['follow_up_questions'][propValues[key]] ? 
									Object.keys(propMap[key]['follow_up_questions'][propValues[key]]).map((follow_up_key) => renderQuestion(propMap[key]['follow_up_questions'][propValues[key]], follow_up_key))	
								: null}
							</Box>
						</Box>);
					})
				}
			</FormControl>
		</Flex>
  	);
}