import { Box, Button, Flex } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

export const propMap = {
    'text': {
        'label': 'Text',
        'inputType': 'input',
        'componentProps': {
            'type': 'text',
            'placeholder': 'Text for button',
        },
    },
    'navigateTo': {
        'label': 'Navigate to Page',
        'inputType': 'pageSelect',
        'componentProps': {
            'type': 'text',
            'placeholder': 'Select a page to go next',
        },
        'follow_up_questions': {
            'SPECIAL_always_show': {
                'animationType': {
                    'label': 'Animation Type',
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
    // 'h': {
    //     'label': 'Height Percentage',
    //     'inputType': 'input',
    //     'componentProps': {
    //         'type': 'number',
    //         'placeholder': '',
    //     },
    // },
    // 'w': {
    //     'label': 'Width Percentage',
    //     'inputType': 'input',
    //     'componentProps': {
    //         'type': 'number',
    //         'placeholder': '',
    //     },
    // },
};

export default function ButtonComponent({ 
        scaleFactor, //Pass from editor or viewer
        pages, //Pass from editor or viewer
        navigate, //Pass from editor or viewer (Make sure to implement in both)
        text, // From prop form
        navigateTo // From prop form
    }) {
    const action = () => {
        if (navigateTo) {
            navigate(pages.indexOf(navigateTo));
        }
    }
    return (
        <>
            {
                text ?
                    <Flex
                        h={'100%'}
                        w={'100%'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <div style={{ transform: 'scale(' + scaleFactor + ') translate(0%, 0%)' }}>
                            <Button onClick={() => action()}>
                                {text}
                            </Button>
                        </div>
                    </Flex>
                    : <Box>
                        Enter Text
                    </Box>
            }
        </>
    );
}