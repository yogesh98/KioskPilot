import { AppShell, Button, Header, Navbar, Stack } from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";

function Navs() {
  const navigate = useNavigate();

  return (
    <Navbar width={{ base: 300 }} height={"100%"} p="xs">
      <Stack>
        <Button onClick={() => navigate("kiosks")}>Kiosks</Button>
        <Button onClick={() => navigate("modules")}>Modules</Button>
        <Button onClick={() => navigate("assign")}>
          Assign Modules to Kiosk
        </Button>
      </Stack>
    </Navbar>
  );
}

export default function App() {
  return (
    <AppShell
      padding="md"
      navbar={<Navs />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Outlet />
    </AppShell>
  );
}
