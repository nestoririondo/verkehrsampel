import TrafficLight from "../components/TrafficLight";
import PedestrianLight from "../components/PedestrianLight";
import { Button, Container, Typography } from "@mui/material";
import { useTrafficControl } from "../hooks/useTrafficControl";
import { useState } from "react";

const TrafficControl = () => {
  const {
    mainStreetLight,
    sideStreetLight,
    pedestrianLight,
    handleStart,
    handleRequest,
    handleStop,
    isActive,
    isRequest,
  } = useTrafficControl();

  const [startRequest, setStartRequest] = useState(false);

  const handleClickStart = (action: String) => {
    if (startRequest) return;
    setStartRequest(true);
    setTimeout(() => {
      action === "start" ? handleStart() : handleStop();
      setStartRequest(false);
    }, 300);
  };

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
        <Button variant="contained" onClick={() => handleClickStart("start")}>
          Start
        </Button>
      ) : (
        <Button variant="outlined" onClick={() => handleClickStart("stop")}>
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
        <TrafficLight light={mainStreetLight} name="Hauptstraße" />
        <TrafficLight light={sideStreetLight} name="Nebenstraße" />
        <PedestrianLight
          pedestrianLight={pedestrianLight}
          handleRequest={handleRequest}
          isRequest={isRequest}
          isActive={isActive}
        />
      </Container>
    </Container>
  );
};

export default TrafficControl;
