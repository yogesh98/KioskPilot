import { Box, Flex } from "@chakra-ui/react";

export const propMap = {
    'text': {
        'label': 'Text',
        'inputType': 'input',
        'componentProps': {
            'type': 'text',
            'placeholder': 'Text to show in component',
        }
    }
};

export default function TestComponent({scaleFactor, text}) {
    const scaleFactorAsPercentage = (scaleFactor > 1 ? 1 : -1) * (scaleFactor * 100); 
    return (
        <>
            <Flex
                id="container_flex"
                h={'100%'}
                w={'100%'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <div  style={{transform: 'scale('+scaleFactor+') translate(0%, '+scaleFactorAsPercentage+'%)'}}> 
                    <span className="text">{text}</span>
                </div>
            </Flex>
        </>
    );
}