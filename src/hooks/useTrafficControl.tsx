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

type Transition = {
  lightState: LightState;
  requestState: boolean;
  delay: number;
};

type LightState =
  | "GRR" // green, red, red - ANFANGSZUSTAND
  | "YRR" // yellow, red, red
  | "RXR" // red, red-yellow, red
  | "RGR" // red, green, red
  | "RYR" // red, yellow, red
  | "XRR" // red-yellow, red, red - ENDZUSTAND
  | "RRG"; // red, red, green
type TimerId = NodeJS.Timeout | null;
type State = {
  lightState: LightState;
  requestState: boolean;
  timerId: TimerId;
};

const initialState: State = {
  lightState: "GRR",
  requestState: false,
  timerId: null,
}; // grün, rot, rot, keine Anfrage, kein Timer

const transitions: { [key in LightState]: { [key in Action]?: Transition } } = {
  GRR: {
    NEXT: { lightState: "YRR", requestState: false, delay: 1000 },
    REQUEST: { lightState: "RRG", requestState: false, delay: 5000 },
  },
  YRR: {
    NEXT: { lightState: "RXR", requestState: false, delay: 2000 },
    REQUEST: { lightState: "RYR", requestState: true, delay: 1000 },
  },
  RXR: {
    NEXT: { lightState: "RGR", requestState: false, delay: 5000 },
    REQUEST: { lightState: "RYR", requestState: true, delay: 1000 },
  },
  RGR: {
    NEXT: { lightState: "RYR", requestState: false, delay: 1000 },
    REQUEST: { lightState: "RRG", requestState: false, delay: 5000 },
  },
  RYR: {
    NEXT: { lightState: "XRR", requestState: false, delay: 2000 },
    REQUEST: { lightState: "YRR", requestState: true, delay: 1000 },
  },
  XRR: {
    NEXT: { lightState: "GRR", requestState: false, delay: 5000 },
    REQUEST: { lightState: "YRR", requestState: true, delay: 1000 },
  },
  RRG: {
    NEXT: { lightState: "GRR", requestState: false, delay: 5000 },
    REQUEST: { lightState: "YRR", requestState: true, delay: 1000 },
  },
};

export const useTrafficControl = () => {
  const reducer = (state: State, action: Action): State => {
    if (state.timerId) clearTimeout(state.timerId);
    if (action === Action.START) {
      return setAndScheduleNextState(initialState, 5000);
    }
    if (action === Action.STOP) {
      return initialState;
    }
    const transition = transitions[state.lightState][action];
    if (!transition) {
      throw new Error(`Invalid action ${action} for state ${state.lightState}`);
    }
    const { lightState, requestState, delay } = transition;
    return setAndScheduleNextState(
      { lightState, requestState, timerId: null },
      delay
    );
  };
  const setAndScheduleNextState = (state: State, delay: number): State => {
    const timerId: TimerId = setTimeout(() => {
      state.requestState ? dispatch(Action.REQUEST) : dispatch(Action.NEXT);
    }, delay);
    return { ...state, timerId };
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
    if (state.requestState) return;
    dispatch(Action.REQUEST);
  };

  const handleStop = () => {
    dispatch(Action.STOP);
  };

  useEffect(() => {
    setLights({
      main: TrafficLightColor[
        state.lightState[0] as keyof typeof TrafficLightColor
      ],
      side: TrafficLightColor[
        state.lightState[1] as keyof typeof TrafficLightColor
      ],
      pedestrian:
        PedestrianLightColor[
          state.lightState[2] as keyof typeof PedestrianLightColor
        ],
    });
    setIsActive(state.timerId !== null);
    setIsRequest(state.requestState);
  }, [state.lightState, state.requestState, state.timerId]);

  return {
    lights,
    handleStart,
    handleRequest,
    handleStop,
    isActive,
    isRequest,
  };
};
