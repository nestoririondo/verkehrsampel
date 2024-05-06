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

enum Delay {
  SHORT = 1000,
  MEDIUM = 2000,
  LONG = 5000,
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
type State = {
  lightState: LightState;
  requestState: RequestState;
  timerId: TimerId;
};

const initialState: State = {
  lightState: "GRR",
  requestState: false,
  timerId: null,
}; // grün, rot, rot, keine Anfrage, kein Timer

const transitions = {
  GRR: {
    NEXT: { lightState: "YRR", requestState: false, delay: Delay.SHORT },
    REQUEST: { lightState: "YRR", requestState: true, delay: Delay.SHORT },
  },
  YRR: {
    NEXT: { lightState: "RXR", requestState: false, delay: Delay.MEDIUM },
    REQUEST: { lightState: "RRG", requestState: true, delay: Delay.LONG },
  },
  RXR: {
    NEXT: { lightState: "RGR", requestState: false, delay: Delay.LONG },
    REQUEST: { lightState: "RYR", requestState: true, delay: Delay.SHORT },
  },
  RGR: {
    NEXT: { lightState: "RYR", requestState: false, delay: Delay.SHORT },
    REQUEST: { lightState: "RYR", requestState: true, delay: Delay.SHORT },
  },
  RYR: {
    NEXT: { lightState: "XRR", requestState: false, delay: Delay.MEDIUM },
    REQUEST: { lightState: "RRG", requestState: true, delay: Delay.LONG },
  },
  XRR: {
    NEXT: { lightState: "GRR", requestState: false, delay: Delay.LONG },
    REQUEST: { lightState: "YRR", requestState: true, delay: Delay.SHORT },
  },
};

export const useTrafficControl = () => {
  const reducer = (state: State, action: Action): State => {
    if (state.timerId) clearTimeout(state.timerId);
    switch (action) {
      case Action.START:
        const newTimerId = setTimeout(() => dispatch(Action.NEXT), Delay.LONG);
        return { ...initialState, timerId: newTimerId };
      case Action.STOP:
        return initialState;
      case Action.NEXT:


      case Action.REQUEST:
        const nextState = transitions[state.lightState][action];
        const nextTimerId = setTimeout(() => {
          action === Action.NEXT
            ? dispatch(Action.NEXT)
            : dispatch(Action.REQUEST);
        }, nextState.delay);
        return { ...nextState, timerId: nextTimerId };

      default:
        throw new Error(`Invalid action: ${action}`);
    }
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
    if (state.requestState) return;
    dispatch(Action.REQUEST);
  };

  const handleStop = () => {
    dispatch(Action.STOP);
  };

  useEffect(() => {
    setMainStreetLight(
      TrafficLightColor[state.lightState[0] as keyof typeof TrafficLightColor]
    );
    setSideStreetLight(
      TrafficLightColor[state.lightState[1] as keyof typeof TrafficLightColor]
    );
    setPedestrianLight(
      PedestrianLightColor[
        state.lightState[2] as keyof typeof PedestrianLightColor
      ]
    );
    setIsActive(state.timerId !== null);
    setIsRequest(state.requestState);
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
