import { Box, Flex } from "@chakra-ui/react";

export const propMap = {
    'imageUrl': {
        'image': 'user_images',
        'inputType': 'input',
        'componentProps': { // replace this with image upload
            'type': 'text',
            'placeholder': 'Text to show in component',
        }
    }
};

export default function ImageComponent({scaleFactor, imageUrl}) {
    const scaleFactorAsPercentage = (scaleFactor > 1 ? 1 : -1) * (scaleFactor * 100); 
    return (
        <>
            <Box>
                ImageComponent
            </Box>
        </>
    );
}