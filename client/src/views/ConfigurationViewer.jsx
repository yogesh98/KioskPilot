import React, { useEffect, useState } from "react";
import { Box, layout } from "@chakra-ui/react";
import { useClientContext } from "@yogeshp98/pocketbase-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAnimate } from "framer-motion";

import componentMap from "../components/Kiosk/componentMap";
import { animations } from "../components/Kiosk/animationMap"; // These are being used but its with the evals below so they aren't direclty being used.

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
  const [refreshCount, setRefreshCount] = useState(0);
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
    if (config) {
      if (!config.pages[params.pageIndex]) {
        navigate(`/kiosk/${params.kioskId}/0`);
      }
    }
  }, [config, params.pageIndex]);

  useEffect(() => {
    if (currentAnimation?.animationType && currentAnimation?.animationName) {
      playAnimation(currentAnimation.animationType, animations[currentAnimation.animationType][currentAnimation['animationName']], 'enter').then(() => {
        setRefreshCount(refreshCount + 1);
        setCurrentAnimation(null)
      });
    }
  }, [params.pageIndex]);


  useEffect(() => {
    const animation = {'animationType': 'viewAnimations', 'animationName': 'opacity'};
    let timeout = setTimeout(() => {
      navigateToPage(animation)('home');
    }, 6000);

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        navigateToPage(animation)('home');
      }, 6000);
    };

    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keypress', resetTimeout);
    window.removeEventListener('mousedown', resetTimeout);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keypress', resetTimeout);
      window.removeEventListener('mousedown', resetTimeout);
    };
  }, [config, params.pageIndex]);

  const navigateToPage = (withAnimation) => (pageName, event) => {
    if(!config?.pages) return;
    const index = config.pages.map(v => v.name).indexOf(pageName);
    if(index === -1) return;
    else if (index === parseInt(params.pageIndex)) return;
    let path = location.pathname.split('/');
    path.pop();
    if (withAnimation?.animationType && withAnimation?.animationName) {
      if (withAnimation.animationType === 'externalBoxAnimations' && animations[withAnimation?.animationType]?.[withAnimation['animationName']]?.['dynamic']) {
        const map = animations[withAnimation.animationType][withAnimation['animationName']]
        withAnimation.initial = configureDynamicAnimation(map['dynamic'], map['initial'], event);
      }
      setCurrentAnimation(withAnimation);
      playAnimation(withAnimation.animationType, animations[withAnimation.animationType][withAnimation['animationName']], 'exit').then(() => navigate(path.join('/') + '/' + index));
    } else {
      navigate(path.join('/') + '/' + index);
    }
  }

  const configureDynamicAnimation = (dynamic, initial, event) => {
    let newInitial = {...initial};
    dynamic.forEach(property => {
      switch (property) {
        case 'top':
        case 'bottom':
          newInitial[property] = event?.clientY || 0;
          break;
        case 'left':
        case 'right':
          newInitial[property] = event?.clientX || 0;
          break;
      }
    });

    return newInitial
  }

  const playAnimation = (animationType, animation, enterOrExit) => {
    let scope = null;
    let animate = null;

    if (animationType === 'viewAnimations') {
      scope = viewScope;
      animate = viewAnimate;
    } else if (animationType === 'externalBoxAnimations') {
      scope = externalBoxScope;
      animate = externalBoxAnimate;
    }

    if (scope) {
      return animate(scope.current, animation[enterOrExit]['to'], animation[enterOrExit]['options']);
    }
    return Promise.resolve(false);
  }
  return (
    <>
      <Box key={refreshCount} id="animation-component" ref={externalBoxScope} bgColor={'gray'} style={currentAnimation?.initial ? currentAnimation.initial : (currentAnimation?.animationType ? animations[currentAnimation.animationType][currentAnimation['animationName']]['initial'] : {})} {...currentAnimation?.boxProps} />
      {config ? (
        <Box align="center" justify="center" h={config.height} w={config.width} overflow={'hidden'} outline={'5px dotted black'} bgColor={'black'}>
          <Box ref={viewScope} align="center" justify="center" h={config.height} w={config.width}>
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
                  const animationBoxAutoLoad_props = props ? Object.keys(props).reduce((obj, key) => { return key.includes('animationBoxAutoLoad_') ? { ...obj, [key.replace('animationBoxAutoLoad_', '')]: props[key] } : obj }, {}) : {};
                  const withAnimation = props?.animationType && props?.animationName ? { 'animationType': props?.animationType, 'animationName': props?.animationName, 'boxProps': animationBoxAutoLoad_props } : null;
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