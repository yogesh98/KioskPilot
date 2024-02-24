import React from 'react'
import TestComponent, {propMap as testComponentPropMap} from './TestComponent/TestComponent';
import ImageComponent, {propMap as ImageComponentPropMap} from './Image/ImageComponent';

let map = {};

if(import.meta.env.VITE_APP_ENV === 'DEV'){
    map['Test'] = [TestComponent, testComponentPropMap];
}
map =  {
    ...map,
    'Image': [ImageComponent, ImageComponentPropMap],
};
export default map;