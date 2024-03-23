import { Box, Button, Flex } from "@chakra-ui/react";
import { navigateToForm } from "../animationMap";

export const propMap = {
    'text': {
        'label': 'Text',
        'inputType': 'input',
        'componentProps': {
            'type': 'text',
            'placeholder': 'Text for button',
        },
    },
    'size': {
        'label': 'Size',
        'inputType': 'select',
        'componentProps': {
            'placeholder': 'select a size',
        },
        'options': {
            'xs': 'x-small',
            'sm': 'small',
            'md': 'medium',
            'lg': 'large',
        },
    },
    'variant': {
        'label': 'Variant',
        'inputType': 'select',
        'componentProps': {
            'placeholder': 'select a variant',
        },
        'options': {
            'solid': 'Solid',
            'outline': 'Outlined',
            'ghost': 'Ghost',
            'link': 'Link',
        },
    },
    'colorScheme': {
        'label': 'Color Scheme',
        'inputType': 'select',
        'componentProps': {
            'placeholder': 'select a color scheme',
        },
        'options': {
            'gray': 'Gray',
            'red': 'Red',
            'orange': 'Orange',
            'yellow': 'Yellow',
            'green': 'Green',
            'teal': 'Teal',
            'blue': 'Blue',
            'cyan': 'Cyan',
            'purple': 'Purple',
            'pink': 'Pink',
            'linkedin': 'Linkedin',
            'facebook': 'Facebook',
            'messenger': 'Messenger',
            'whatsapp': 'Whatsapp',
            'twitter': 'Twitter',
            'telegram': 'Telegram',
        },
    },
    'navigateTo': navigateToForm,
};

export default function ButtonComponent({
    scaleFactor, //Pass from editor or viewer
    navigate, //Pass from editor or viewer (Make sure to implement in both)
    text, // From prop form
    size,
    variant,
    colorScheme,
    navigateTo // From prop form
}) {
    const action = (e) => {
        if (navigateTo) {
            navigate(navigateTo, e);
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
                            <Button onClick={action} size={size} variant={variant} colorScheme={colorScheme} >
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