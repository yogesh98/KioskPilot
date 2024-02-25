import React from 'react'
import TestComponent, {propMap as testComponentPropMap} from './TestComponent/TestComponent';
import ImageComponent, {propMap as ImageComponentPropMap} from './Image/ImageComponent';
import ButtonComponent, {propMap as ButtonComponentPropMap} from './Button/ButtonComponent';

let map = {};

if(import.meta.env.VITE_APP_ENV === 'DEV'){
    map['Test'] = [TestComponent, testComponentPropMap];
}
map =  {
    ...map,
    'Image': [ImageComponent, ImageComponentPropMap],
    'Button': [ButtonComponent, ButtonComponentPropMap],
    'Button2': [ButtonComponent, ButtonComponentPropMap],
    'Button3': [ButtonComponent, ButtonComponentPropMap],
    'Button4': [ButtonComponent, ButtonComponentPropMap],
    'Button5': [ButtonComponent, ButtonComponentPropMap],
    'Button6': [ButtonComponent, ButtonComponentPropMap],
    'Button7': [ButtonComponent, ButtonComponentPropMap],

};
export default map;