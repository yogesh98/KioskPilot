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

export const externalBoxAnimations = {
    'swipeUp' : {
        'initial': {position:'fixed', zIndex:'2', height:'100vh', width:'100vw', top: '50vh', left: '0vw'},
        'enter': {
            'to': {
                top: ['0vh', '-100vh'],
            },
            'options': { delay: 0.25, duration: 0.5, autoplay:true}
        },
        'exit': {
            'to': {
                top: ['100vh', '0vh'],
            },
            'options': { delay: 0.25, duration: 0.5, autoplay:true}
        }
    },
    'swipeDown' : {
        'initial': {position:'fixed', zIndex:'2', height:'100vh', width:'100vw', top: '-100vh', left: '0vw'},
        'enter': {
            'to': {
                top: ['0vh', '100vh'],
            },
            'options': { delay: 0.25, duration: 0.5, autoplay:true}
        },
        'exit': {
            'to': {
                top: ['-100vh', '0vh'],
            },
            'options': { delay: 0.25, duration: 0.5, autoplay:true}
        }
    },
    'swipeLeft' : {
        'initial': {position:'fixed', zIndex:'2', height:'100vh', width:'100vw', top: '0vh', left: '100vw'},
        'enter': {
            'to': {
                left: ['0vw', '-100vw'],
            },
            'options': { delay: 0.25, duration: 0.5, autoplay:true}
        },
        'exit': {
            'to': {
                left: ['100vw', '0vw'],
            },
            'options': { duration: 0.5, autoplay:true}
        }
    },
    'swipeRight' : {
        'initial': {position:'fixed', zIndex:'2', height:'100vh', width:'100vw', top: '0vh', left: '-100vw'},
        'enter': {
            'to': {
                left: ['0vw', '100vw'],
            },
            'options': { delay: 0.25, duration: 0.5, autoplay:true}
        },
        'exit': {
            'to': {
                left: ['-100vw', '0vw'],
            },
            'options': { duration: 0.5, autoplay:true}
        }
    },
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
                        'externalBoxAnimations': 'External Animations',
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
                        'externalBoxAnimations': {
                            'animationName':{
                                'label': 'Animation',
                                'inputType': 'select',
                                'componentProps': {
                                    'placeholder': 'select an animation',
                                },
                                'options': (Object.keys(externalBoxAnimations)).reduce((obj, key) => {return {...obj, [key]:key}}, {})
                            },
                            'animationBoxAutoLoad_bgColor':{ //anything prefixed with animationBoxAutoLoad will automatically be loaded into animation box
                                'label': 'Color',
                                'inputType': 'colorPicker',
                            }
                        }
                    }
                }
            }
        }
}
