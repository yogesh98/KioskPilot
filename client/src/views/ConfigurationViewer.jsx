import React, { useEffect, useState } from "react";
import { Box, layout } from "@chakra-ui/react";
import { useClientContext } from "@yogeshp98/pocketbase-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAnimate } from "framer-motion";

import componentMap from "../components/Kiosk/componentMap";
import { viewAnimations, externalBoxAnimations } from "../components/Kiosk/animationMap";

import RGL, { WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
const ReactGridLayout = WidthProvider(RGL);

export default function ConfigurationViewer() {
  const params = useParams();
  const pbClient = useClientContext();
  const [viewScope, viewAnimate] = useAnimate();
  const [externalBoxScope, externalBoxAnimate] = useAnimate();
  const [currentAnimation, setCurrentAnimation] = useState();
  const [config, setConfig] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    pbClient.collection('kiosks').getOne(params.kioskId).then((kiosk) => {
      pbClient.collection('configurations').getOne(kiosk.configuration).then((currentConfig) => {
        setConfig(currentConfig);
        if (!params.pageIndex) navigate('0');
      });
      pbClient.collection('configurations').subscribe(kiosk.configuration, (updatedConfig) => setConfig(updatedConfig?.record));
    });

    return () => pbClient.collection('configurations').unsubscribe();
  }, [pbClient, params.kioskId]);

  useEffect(() => {
    if(currentAnimation?.animationType && currentAnimation?.animationName){
      console.log(currentAnimation);
      playAnimation(currentAnimation.animationType, eval(currentAnimation.animationType)[currentAnimation['animationName']], 'enter').then(() => setCurrentAnimation(null));
    }
  }, [params.pageIndex])

  const navigateToPage = (withAnimation) => (index) => {
    let path = location.pathname.split('/');
    path.pop();
    if(withAnimation?.animationType && withAnimation?.animationName){
      setCurrentAnimation(withAnimation);
      playAnimation(withAnimation.animationType, eval(withAnimation.animationType)[withAnimation['animationName']], 'exit').then(() => navigate(path.join('/') + '/' + index));
    } else {
      navigate(path.join('/') + '/' + index);
    }
  }


  const playAnimation = (animationType, animation, enterOrExit) => {
      let scope = null;
      let animate = null;
      if(animationType === 'viewAnimations'){
        scope = viewScope;
        animate = viewAnimate;
      } else if (animationType === 'externalBoxAnimations'){
        scope = externalBoxScope;
        animate = externalBoxAnimate;
      }
      
      if(scope) {
        return animate(scope.current, animation[enterOrExit]['to'], animation[enterOrExit]['options']);
      }
      return Promise.resolve(false);
  }
  return (
    <>
      {config ? (
        <Box align="center" justify="center" h={config.height} w={config.width} overflow={'hidden'} /*outline={'5px dotted black'}*/>
          <Box id="animation-component" ref={externalBoxScope} bgColor={'black'} style={currentAnimation?.animationType ? eval(currentAnimation.animationType)[currentAnimation['animationName']]['initial'] : {}} {...currentAnimation?.boxProps}/>
          <Box ref={viewScope}>
            <ReactGridLayout
              className="layout"
              width={config.width}
              height={config.height}
              layout={config.pages[params.pageIndex]?.layout?.map((layoutItem) => {
                layoutItem.isDraggable = false;
                return layoutItem;
              })}
              useCSSTransforms={false}
              compactType={null}
              cols={config.columns}
              rows={config.rows}
              maxRows={config.rows}
              rowHeight={10}
              containerPadding={[0, 0]}
              margin={[0, 0]}
              allowOverlap={true}
              isDraggable={false}
              isResizable={false}
              style={{
                height: '100%',
                width: '100%',
              }}
            >

              {
                config.pages[params.pageIndex]?.layout?.map((component, index) => {
                  const [componentName] = component['i'].split('|');
                  const DynamicComponent = componentMap[componentName][0];
                  const props = config.pages[params.pageIndex].propValues[component['i']];
                  const animationBoxAutoLoad_props = props ? Object.keys(props).reduce((obj, key) => {return key.includes('animationBoxAutoLoad_') ? {...obj, [key.replace('animationBoxAutoLoad_', '')]: props[key]} : obj}, {}) : {};
                  const withAnimation = props?.animationType && props?.animationName ? {'animationType': props?.animationType, 'animationName': props?.animationName, 'boxProps': animationBoxAutoLoad_props} : null;
                  return <Box key={component['i']} h={'100%'} w={'100%'}>
                    <DynamicComponent {...component} pages={config.pages.map(v => v.name)} scaleFactor={1} navigate={navigateToPage(withAnimation)} {...props} />
                  </Box>
                })

              }
            </ReactGridLayout>
          </Box>
        </Box>
      ) : null}
    </>
  );
}