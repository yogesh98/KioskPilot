import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useClientContext } from "@yogeshp98/pocketbase-react";
import { useNavigate, useParams } from "react-router-dom";

import RGL, { WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
const ReactGridLayout = WidthProvider(RGL);

export default function ConfigurationViewer() {
    const params = useParams();
    const pbClient = useClientContext();
    const [config, setConfig] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        pbClient.collection('kiosks').getOne(params.kioskId).then((kiosk) => {
            pbClient.collection('configurations').getOne(kiosk.configuration).then((currentConfig) => {
                setConfig(currentConfig);
                if(!params.pageIndex) navigate('0');
            });
            pbClient.collection('configurations').subscribe(kiosk.configuration, (updatedConfig) => setConfig(updatedConfig?.record));
        });

        return () => pbClient.collection('configurations').unsubscribe();
    },[pbClient, params.kioskId]);
    console.log(config);
    return (
    <>
      {config  ? <Box align="center" justify="center" h={config.height} w={config.width}>
        <ReactGridLayout
          className="layout"
          width={config.width}
          height={config.height}
          layout={config.pages[params.pageIndex]?.layout}
          compactType={null}
          cols={config.columns}
          rows={config.rows}
          maxRows={config.rows}
          rowHeight={10}
          containerPadding={[0,0]}
          margin={[0,0]}
          allowOverlap={true}
          isDraggable={false}
          isResizable={false}
        >

        </ReactGridLayout>
      </Box> : null }
    </>
    );
  }