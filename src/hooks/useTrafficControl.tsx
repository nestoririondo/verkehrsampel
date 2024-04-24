import { useState, useEffect } from "react";

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

type RequestState = boolean;
type TimerId = NodeJS.Timeout | undefined;

type State = [LightState, RequestState, TimerId];

export const useTrafficControl = () => {
  const [state, setState] = useState<State>(["GRR", false, undefined]);
  const [mainStreetLight, setMainStreetLight] = useState<LightColor>(
    LightColor.G
  );
  const [sideStreetLight, setSideStreetLight] = useState<LightColor>(
    LightColor.R
  );
  const [pedestrianLight, setPedestrianLight] = useState<PedestrianLightColor>(
    PedestrianLightColor.Stand
  );

  const setAndScheduleNextState = (
    lightState: LightState,
    delay: number,
    timerId: TimerId
  ) => {
    clearTimeout(String(timerId));
    const newTimerId = setTimeout(() => {
      setState((prev) => {
        return processState(prev, Action.NEXT);
      });
    }, delay);
    return [lightState, false, newTimerId];
  };

  const processState = (state: State, action: Action) => {
    switch (action) {
      case Action.START:
        return setAndScheduleNextState("GRR", 5000, undefined);
      case Action.STOP:
        return ["GRR", false, undefined];
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
            return ["GRR", false, undefined];
        }
      case Action.REQUEST:
        return setAndScheduleNextState("RRG", 5000, state[2]);
      case Action.STOP:
        return ["GRR", false, undefined];
      default:
        return ["GRR", false, undefined];
    }
  };

  const handleStart = () => {
    setState((state) => {
      return processState(state, Action.START);
    });
  };

  const handleRequest = () => {
    setState((state) => {
      return processState(state, Action.REQUEST);
    });
  };

  const handleStop = () => {
    clearTimeout(state[2]);
    setState((state) => {
      return processState(state, Action.STOP);
    });
  };

  useEffect(() => {
    setMainStreetLight(LightColor[state[0][0] as keyof typeof LightColor]);
    setSideStreetLight(LightColor[state[0][1] as keyof typeof LightColor]);
    setPedestrianLight(
      PedestrianLightColor[state[0][2] as keyof typeof PedestrianLightColor]
    );
    console.log(state);
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
