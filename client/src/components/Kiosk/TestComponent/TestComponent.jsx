import { Box, Flex } from "@chakra-ui/react";

export const propMap = {
    'selectedFile': {
        'label': 'Select A file',
        'inputType': 'file',
        'componentProps': {
            'placeholder': 'select a file',
        },    
    },
    'propName': {
        'label': 'human readable label',
        'inputType': 'input',
        'componentProps': { // props that go into the input type
            'type': 'text',
            'placeholder': 'Text to show in component',
        },
        'follow_up_questions': {
            'showFollowUp': { // this key is the answer from the parent that causes this one to render.
                'secondPropName': {
                    'label': 'human readable label for follow up',
                    'inputType': 'input',
                    'componentProps': {
                        'type': 'text',
                        'placeholder': 'Text for second prop',
                    },
                }
            },
            'SPECIAL_always_show': { // This is a special follow up key. If any answer is chosen. then these follow up questions will show up
                'animationType': {
                    'label': 'SPECIAL_always_show Label',
                    'inputType': 'select',
                    'componentProps': {
                        'placeholder': 'select an option',
                    },
                    'options': {
                        'opacity': 'opacity',
                        'scale': 'scale',
                    }
                }
            }
        }
    },
    "selectAbleProp" : {
        'label': 'Select an option',
        'inputType': 'select',
        'componentProps': { // props that go into the input type
            'placeholder': 'select an option',
        },
        'options': {
            'value': 'label',
            'value2': 'label2'
        }
    },
    "thirdProp" : {
        'label': 'human readable label for third prop',
        'inputType': 'input',
        'componentProps': { // props that go into the input type
            'type': 'text',
            'placeholder': 'Text for third prop',
        },
    },
    "fourth": {
        'label': 'human readable label for third prop',
        'inputType': 'input',
        'componentProps': { // props that go into the input type
            'type': 'text',
            'placeholder': 'Text for third prop',
        },
    },
    "fifth": {
        'label': 'human readable label for third prop',
        'inputType': 'input',
        'componentProps': { // props that go into the input type
            'type': 'text',
            'placeholder': 'Text for third prop',
        },
    }
};

export default function TestComponent({scaleFactor, propName, secondPropName, thirdProp, selectAbleProp}) {
    const scaleFactorAsPercentage = (scaleFactor > 1 ? 1 : -1) * (scaleFactor * 100); 
    return (
        <>
            <Flex
                h={'100%'}
                w={'100%'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <div style={{transform: 'scale('+scaleFactor+') translate(0%, 0%)'}}> 
                    <span className="text">{propName}</span>
                    <span className="text">{secondPropName}</span>
                    <span className="text">{thirdProp}</span>
                    <span className="text">{selectAbleProp}</span>
                </div>
            </Flex>
        </>
    );
}