import { useState, useEffect, useReducer } from "react";

export enum LightColor {
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
  | "GRR" // green, red, red - INITIAL STATE
  | "YRR" // yellow, red, red
  | "RXR" // red, red-yellow, red
  | "RGR" // red, green, red
  | "RYR" // red, yellow, red
  | "XRR" // red-yellow, red, red - CYCLE COMPLETE
  | "RRG"; // red, red, green - PEDESTRIAN LIGHT
type RequestState = boolean; // true if pedestrian requested
type TimerId = NodeJS.Timeout | null;
type State = [LightState, RequestState, TimerId];

const initialState: State = ["GRR", false, null];

export const useTrafficControl = () => {
  
  const reducer = (state: State, action: Action): State => {
    switch (action) {
      case Action.START:
        return setAndScheduleNextState("GRR", 5000, null);
      case Action.STOP:
        return ["GRR", false, null];
      case Action.NEXT:
        switch (state[0]) {
          case "GRR":
            return setAndScheduleNextState("YRR", 1000, state[2]);
          case "YRR":
            return setAndScheduleNextState("RXR", 2000, state[2]);
          case "RXR":
            return setAndScheduleNextState("RGR", 5000, state[2]);
          case "RGR":
            return setAndScheduleNextState("RYR", 1000, state[2]);
          case "RYR":
            return setAndScheduleNextState("XRR", 2000, state[2]);
          case "XRR":
            return setAndScheduleNextState("GRR", 5000, state[2]);
          case "RRG":
            return setAndScheduleNextState("GRR", 5000, state[2]);
          default:
            return ["GRR", false, null];
        }
      case Action.REQUEST:
        return setAndScheduleNextState("RRG", 5000, state[2]);
      case Action.STOP:
        return ["GRR", false, null];
      default:
        return ["GRR", false, null];
    }
  };
  const setAndScheduleNextState = (
    lightState: LightState,
    delay: number,
    timerId: TimerId
  ) => {
    clearTimeout(String(timerId));
    const newTimerId = setTimeout(() => {
      dispatch(Action.NEXT);
    }, delay);
    return [lightState, false, newTimerId];
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const [mainStreetLight, setMainStreetLight] = useState<LightColor>(
    LightColor.G
  );
  const [sideStreetLight, setSideStreetLight] = useState<LightColor>(
    LightColor.R
  );
  const [pedestrianLight, setPedestrianLight] = useState<PedestrianLightColor>(
    PedestrianLightColor.R
  );



  const handleStart = () => {
    dispatch(Action.START);
  };

  const handleRequest = () => {
    dispatch(Action.REQUEST);
  };

  const handleStop = () => {
    if (state[2] !== null) {
      clearTimeout(state[2] as NodeJS.Timeout);
    }
    dispatch(Action.STOP);
  };

  useEffect(() => {
    setMainStreetLight(LightColor[state[0][0] as keyof typeof LightColor]);
    setSideStreetLight(LightColor[state[0][1] as keyof typeof LightColor]);
    setPedestrianLight(
      PedestrianLightColor[state[0][2] as keyof typeof PedestrianLightColor]
    );
  }, [state]);

  return {
    mainStreetLight,
    sideStreetLight,
    pedestrianLight,
    handleStart,
    handleRequest,
    handleStop,
  };
};
