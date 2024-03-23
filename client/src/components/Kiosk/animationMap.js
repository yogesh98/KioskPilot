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
    },
    'forward' : {
        'enter': {
            'to': {
                'scale': [0.5, 1],
                'opacity': [0, 1],
            },
            'options': { duration: 0.5, autoplay:true}
        },
        'exit': {
            'to': {
                'scale': [1, 1.5],
                'opacity': [1, 0],
            },
            'options': { duration: 0.5, autoplay:true}
        }
    },
    'backward' : {
        'enter': {
            'to': {
                'scale': [1.5, 1],
                'opacity': [0, 1],
            },
            'options': { duration: 0.5, autoplay:true}
        },
        'exit': {
            'to': {
                'scale': [1, 0.5],
                'opacity': [1, 0],
            },
            'options': { duration: 0.5, autoplay:true}
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
    'ripple': {
        'dynamic': ['top', 'left'],
        'initial': {position:'fixed', backgroundColor:'#2D3748', zIndex:'2', height:'1px', width:'1px', left:'0', top:'0', borderRadius: '50%'},
        'enter': {
            'to': {
                'scale': [5000, 0],
            },
            'options': { delay: 0.25, duration: 0.5, autoplay:true}
        },
        'exit': {
            'to': {
                'scale': [0, 5000],
            },
            'options': { duration: 1, autoplay:true, ease: [0, 0.71, 0.2, 1.01]}
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
        'followUpQuestions': {
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
                    'followUpQuestions':{
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
