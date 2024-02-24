import React from 'react'
import TestComponent, {propMap as testComponentPropMap} from './TestComponent/TestComponent';
import ImageComponent, {propMap as ImageComponentPropMap} from './Image/ImageComponent';

export default {
    'Test': [TestComponent, testComponentPropMap],
    'Image': [ImageComponent, ImageComponentPropMap],
};