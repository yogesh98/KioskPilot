import { Box, Button, Flex } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

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
            'placeholder': 'Select a page to go next',
        },
        'follow_up_questions': {
            'onSelect': true,
            0: { // this key is the answer from the parent that causes this one to render.
                'animationType': {
                    'label': 'Animation Type',
                    'inputType': 'select',
                    'componentProps': { // props that go into the input type
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

export default function ButtonComponent({ scaleFactor, text, h, w, navigateTo, pages }) {
    let navigate = useNavigate();
    let location = useLocation();
    const scaleFactorAsPercentage = (scaleFactor > 1 ? 1 : -1) * (scaleFactor * 100);
    const action = () => {
        if (navigateTo) {
            let path = location.pathname.split('/');
            path.pop()
            navigate(path.join('/') + '/' + pages.indexOf(navigateTo));
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