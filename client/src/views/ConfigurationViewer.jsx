import React, { useEffect, useState } from "react";
import { Box, layout } from "@chakra-ui/react";
import { useClientContext } from "@yogeshp98/pocketbase-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion, useAnimate, usePresence } from "framer-motion";

import componentMap from "../components/Kiosk/ComponentMap";


import RGL, { WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
const ReactGridLayout = WidthProvider(RGL);

export default function ConfigurationViewer() {
  const params = useParams();
  const [previousParams, setPreviousParams] = useState({});
  const pbClient = useClientContext();
  const [scope, animate] = useAnimate();
  const [isPresent, safeToRemove] = usePresence();
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
    if (!params || params !== previousParams) setPreviousParams(params);
  }, [params])

  useEffect(() => {
    if (config) {
      let animateObj = {};
      const layout = (config?.pages?.[previousParams?.pageIndex]?.layout?.length > 0) ? config?.pages?.[previousParams?.pageIndex].layout : [];

      let animationType = layout?.filter(v => config?.pages?.[previousParams?.pageIndex]?.propValues?.[v?.i]?.navigateTo === config?.pages?.[params?.pageIndex]?.name)?.[0]?.i

      animationType = config?.pages?.[previousParams?.pageIndex]?.propValues?.[animationType]?.animationType;
      if (!animationType) {
        animationType = "opacity"
      }

      animateObj[animationType] = [0, 1];

      animate(scope.current, animateObj, { duration: 1, autoplay: true });
    }
  }, [config])


  useEffect(() => {
    if (config) {
      let animateObj = {};
      const layout = (config?.pages?.[previousParams?.pageIndex]?.layout?.length > 0) ? config?.pages?.[previousParams?.pageIndex].layout : [];

      let animationType = layout?.filter(v => config?.pages?.[previousParams?.pageIndex]?.propValues?.[v?.i]?.navigateTo === config?.pages?.[params?.pageIndex]?.name)?.[0]?.i

      animationType = config?.pages?.[previousParams?.pageIndex]?.propValues?.[animationType]?.animationType;
      if (!animationType) {
        animationType = "opacity"
      }

      animateObj[animationType] = [0, 1];

      animate(scope.current, animateObj, { duration: 1, autoplay: true });
    }
  }, [params.pageIndex])

  const navigateToPage = (index) => {
    let path = location.pathname.split('/');
    path.pop();
    navigate(path.join('/') + '/' + index);
  }

  return (
    <>
      {config ? (
        <Box align="center" justify="center" h={config.height} w={config.width} /*outline={'5px dotted black'}*/ ref={scope}>
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
                return <Box key={component['i']} h={'100%'} w={'100%'}>
                  <DynamicComponent {...component} pages={config.pages.map(v => v.name)} scaleFactor={1} navigate={navigateToPage} {...props} />
                </Box>
              })

            }
          </ReactGridLayout>
        </Box>
      ) : null}
    </>
  );
}