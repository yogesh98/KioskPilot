import { Box } from "@chakra-ui/react";
import { useClientContext } from "@yogeshp98/pocketbase-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
            pbClient.collection('configurations').subscribe(kiosk.configuration, (updatedConfig) => setConfig(updatedConfig));
        });

        return () => pbClient.collection('configurations').unsubscribe();
    },[pbClient, params.kioskId]);

    return (
      <Box align="center" justify="center" h="100%">
        Config Viewer
      </Box>
    );
  }