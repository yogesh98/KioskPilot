import React, { useEffect, useState } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Input, Select, VStack } from "@chakra-ui/react";


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
		<Box p={2}>
			<FormControl
				overflowY={'auto'}
			>
				{
					Object.keys(propMap).map((key) => {
						return (<Box key={key+'|'+componentId}>
							<Box key={'main_question_'+key+'|'+componentId} mb={4}>
								{renderQuestion(propMap, key)}
							</Box>
							{propMap && propMap[key] && propMap[key]['follow_up_questions'] && propValues && propValues[key] && propMap[key]['follow_up_questions'][propValues[key]] ? 
								<Box key={'follow_up_question_'+key+'|'+componentId} mb={4}>
										{Object.keys(propMap[key]['follow_up_questions'][propValues[key]]).map((follow_up_key) => renderQuestion(propMap[key]['follow_up_questions'][propValues[key]], follow_up_key))}	
								</Box> 
							: null}

						</Box>);
					})
				}
			</FormControl>
		</Box>
  	);
}