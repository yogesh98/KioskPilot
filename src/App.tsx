import { useState } from "react";
import { Alert, Box, Button } from "@mantine/core";
import { motion } from "framer-motion";

function App() {
  const [display, show] = useState(false);

  const onClick = () => {
    show(!display);
  };

  return (
    <motion.div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
      initial={{ scale: 0 }}
      animate={{ rotate: 360, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <Button
        onClick={onClick}
        style={{
          width: "10%",
          marginBottom: "1rem",
        }}
      >
        Show
      </Button>
      {display ? (
        <Alert title="👋" color="green">
          Hello World!
        </Alert>
      ) : null}
    </motion.div>
  );
}

export default App;
