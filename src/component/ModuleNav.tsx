import { Box, Text, Image } from "@mantine/core";
import style from "../styles/module_nav.module.css";
import { FC } from "react";
import { modules } from "../lib/types";

const ModuleNav: FC<{ modules: Array<modules> | undefined }> = ({ modules }) => {
  return (
    <Box className={style.modules_menu}>
      {modules &&
        modules.map((v) => (
          <Box className={style.nav_items}>
            <Box>
              <Image
                src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/modules/${v.id}/${v.icon}`}
                alt={v.icon_text}
                height={"5rem"}
                width={"5rem"}
              />
            </Box>
            <Text>{v.title}</Text>
          </Box>
        ))}
    </Box>
  );
};

export default ModuleNav;
