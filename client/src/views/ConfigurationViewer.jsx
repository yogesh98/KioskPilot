import React, { useEffect, useState } from "react";
import { Box, layout } from "@chakra-ui/react";
import { useClientContext } from "@yogeshp98/pocketbase-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { animate, useAnimate } from "framer-motion";

import componentMap from "../components/Kiosk/componentMap";
import { viewAnimations, componentAnimations } from "../components/Kiosk/animationMap";

import RGL, { WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
const ReactGridLayout = WidthProvider(RGL);

export default function ConfigurationViewer() {
  const params = useParams();
  const pbClient = useClientContext();
  const [viewScope, viewAnimate] = useAnimate();
  const [componentScope, componentAnimate] = useAnimate();
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
      playAnimation(currentAnimation.animationType, eval(currentAnimation.animationType)[currentAnimation['animationName']]['enter']).then(() => setCurrentAnimation(null));
    }
  }, [params.pageIndex])

  const navigateToPage = (withAnimation) => (index) => {
    let path = location.pathname.split('/');
    path.pop();
    if(withAnimation?.animationType && withAnimation?.animationName){
      setCurrentAnimation(withAnimation);
      playAnimation(withAnimation.animationType, eval(withAnimation.animationType)[withAnimation['animationName']]['exit']).then(() => navigate(path.join('/') + '/' + index));
    } else {
      navigate(path.join('/') + '/' + index);
    }
  }


  const playAnimation = (animationType, animation) => {
      if(animationType === 'viewAnimations'){
        return viewAnimate(viewScope.current, animation['to'], animation['options']);
      } else if (animationType === 'componentAnimations'){
        return componentAnimate(componentScope.current, animation['to'], animation['options']);
      }
      return Promise.resolve(null);
  }

  return (
    <>
      <Box ref={componentScope} zIndex={2} bg={'black'} {...(currentAnimation?.animationType ? eval(currentAnimation.animationType)[currentAnimation['animationName']]['initial'] : {})}/>
      {config ? (
        <Box align="center" justify="center" h={config.height} w={config.width} overflow={'hidden'} /*outline={'5px dotted black'}*/>
          <Box ref={viewScope}>
            <ReactGridLayout
              className="layout"
              width={config.width}
              height={config.height}
              layout={config.pages[params.pageIndex]?.layout?.map((layoutItem) => {
                layoutItem.isDraggable = false;
                return layoutItem;
              })}
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
                  const animation = {'animationType': props['animationType'], 'animationName': props['animationName']};
                  return <Box key={component['i']} h={'100%'} w={'100%'}>
                    <DynamicComponent {...component} pages={config.pages.map(v => v.name)} scaleFactor={1} navigate={navigateToPage(animation)} {...props} />
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