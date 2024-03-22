import { Box, Flex } from "@chakra-ui/react";
import { navigateToForm } from "../animationMap";

export const propMap = {
    'selectedVideo': {
        'label': 'Video',
        'inputType': 'file',
        'componentProps': {
            'placeholder': 'Select a Video',
        },
    },
    "objectFit": {
        'label': 'Object Fit',
        'inputType': 'select',
        'componentProps': {
            'placeholder': 'select an option',
        },
        'options': {
            'fill': 'fill',
            'contain': 'contain',
            'cover': 'cover',
            'none': 'none',
            'scale-down': 'scale down',
        }
    },
    "redirectOnComplete": {
        'label': 'Redirect on Complete?',
        'inputType': 'select',
        'componentProps': {
            'placeholder': 'select an option',
        },
        'options': {
            'true': 'yes',
            'false': 'no',
        },
        'followUpQuestions': {
            'true': {
                'navigateTo': navigateToForm
            }
        }
    }
};

export default function VideoComponent({ 
    scaleFactor, //Passed from editor or viewer
    navigate, //Passed from editor or viewer
    selectedVideo, //From Prop Form
    objectFit, //From Prop Form
    redirectOnComplete, //From Prop Form
    navigateTo, //From Prop Form
}) {
    redirectOnComplete = JSON.parse(redirectOnComplete);
    const handleVideoEnd = () => {
        if (redirectOnComplete && navigate && navigateTo) {
            navigate(navigateTo);
        }
    };

    return (
        <>
            <Flex
                h={'100%'}
                w={'100%'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <video
                    style={{objectFit: objectFit, height: '100%', width: '100%'}}
                    src={selectedVideo}
                    autoPlay
                    onEnded={handleVideoEnd}
                >
                </video>
            </Flex>
        </>
    );
}