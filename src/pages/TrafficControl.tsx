import {
  LightColor,
  useTrafficControl,
  PedestrianLightColor,
} from "../context/TrafficControlContext";
import TrafficLight from "../components/TrafficLight";
import PedestrianLight from "../components/PedestrianLight";
import { useRef, useEffect } from "react";
import { Container, Typography } from "@mui/material";

const TrafficControl = () => {
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
    if (pedestrianRequest) return;
    if (pedestrianLight === PedestrianLightColor.Walk) return;
    controlTraffic();
  }, [mainStreetLight, sideStreetLight]);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3" sx={{ p: 5 }}>
        Traffic Lights Demo
      </Typography>
      <Container
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TrafficLight light={mainStreetLight} />
        <TrafficLight light={sideStreetLight} />
        <PedestrianLight
          handleRequest={handleRequest}
          pedestrianLight={pedestrianLight}
        />
      </Container>
    </Container>
  );
};

export default TrafficControl;
