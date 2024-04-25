import { useState, useEffect, useReducer } from "react";

export enum TrafficLightColor {
  G = "green",
  Y = "yellow",
  R = "red",
  X = "red-yellow",
}

export enum PedestrianLightColor {
  G = "green",
  R = "red",
}

enum Action {
  START = "START",
  STOP = "STOP",
  NEXT = "NEXT",
  REQUEST = "REQUEST",
}

type LightState =
  | "GRR" // green, red, red - ANFANGSZUSTAND
  | "YRR" // yellow, red, red
  | "RXR" // red, red-yellow, red
  | "RGR" // red, green, red
  | "RYR" // red, yellow, red
  | "XRR" // red-yellow, red, red - ENDZUSTAND
  | "RRG"; // red, red, green
type RequestState = boolean; // true, wenn Fußgängeranfrage
type TimerId = NodeJS.Timeout | null;
type State = [LightState, RequestState, TimerId];

const initialState: State = ["GRR", false, null]; // grün, rot, rot, keine Anfrage, kein Timer

export const useTrafficControl = () => {
  const reducer = (state: State, action: Action): State => {
    switch (action) {
      case Action.START:
        return setAndScheduleNextState("GRR", false, 5000, null);
      case Action.STOP:
        return ["GRR", false, null];
      case Action.NEXT:
        switch (state[0]) {
          case "GRR":
            return setAndScheduleNextState("YRR", false, 1000, state[2]);
          case "YRR":
            return setAndScheduleNextState("RXR", false, 2000, state[2]);
          case "RXR":
            return setAndScheduleNextState("RGR", false, 5000, state[2]);
          case "RGR":
            return setAndScheduleNextState("RYR", false, 1000, state[2]);
          case "RYR":
            return setAndScheduleNextState("XRR", false, 2000, state[2]);
          case "XRR":
            return setAndScheduleNextState("GRR", false, 5000, state[2]);
          case "RRG":
            return setAndScheduleNextState("XRR", false, 2000, state[2]);
          default:
            return ["GRR", false, null];
        }
      case Action.REQUEST:
        switch (state[0]) {
          case "GRR":
            return setAndScheduleNextState("YRR", true, 1000, state[2]);
          case "YRR":
            return setAndScheduleNextState("RRG", false, 5000, state[2]);
          case "RXR":
            return setAndScheduleNextState("RYR", true, 1000, state[2]);
          case "RGR":
            return setAndScheduleNextState("RYR", true, 1000, state[2]);
          case "RYR":
            return setAndScheduleNextState("RRG", false, 5000, state[2]);
          case "XRR":
            return setAndScheduleNextState("YRR", true, 1000, state[2]);
          case "RRG":
            return setAndScheduleNextState("GRR", false, 5000, state[2]);
          default:
            return ["GRR", false, null];
        }
      default:
        return ["GRR", false, null];
    }
  };
  const setAndScheduleNextState = (
    lightState: LightState,
    request: RequestState,
    delay: number,
    timerId: TimerId
  ): State => {
    clearTimeout(String(timerId)); 
    const newTimerId = setTimeout(() => {
      request ? dispatch(Action.REQUEST) : dispatch(Action.NEXT);
    }, delay);
    return [lightState, request, newTimerId];
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const [mainStreetLight, setMainStreetLight] = useState<TrafficLightColor>(
    TrafficLightColor.G
  );
  const [sideStreetLight, setSideStreetLight] = useState<TrafficLightColor>(
    TrafficLightColor.R
  );
  const [pedestrianLight, setPedestrianLight] = useState<PedestrianLightColor>(
    PedestrianLightColor.R
  );
  const [isActive, setIsActive] = useState(false);
  const [isRequest, setIsRequest] = useState(false);

  const handleStart = () => {
    dispatch(Action.START);
  };

  const handleRequest = () => {
    if (isRequest) return;
    setIsRequest(true);
    dispatch(Action.REQUEST);
  };

  const handleStop = () => {
    if (state[2] !== null) {
      clearTimeout(state[2] as NodeJS.Timeout);
    }
    dispatch(Action.STOP);
  };

  useEffect(() => {
    setMainStreetLight(
      TrafficLightColor[state[0][0] as keyof typeof TrafficLightColor]
    );
    setSideStreetLight(
      TrafficLightColor[state[0][1] as keyof typeof TrafficLightColor]
    );
    setPedestrianLight(
      PedestrianLightColor[state[0][2] as keyof typeof PedestrianLightColor]
    );
    setIsActive(state[2] !== null);
    setIsRequest(state[1]);
  }, [state]);

  return {
    mainStreetLight,
    sideStreetLight,
    pedestrianLight,
    handleStart,
    handleRequest,
    handleStop,
    isActive,
    isRequest,
  };
};
