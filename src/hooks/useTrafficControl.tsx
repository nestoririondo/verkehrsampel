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

enum LightState {
  GRR = "GRR",
  YRR = "YRR",
  RXR = "RXR",
  RGR = "RGR",
  RYR = "RYR",
  XRR = "XRR",
  RRG = "RRG",
}

enum Delay {
  SHORT = 1000,
  MEDIUM = 2000,
  LONG = 5000,
}

type RequestState = boolean; // true, wenn Fußgängeranfrage
type TimerId = NodeJS.Timeout | null;
type State = {
  lightState: LightState;
  requestState: RequestState;
  timerId: TimerId;
};

const initialState: State = {
  lightState: LightState.GRR,
  requestState: false,
  timerId: null,
}; // grün, rot, rot, keine Anfrage, kein Timer

const transitions = {
  [LightState.GRR]: {
    [Action.NEXT]: {
      lightState: LightState.YRR,
      requestState: false,
      delay: Delay.SHORT,
    },
    [Action.REQUEST]: {
      lightState: LightState.YRR,
      requestState: true,
      delay: Delay.SHORT,
    },
  },
  [LightState.YRR]: {
    [Action.NEXT]: {
      lightState: LightState.RXR,
      requestState: false,
      delay: Delay.MEDIUM,
    },
    [Action.REQUEST]: {
      lightState: LightState.RRG,
      requestState: true,
      delay: Delay.LONG,
    },
  },
  [LightState.RXR]: {
    [Action.NEXT]: {
      lightState: LightState.RGR,
      requestState: false,
      delay: Delay.LONG,
    },
    [Action.REQUEST]: {
      lightState: LightState.RYR,
      requestState: true,
      delay: Delay.SHORT,
    },
  },
  [LightState.RGR]: {
    [Action.NEXT]: {
      lightState: LightState.RYR,
      requestState: false,
      delay: Delay.SHORT,
    },
    [Action.REQUEST]: {
      lightState: LightState.RYR,
      requestState: true,
      delay: Delay.SHORT,
    },
  },
  [LightState.RYR]: {
    [Action.NEXT]: {
      lightState: LightState.XRR,
      requestState: false,
      delay: Delay.MEDIUM,
    },
    [Action.REQUEST]: {
      lightState: LightState.RRG,
      requestState: false,
      delay: Delay.LONG,
    },
  },
  [LightState.XRR]: {
    [Action.NEXT]: {
      lightState: LightState.GRR,
      requestState: false,
      delay: Delay.LONG,
    },
    [Action.REQUEST]: {
      lightState: LightState.YRR,
      requestState: true,
      delay: Delay.SHORT,
    },
  },
  [LightState.RRG]: {
    [Action.NEXT]: {
      lightState: LightState.GRR,
      requestState: false,
      delay: Delay.LONG,
    },
    [Action.REQUEST]: {
      lightState: LightState.RRG,
      requestState: false,
      delay: Delay.LONG,
    },
  },
};

export const useTrafficControl = () => {
  const reducer = (state: State, action: Action): State => {
    if (state.timerId) clearTimeout(state.timerId);
    switch (action) {
      case Action.START:
        const timerId = setTimeout(() => {
          dispatch(Action.NEXT);
        }, Delay.LONG);
        return { ...state, timerId };
      case Action.STOP:
        return initialState;
      case Action.NEXT:
      case Action.REQUEST:
        const nextState = transitions[state.lightState][action];
        const newTimerId = setTimeout(() => {
          action === Action.NEXT
            ? dispatch(Action.NEXT)
            : dispatch(Action.REQUEST);
        }, nextState.delay);
        return {
          lightState: nextState.lightState,
          requestState: nextState.requestState,
          timerId: newTimerId,
        };

      default:
        throw new Error(`Action not supported: ${action}.`);
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
    if (isRequest) return;
    setIsRequest(true);
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
    console.log(state.lightState);
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
