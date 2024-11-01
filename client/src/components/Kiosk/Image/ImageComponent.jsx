import { Box, Flex } from "@chakra-ui/react";
import { navigateToForm } from "../animationMap";

export const propMap = {
    'selectedImage': {
        'label': 'Image',
        'inputType': 'file',
        'componentProps': {
            'placeholder': 'Select an Image',
        },
    },
    "bgSize": {
        'label': 'Size',
        'inputType': 'select',
        'componentProps': { // props that go into the input type
            'placeholder': 'select an option',
        },
        'options': {
            'auto': 'auto',
            'contain': 'contain',
            'cover': 'cover',
        }
    },
    "bgPosition": {
        'label': 'Position',
        'inputType': 'select',
        'componentProps': { // props that go into the input type
            'placeholder': 'select an option',
        },
        'options': {
            'bottom': 'bottom',
            'top': 'top',
            'center': 'center',
            'left': 'left',
            'right': 'right',
        }
    },
    "bgRepeat": {
        'label': 'Repeat',
        'inputType': 'select',
        'componentProps': {
            'placeholder': 'select an option',
        },
        'options': {
            'no-repeat': 'No repeat',
            'repeat-x': 'Repeat X',
            'repeat-y': 'Repeat Y',
        }
    },
    'navigateTo': navigateToForm,
};

export default function ImageComponent({ 
    scaleFactor, 
    selectedImage, 
    bgSize, 
    bgPosition, 
    bgRepeat,
    navigateTo, //From Prop Form
    navigate, //Passed from editor or viewer
}) {
    const scaleFactorAsPercentage = (scaleFactor > 1 ? 1 : -1) * (scaleFactor * 100);

    const handleOnClick = () => {
        if (navigate && navigateTo) {
            navigate(navigateTo);
        }
    }

    return (
        <>
            {
                selectedImage ?
                    <Box
                        bgImage={selectedImage}
                        bgSize={bgSize ? bgSize : 'auto'}
                        h={'100%'}
                        bgPosition={bgPosition ? bgPosition : 'center'}
                        bgRepeat={bgRepeat ? bgRepeat : 'repeat'}
                        onClick={handleOnClick}
                    >

                    </Box>
                    : <Box>
                        Select an Image
                    </Box>
            }
        </>
    );
}