import React, { useEffect, useState } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Input, Select, VStack } from "@chakra-ui/react";


export default function PropFormComponent({ config, pages, componentId, propMap, propValues, onUpdatePropValues, currentPage }) {

	const renderQuestion = (propMap, key) => {
		return (<>
			<FormLabel>{propMap[key]?.label}</FormLabel>
			{propMap[key]?.inputType === 'input' ? 
				<Input 
					key={'input_' + key}
					{...propMap[key]?.componentProps} 
					value={propValues && propValues[key] ? propValues[key] : ''} 
					onChange={(e) => onUpdatePropValues(key, e.target.value)} 
				/> 
			: null}
			{propMap[key]?.inputType === 'select' ?
				<Select
					key={'select_' + key}
					{...propMap[key]?.componentProps}
					value={propValues && propValues[key] ? propValues[key] : ''}
					onChange={(e) => onUpdatePropValues(key, e.target.value)}
				>
					{Object.keys(propMap[key]?.options ?? {}).map((val, index) => <option key={val} value={val} >{propMap[key].options[val]}</option>)}
				</Select>
				: null}
			{propMap[key]?.inputType === 'file' ?
				<Select
					key={'file_' + key}
					{...propMap[key]?.componentProps}
					value={propValues && propValues[key] ? propValues[key] : ''}
					onChange={(e) => onUpdatePropValues(key, e.target.value)}
				>
					{(config?.files ?? []).map((val) => <option key={val} value={import.meta.env.VITE_POCKET_BASE_SERVER_URL + 'api/files/' + config.collectionId + '/' + config.id + '/' + val} >{val}</option>)}
				</Select>
				: null}
			{propMap[key]?.inputType === 'pageSelect' ?
				<Select
					key={'pageSelect_' + key}
					{...propMap[key]?.componentProps}
					value={propValues && propValues[key] ? propValues[key] : ''}
					onChange={(e) => onUpdatePropValues(key, e.target.value)}
				>
					{pages?.map((val, index) => (val.name !== currentPage) ? (
						<option key={index + '_' + val.name} value={val.name} >
							{val.name}
						</option>) : null)}
				</Select>
				: null}
		</>);
	}

	return (<>
		{
			Object.keys(propMap).map((key, index) => {
				return (<Box key={key + '|' + componentId}>
					<Box key={'main_question_' + key + '|' + componentId + '|' + index} mb={4}>
						{renderQuestion(propMap, key, config)}
					</Box>
					{propMap &&
						propMap[key] &&
						propMap[key]['follow_up_questions'] &&
						propValues && propValues[key] &&
						propMap[key]['follow_up_questions'][propValues[key]] ?
						<Box key={'follow_up_question_' + key + '|' + componentId + '|' + index} mb={4} ml={6}>
							{
								Object.keys(propMap[key]['follow_up_questions'][propValues[key]]).map((follow_up_key) => renderQuestion(propMap[key]['follow_up_questions'][propValues[key]], follow_up_key))
							}
						</Box>
					: null}
					{propMap &&
						propMap[key] &&
						propMap[key]['follow_up_questions'] &&
						propValues && propValues[key] &&
						propMap[key]['follow_up_questions']['SPECIAL_always_show'] ?
						<Box key={'follow_up_question_always_show_' + key + '|' + componentId + '|' + index} mb={4} ml={6}>
							{
								Object.keys(propMap[key]['follow_up_questions']['SPECIAL_always_show']).map((follow_up_key) => renderQuestion(propMap[key]['follow_up_questions']['SPECIAL_always_show'], follow_up_key))
							}
						</Box>
					: null}
				</Box>);
			})
		}
	</>);
}