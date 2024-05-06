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

export enum Action {
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
export type State = {
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
    REQUEST: { lightState: "YRR", requestState: true, delay: 1000 },
  },
  YRR: {
    NEXT: { lightState: "RXR", requestState: false, delay: 2000 },
    REQUEST: { lightState: "RRG", requestState: false, delay: 5000 },
  },
  RXR: {
    NEXT: { lightState: "RGR", requestState: false, delay: 5000 },
    REQUEST: { lightState: "RYR", requestState: true, delay: 1000 },
  },
  RGR: {
    NEXT: { lightState: "RYR", requestState: false, delay: 1000 },
    REQUEST: { lightState: "RYR", requestState: false, delay: 1000 },
  },
  RYR: {
    NEXT: { lightState: "XRR", requestState: false, delay: 2000 },
    REQUEST: { lightState: "RRG", requestState: true, delay: 5000 },
  },
  XRR: {
    NEXT: { lightState: "GRR", requestState: false, delay: 5000 },
    REQUEST: { lightState: "YRR", requestState: true, delay: 1000 },
  },
  RRG: {
    NEXT: { lightState: "XRR", requestState: false, delay: 2000 },
    REQUEST: { lightState: "XRR", requestState: true, delay: 2000 },
  },
};

export const useTrafficControl = () => {
  const reducer = (state: State, action: Action): State => {
    if (state.timerId) clearTimeout(state.timerId);

    switch (action) {
      case Action.START: {
        const timerId: TimerId = setTimeout(() => {
          dispatch(Action.NEXT);
        }, 5000);
        return { ...initialState, timerId };
      }

      case Action.STOP:
        return initialState;

      case Action.NEXT:
      case Action.REQUEST: {
        const transition = transitions[state.lightState][action];
        if (!transition) {
          throw new Error(`Invalid action ${action} for state ${state.lightState}`);
        }
        const { lightState, requestState, delay } = transition;
        const timerId: TimerId = setTimeout(() => {
          dispatch(requestState ? Action.REQUEST : Action.NEXT);
        }, delay);
        return { lightState, requestState, timerId };
      }

      default:
        throw new Error(`Unhandled action type: ${action}`);
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  
  const [lights, setLights] = useState({
    main: TrafficLightColor.G,
    side: TrafficLightColor.R,
    pedestrian: PedestrianLightColor.R,
  });

  const mapTrafficLightColor = (char: string): TrafficLightColor => {
    switch (char) {
      case "G":
        return TrafficLightColor.G;
      case "Y":
        return TrafficLightColor.Y;
      case "R":
        return TrafficLightColor.R;
      case "X":
        return TrafficLightColor.X;
      default:
        throw new Error("Invalid Traffic Light Color");
    }
  };

  const mapPedestrianLightColor = (char: String): PedestrianLightColor => {
    switch (char) {
      case "G":
        return PedestrianLightColor.G;
      case "R":
        return PedestrianLightColor.R;
      default:
        throw new Error(`Not valid character: ${char}.`);
    }
  };

  useEffect(() => {
    setLights({
      main: mapTrafficLightColor(state.lightState[0]),
      side: mapTrafficLightColor(state.lightState[1]),
      pedestrian: mapPedestrianLightColor(state.lightState[2]),
    });
  }, [state.lightState]);

  return {
    lights,
    state,
    dispatch,
  };
};
