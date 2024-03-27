import { Box, Flex, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text } from "@chakra-ui/react";
import React, { useState } from 'react';

export const propMap = {
    'text': {
        'label': 'Text',
        'inputType': 'input',
    },
    'font': {
        'label': 'Font',
        'inputType': 'select',
        'componentProps': {
            'placeholder': 'Select a font',
        },
        'options': {
            'Arial': 'Arial',
            'Helvetica': 'Helvetica',
            'Times New Roman': 'Times New Roman',
            'Courier New': 'Courier New',
            'Verdana': 'Verdana',
        },
    },
    'size': {
        'label': 'Size',
        'inputType': 'slider',
        'componentProps': {
            'min': 2,
            'max': 100,
            'step': 1,
        },
        'currentValueText': 'Current Size: {size}',
    },
    'weight': {
        'label': 'Weight',
        'inputType': 'select',
        'componentProps': {
            'placeholder': 'Select a weight',
        },
        'options': {
            'normal': 'Normal',
            'bold': 'Bold',
            'light': 'Light',
        },
    },
    'color': {
        'label': 'Color',
        'inputType': 'colorPicker',
        'componentProps': {
            
        },
    },
    'background': {
        'label': 'Background',
        'inputType': 'select',
        'componentProps': {
            'placeholder': 'Select a background color',
        },
        'options': {
            'white': 'White',
            'black': 'Black',
            'red': 'Red',
            'blue': 'Blue',
            'green': 'Green',
            'yellow': 'Yellow',
            'purple': 'Purple',
            'orange': 'Orange',
        },
    },
    'align': {
        'label': 'Align',
        'inputType': 'select',
        'componentProps': {
            'placeholder': 'Select an alignment',
        },
        'options': {
            'left': 'Left',
            'center': 'Center',
            'right': 'Right',
        },
    },
    'transform': {
        'label': 'Transform',
        'inputType': 'select',
        'componentProps': {
            'placeholder': 'Select a transform',
        },
        'options': {
            'none': 'None',
            'uppercase': 'Uppercase',
            'lowercase': 'Lowercase',
            'capitalize': 'Capitalize',
        },
    },
    'opacity': {
        'label': 'Opacity',
        'inputType': 'slider',
        'componentProps': {
            'min': 0,
            'max': 1,
            'step': 0.01,
            'defaultValue': 1,
        },
    },
}

export default function TextComponent({
    text,
    font,
    size,
    weight,
    color,
    background,
    align,
    transform,
    opacity,
}) {
    const [sliderValue, setSliderValue] = useState(size);

    const handleSliderChange = (value) => {
        setSliderValue(value);
    };

    return (
        <>
            {
                text ? <Box 
                bg={background}
                color={color}
                fontWeight={weight}
                fontSize={size}
                fontFamily={font}
                textAlign={align}
                textTransform={transform}
                opacity={opacity}
                >
                    {text}
                    {size && <Slider defaultValue={size} min={2} max={100} step={1} onChange={(value) => console.log(value)} />}
                </Box> : <Box>Enter text</Box>
            }
        </>
    );
}
