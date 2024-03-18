const reduceFn = (obj, key) => {
    obj[key] = key;
    return obj;
    // return {...obj, [key]:[key]}
}

export const viewAnimations = {
    'opacity': {
        'enter':{
            'to': {
                'opacity': [0,1]
            },
            'options': { duration: 0.5, autoplay: true }
        },
        'exit':{
            'to': {
                'opacity': [1,0]
            },
            'options': { duration: 0.5, autoplay: true }
        }
    },
    'scale' : {
        'enter': {
            'to': {
                'scale': [0,1]
            },
            'options': { duration: 0.5, autoplay: true }
        },
        'exit': {
            'to': {
                'scale': [1,0]
            },
            'options': { duration: 0.5, autoplay: true }
        }
    }
};

export const componentAnimations = {
    'swipeDown' : {
        'initial': {
            'position':'fixed',
            'w':'100%',
            'h':'100%',
            'y':'-100%',
        },
        'enter': {
            'to': {
                'y': '-100%',
            },
            'options': { duration: 0.5, autoplay:true}
        },
        'exit': {
            'to': {
                'y': '0%',
            },
            'options': { duration: 0.5, autoplay:true}
        }
    }
}
export const navigateToForm = {
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
                        'viewAnimations': 'View Animations',
                        'componentAnimations': 'Component Animations',
                    },
                    'follow_up_questions':{
                        'viewAnimations': {
                            'animationName':{
                                'label': 'Animation',
                                'inputType': 'select',
                                'componentProps': {
                                    'placeholder': 'select an animation',
                                },
                                'options': (Object.keys(viewAnimations)).reduce((obj, key) => {return {...obj, [key]:key}}, {})
                            }
                        },
                        'componentAnimations': {
                            'animationName':{
                                'label': 'Animation',
                                'inputType': 'select',
                                'componentProps': {
                                    'placeholder': 'select an animation',
                                },
                                'options': (Object.keys(componentAnimations)).reduce((obj, key) => {return {...obj, [key]:key}}, {})
                            }
                        }
                    }
                }
            }
        }
}
