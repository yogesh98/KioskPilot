import { Box, Image } from "@mantine/core";
import style from "../styles/main.module.css";
import ModuleNav from "../component/ModuleNav";
import { useParams } from "react-router-dom";
import pb from "../lib/pocketbase";
import { useEffect, useRef, useState } from "react";
import { MainScreenData } from "../lib/types";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";

const imageStyle = {
  root: { height: "100%", width: "auto !important" },
  imageWrapper: { height: "100%", width: "auto !important" },
  figure: { height: "100%", width: "auto !important" },
};

const MainScreen = () => {
  const { kiosk_id } = useParams();

  const [data, setData] = useState<MainScreenData>();
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  // const [displayedModule, ]

  let __mount = true;
  useEffect(() => {
    if (__mount && !data) {
      getData();
    }
    __mount = false;
  });

  const getData = async () => {
    const rec = await pb.collection("kiosk_x_modules").getFullList({
      filter: `kiosk = "${kiosk_id}"`,
      expand: `module`,
    });
    rec.forEach((record) => {
      let { expand, kiosk, module, ...rest } = record;
      let d: MainScreenData = {
        ...rest,
        kiosk: kiosk,
        module: expand.module.map((v: any) => ({
          collectionId: v.collectionId,
          collectionName: v.collectionName,
          created: v.created,
          updated: v.updated,
          id: v.id,
          icon: v.icon,
          icon_text: v.icon_text,
          metadata: v.metadata,
          module: v.module,
          title: v.title,
          type: v.type,
        })),
      };
      setData(d);
    });
  };

  return (
    <Box className={style.container}>
      <Box className={style.main_pic}>
        <Carousel
          className={style.carousel}
          height={"100%"}
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
        >
          {data?.module &&
            data.module.map((d) => (
              <Carousel.Slide className={style.slide}>
                {d.type === "image" ? (
                  <Image
                    styles={() => imageStyle}
                    src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/modules/${d.id}/${d.module}`}
                    alt={d.title}
                    height={"100%"}
                  />
                ) : (
                  <video height={"auto"}>
                    <source
                      src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/modules/${d.id}/${d.module}`}
                      type={"video/mp4"}
                    />
                  </video>
                )}
              </Carousel.Slide>
            ))}
        </Carousel>
      </Box>
      <Box className={style.kiosk_module_section}>
        <ModuleNav modules={data?.module} />
      </Box>
    </Box>
  );
};

export default MainScreen;
