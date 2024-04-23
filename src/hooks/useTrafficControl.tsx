import { useState } from "react";

export enum LightColor {
  Green = "green",
  Yellow = "yellow",
  Red = "red",
  RedYellow = "red-yellow",
}

export enum PedestrianLightColor {
  Walk = "green",
  Stand = "red",
}

export const useTrafficControl = () => {
  const [mainStreetLight, setMainStreetLight] = useState(LightColor.Green);
  const [sideStreetLight, setSideStreetLight] = useState(LightColor.Red);
  const [pedestrianLight, setPedestrianLight] = useState(
    PedestrianLightColor.Stand
  );
  const [pedestrianRequest, setPedestrianRequest] = useState(false);

  return {
    mainStreetLight,
    setMainStreetLight,
    sideStreetLight,
    setSideStreetLight,
    pedestrianLight,
    setPedestrianLight,
    pedestrianRequest,
    setPedestrianRequest,
  };
};
