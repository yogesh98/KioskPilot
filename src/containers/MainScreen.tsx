import { Box } from "@mantine/core";
import style from "../styles/main.module.css";
import ModuleNav from "../component/ModuleNav";

const MainScreen = () => {
  return (
    <Box className={style.container}>
      <Box className={style.main_pic}></Box>
      <Box className={style.kiosk_module_section}>
        <ModuleNav />
      </Box>
    </Box>
  );
};

export default MainScreen;
