import { Carousel, Embla } from "@mantine/carousel";
import { Box, Image } from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ModuleNav from "../component/ModuleNav";
import pb from "../lib/pocketbase";
import { MainScreenData } from "../lib/types";
import style from "../styles/main.module.css";

const imageStyle = {
  root: { height: "100%", width: "auto !important" },
  imageWrapper: { height: "100%", width: "auto !important" },
  figure: { height: "100%", width: "auto !important" },
};

const MainScreen = () => {
  const { kiosk_id } = useParams();

  const [data, setData] = useState<MainScreenData>();
  const [embla, setEmbla] = useState<Embla>();
  const [slide, setSlide] = useState<number>(0);
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

  useEffect(() => {
    if (embla) {
      embla.on("scroll", onSlideChange);
    }
  }, [embla]);

  const onSlideChange = () => {
    if (!embla) return;
    const index: Array<number> = embla.slidesInView();
    if (index.length === 1) setSlide(index[0]);
  };

  const changeSlide = (i: number) => {
    if (!embla) return;
    embla.scrollTo(i);
    autoplay.current.stop();
    setTimeout(autoplay.current.reset, 30000);
    setSlide(i);
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
          withControls={false}
          getEmblaApi={setEmbla}
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
        <ModuleNav modules={data?.module} index={slide} changeSlide={changeSlide} />
      </Box>
    </Box>
  );
};

export default MainScreen;
