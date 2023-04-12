import { useState } from "react";
import { Alert, Box, Button } from "@mantine/core";

function App() {
  const [display, show] = useState(false);

  const onClick = () => {
    show(!display);
  };

  return (
    <Box
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
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
    </Box>
  );
}

export default App;
