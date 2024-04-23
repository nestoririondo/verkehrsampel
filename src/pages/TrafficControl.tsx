import {
  LightColor,
  useTrafficControl,
  PedestrianLightColor,
} from "../context/TrafficControlContext";
import TrafficLight from "../components/TrafficLight";
import PedestrianLight from "../components/PedestrianLight";
import { useRef, useEffect, useState } from "react";
import { Button, Container, Typography } from "@mui/material";

const TrafficControl = () => {
  const [start, setStart] = useState(false);

  const {
    mainStreetLight,
    setMainStreetLight,
    sideStreetLight,
    setSideStreetLight,
    pedestrianLight,
    setPedestrianLight,
    pedestrianRequest,
    setPedestrianRequest,
  } = useTrafficControl();

  const abortController = useRef(new AbortController());

  const delay = (ms: number) => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(resolve, ms);
      abortController.current.signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject();
      });
    });
  };

  const handleStart = () => {
    if (start) {
      resetTraffic();
    }
    setStart((prev) => !prev);
  };

  const resetTraffic = () => {
    abortController.current.abort();
    abortController.current = new AbortController();
    setMainStreetLight(LightColor.Green);
    setSideStreetLight(LightColor.Red);
    setPedestrianLight(PedestrianLightColor.Stand);
    setPedestrianRequest(false);
  };

  const turnTrafficLightRed = async (
    setter: {
      (light: LightColor): void;
    },
    timeToWait: number
  ) => {
    await delay(timeToWait);
    setter(LightColor.Yellow);
    await delay(1000);
    setter(LightColor.Red);
  };

  const turnTrafficLightGreen = async (setter: {
    (light: LightColor): void;
  }) => {
    if (pedestrianRequest) return;
    setter(LightColor.RedYellow);
    await delay(2000);
    setter(LightColor.Green);
  };

  const controlTraffic = async () => {
    if (mainStreetLight === LightColor.Green) {
      await turnTrafficLightRed(setMainStreetLight, 2000);
      await turnTrafficLightGreen(setSideStreetLight);
    }
    if (sideStreetLight === LightColor.Green) {
      await turnTrafficLightRed(setSideStreetLight, 5000);
      await turnTrafficLightGreen(setMainStreetLight);
    }
  };

  const stopTraffic = async () => {
    abortController.current.abort();
    abortController.current = new AbortController();
    turnTrafficLightRed(setMainStreetLight, 0);
    await turnTrafficLightRed(setSideStreetLight, 0);
  };

  const handleRequest = async () => {
    if (pedestrianRequest) return;
    setPedestrianRequest(true);
    await stopTraffic();
    setPedestrianLight(PedestrianLightColor.Walk);
    await delay(5000);
    setPedestrianRequest(false);
    setPedestrianLight(PedestrianLightColor.Stand);
    turnTrafficLightGreen(setMainStreetLight);
  };

  useEffect(() => {
    if (!start) return;
    if (pedestrianRequest) return;
    if (pedestrianLight === PedestrianLightColor.Walk) return;
    controlTraffic();
  }, [mainStreetLight, sideStreetLight, start]);

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
      <Button variant="contained" onClick={handleStart}>
        {start ? "Stop" : "Start"}
      </Button>
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
          handleRequest={handleRequest}
          pedestrianLight={pedestrianLight}
          start={start}
        />
      </Container>
    </Container>
  );
};

export default TrafficControl;
