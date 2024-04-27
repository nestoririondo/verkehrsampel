import TrafficLight from "../components/TrafficLight";
import PedestrianLight from "../components/PedestrianLight";
import { Button, Container, Typography } from "@mui/material";
import { useTrafficControl } from "../hooks/useTrafficControl";

const TrafficControl = () => {
  const {
    lights,
    handleStart,
    handleRequest,
    handleStop,
    isActive,
    isRequest
  } = useTrafficControl();

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      <Typography variant="h3" sx={{ mt: 4 }}>
        Verkehrsampel
      </Typography>
      {!isActive ? (
        <Button variant="contained" onClick={handleStart}>
          Start
        </Button>
      ) : (
        <Button variant="outlined" onClick={handleStop}>
          Stop
        </Button>
      )}
      <Container
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TrafficLight light={lights.main} name="Hauptstraße" />
        <TrafficLight light={lights.side} name="Nebenstraße" />
        <PedestrianLight
          pedestrianLight={lights.pedestrian}
          handleRequest={handleRequest}
          isRequest={isRequest}
          isActive={isActive}
        />
      </Container>
    </Container>
  );
};

export default TrafficControl;
