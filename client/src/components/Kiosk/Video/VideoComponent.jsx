import { Box, Flex } from "@chakra-ui/react";
import { navigateToForm } from "../animationMap";
import { useEffect } from "react";

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
    "redirectOnCompleteOrOnClick": {
        'label': 'Redirect on Complete Or On Click?',
        'inputType': 'select',
        'componentProps': {
            'placeholder': 'select an option',
        },
        'options': {
            'onClick': 'On Click',
            'onComplete': 'On Complete',
        },
        'followUpQuestions': {
            'onComplete': {
                'navigateTo': navigateToForm
            },
            'onClick': {
                'loop': {
                    'label': 'Loop?',
                    'inputType': 'select',
                    'componentProps': {
                        'placeholder': 'select an option',
                    },
                    'options': {
                        'true': 'yes',
                        'false': 'no',
                    }
                },
                'navigateTo': navigateToForm,
            },
        }
    },
};

export default function VideoComponent({ 
    scaleFactor, //Passed from editor or viewer
    navigate, //Passed from editor or viewer
    selectedVideo, //From Prop Form
    objectFit, //From Prop Form
    redirectOnCompleteOrOnClick, //From Prop Form
    loop, //From Prop From
    navigateTo, //From Prop Form
}) {
    loop = !!loop ? JSON.parse(loop) : false
    const handleVideoEnd = () => {
        if (redirectOnCompleteOrOnClick === 'onComplete' && navigate && navigateTo && !loop) {
            navigate(navigateTo);
        }
    };

    const handleOnClick = () => {
        if (redirectOnCompleteOrOnClick === 'onClick' && navigate && navigateTo) {
            navigate(navigateTo);
        }
    }

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
                    loop={loop}
                    playsInline={true}
                    webkit-playsInline={true}
                    muted={true}
                    onEnded={handleVideoEnd}
                    onClick={handleOnClick}
                >
                </video>
            </Flex>
        </>
    );
}