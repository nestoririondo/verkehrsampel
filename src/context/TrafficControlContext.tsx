import { createContext, useState, useContext } from "react";

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

type TrafficControlContextType = {
  mainStreetLight: LightColor;
  setMainStreetLight: (light: LightColor) => void;
  sideStreetLight: LightColor;
  setSideStreetLight: (light: LightColor) => void;
  pedestrianLight: PedestrianLightColor;
  setPedestrianLight: (light: PedestrianLightColor) => void;
  pedestrianRequest: boolean;
  setPedestrianRequest: (request: boolean) => void;
};

type TrafficControlProviderProps = {
  children: React.ReactNode;
};

const initialState: TrafficControlContextType = {
  mainStreetLight: LightColor.Green,
  setMainStreetLight: () => {},
  sideStreetLight: LightColor.Red,
  setSideStreetLight: () => {},
  pedestrianLight: PedestrianLightColor.Stand,
  setPedestrianLight: () => {},
  pedestrianRequest: false,
  setPedestrianRequest: () => {},
};

const TrafficControlContext = createContext<TrafficControlContextType>(initialState);

export const useTrafficControl = () => useContext(TrafficControlContext);

export const TrafficControlProvider = ({
  children,
}: TrafficControlProviderProps) => {
  const [mainStreetLight, setMainStreetLight] = useState(LightColor.Green);
  const [sideStreetLight, setSideStreetLight] = useState(LightColor.Red);
  const [pedestrianLight, setPedestrianLight] = useState(
    PedestrianLightColor.Stand
  );
  const [pedestrianRequest, setPedestrianRequest] = useState(false);

  const value = {
    mainStreetLight,
    setMainStreetLight,
    sideStreetLight,
    setSideStreetLight,
    pedestrianLight,
    setPedestrianLight,
    pedestrianRequest,
    setPedestrianRequest,
  };

  return (
    <TrafficControlContext.Provider value={value}>
      {children}
    </TrafficControlContext.Provider>
  );
};
