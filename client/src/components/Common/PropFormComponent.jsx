import React, { useEffect, useState } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Input, Select, VStack } from "@chakra-ui/react";
import { HexColorPicker } from "react-colorful";
import { DebouncedColorPickerComponent } from "./DebouncedColorPickerComponent";


export default function PropFormComponent({ config, pages, componentId, propMap, propValues, onUpdatePropValues, currentPage }) {

	const renderQuestion = (propMap, key) => {
		return (<>
			<FormLabel>{propMap[key]?.label}</FormLabel>
			<Box mb={2}>
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
						{Object.keys(propMap[key]?.options ?? {}).map((val) => <option key={val} value={val} >{propMap[key].options[val]}</option>)}
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
				{propMap[key]?.inputType === 'colorPicker' ?
					<>
						<Input 
							key={'input_' + key}
							{...propMap[key]?.componentProps} 
							value={propValues && propValues[key] ? propValues[key] : ''} 
							onChange={(e) => onUpdatePropValues(key, e.target.value)} 
						/> 
						<DebouncedColorPickerComponent color={propValues && propValues[key] ? propValues[key] : ''} onChange={(color) => onUpdatePropValues(key, color)}/>
						{/* <HexColorPicker color={propValues && propValues[key] ? propValues[key] : ''} onChange={(color) => onUpdatePropValues(key, color)} /> */}
					</>
				: null}
			</Box>

			{/*Below is recursive to render all follow up questions*/}
			{propMap &&
			propMap[key] &&
			propMap[key]['followUpQuestions'] &&
			propValues && propValues[key] &&
			propMap[key]['followUpQuestions'][propValues[key]] ?
				<Box key={'follow_up_question_' + key + '|' + componentId} mb={4} ml={6}>
					{
						Object.keys(propMap[key]['followUpQuestions'][propValues[key]]).map((follow_up_key) => renderQuestion(propMap[key]['followUpQuestions'][propValues[key]], follow_up_key))
					}
				</Box>
			: null}
			{propMap &&
			propMap[key] &&
			propMap[key]['followUpQuestions'] &&
			propValues && propValues[key] &&
			propMap[key]['followUpQuestions']['SPECIAL_always_show'] ?
				<Box key={'follow_up_question_always_show_' + key + '|' + componentId} mb={4} ml={6}>
					{
						Object.keys(propMap[key]['followUpQuestions']['SPECIAL_always_show']).map((follow_up_key) => renderQuestion(propMap[key]['followUpQuestions']['SPECIAL_always_show'], follow_up_key))
					}
				</Box>
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
				</Box>);
			})
		}
	</>);
}