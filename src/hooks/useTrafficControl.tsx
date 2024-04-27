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
type TimerId = number | null;
type State = [LightState, RequestState, TimerId];

const initialState: State = ["GRR", false, null]; // grün, rot, rot, keine Anfrage, kein Timer

const transitions = {
  GRR: { NEXT: ["YRR", false, 1000], REQUEST: ["YRR", true, 1000] },
  YRR: { NEXT: ["RXR", false, 2000], REQUEST: ["RRG", false, 5000] },
  RXR: { NEXT: ["RGR", false, 5000], REQUEST: ["RYR", true, 1000] },
  RGR: { NEXT: ["RYR", false, 1000], REQUEST: ["RYR", true, 1000] },
  RYR: { NEXT: ["XRR", false, 2000], REQUEST: ["RRG", false, 5000] },
  XRR: { NEXT: ["GRR", false, 5000], REQUEST: ["YRR", true, 1000] },
  RRG: { NEXT: ["XRR", false, 2000], REQUEST: ["GRR", false, 5000] },
};

export const useTrafficControl = () => {
  const reducer = (state: State, action: Action): State => {
    if (action === Action.START) {
      return setAndScheduleNextState("GRR", false, 5000, null);
    }
    if (action === Action.STOP) {
      return initialState;
    }
    const [lightState, _, timerId] = state;
    const nextState = transitions[lightState][action] as [
      LightState,
      RequestState,
      number
    ];
    return setAndScheduleNextState(...nextState, timerId);
  };
  const setAndScheduleNextState = (
    lightState: LightState,
    request: RequestState,
    delay: number,
    timerId: TimerId
  ): State => {
    clearTimeout(Number(timerId));
    const newTimerId = setTimeout(() => {
      request ? dispatch(Action.REQUEST) : dispatch(Action.NEXT);
    }, delay);
    return [lightState, request, Number(newTimerId)];
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const [lights, setLights] = useState({
    main: TrafficLightColor.G,
    side: TrafficLightColor.R,
    pedestrian: PedestrianLightColor.R,
  });
  const [isActive, setIsActive] = useState(false);
  const [isRequest, setIsRequest] = useState(false);

  const handleStart = () => {
    dispatch(Action.START);
  };

  const handleRequest = () => {
    if (state[1]) return;
    dispatch(Action.REQUEST);
  };

  const handleStop = () => {
    if (state[2] !== null) {
      clearTimeout(state[2]);
    }
    dispatch(Action.STOP);
  };

  useEffect(() => {
    setLights({
      main: TrafficLightColor[state[0][0] as keyof typeof TrafficLightColor],
      side: TrafficLightColor[state[0][1] as keyof typeof TrafficLightColor],
      pedestrian: PedestrianLightColor[state[0][2] as keyof typeof PedestrianLightColor],
    });
    setIsActive(state[2] !== null);
    setIsRequest(state[1]);
  }, [state[0], state[1], state[2]]);

  return {
    lights,
    handleStart,
    handleRequest,
    handleStop,
    isActive,
    isRequest,
  };
};
