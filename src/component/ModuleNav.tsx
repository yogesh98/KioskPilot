import { Box, Image, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { FC, useEffect } from "react";
import { modules } from "../lib/types";
import style from "../styles/module_nav.module.css";

type Props = {
  modules: Array<modules> | undefined;
  index: number;
  changeSlide: (i: number) => void;
};

const ModuleNav: FC<Props> = ({ modules, index, changeSlide }) => {
  return (
    <Box className={style.modules_menu}>
      {modules &&
        modules.map((v, i) => (
          <Box key={i} className={style.nav_items} onClick={() => changeSlide(i)}>
            <motion.div
              initial={{ marginLeft: 10 }}
              animate={i === index ? { marginLeft: 20 } : {}}
              transition={{ type: "spring" }}
            >
              <Image
                src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/modules/${v.id}/${v.icon}`}
                alt={v.icon_text}
                height={50}
                width={50}
              />
            </motion.div>
            <Text>{v.title}</Text>
            {i === index ? <motion.div layoutId={"selector"} className={style.selector} /> : null}
          </Box>
        ))}
    </Box>
  );
};

export default ModuleNav;
