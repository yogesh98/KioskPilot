import TestComponent, {propMap as testComponentPropMap} from './TestComponent/TestComponent';
import ImageComponent, {propMap as ImageComponentPropMap} from './Image/ImageComponent';
import ButtonComponent, {propMap as ButtonComponentPropMap} from './Button/ButtonComponent';
import VideoComponent, {propMap as VideoComponentPropMap}  from './Video/VideoComponent';
import TextComponent, {propMap as TextComponentPropMap}  from './Text/TextComponent';


let map = {};

if(import.meta.env.VITE_APP_ENV === 'DEV'){
    map['Test'] = [TestComponent, testComponentPropMap];
}
map =  {
    ...map,
    'Image': [ImageComponent, ImageComponentPropMap],
    'Button': [ButtonComponent, ButtonComponentPropMap],
    'Video': [VideoComponent, VideoComponentPropMap],
    'Text': [TextComponent, TextComponentPropMap],
};
export default map;

