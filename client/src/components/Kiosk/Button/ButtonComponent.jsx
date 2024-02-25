import { Box, Button, Flex } from "@chakra-ui/react";

export const propMap = {
    'text': {
        'label': 'Text',
        'inputType': 'input',
        'componentProps': {
            'type': 'text',
            'placeholder': 'Text for third prop',
        },
    },
    'navigateTo': {
        'label': 'Navigate to Page',
        'inputType': 'pageSelect',
        'componentProps': {
            'type': 'text',
            'placeholder': 'Text for third prop',
        },
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

export default function ButtonComponent({scaleFactor, text, h, w, navigateTo}) {
    const scaleFactorAsPercentage = (scaleFactor > 1 ? 1 : -1) * (scaleFactor * 100); 
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
                    <div style={{transform: 'scale('+scaleFactor+') translate(0%, 0%)'}}> 
                        <Button>
                            {text}
                        </Button>
                    </div>
                </Flex>
                :<Box>
                    Enter Text
                </Box>
            }
        </>
    );
}