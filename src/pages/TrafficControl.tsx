import TrafficLight from "../components/TrafficLight";
import PedestrianLight from "../components/PedestrianLight";
import { Button, Container, Typography } from "@mui/material";
import { useTrafficControl, Action } from "../hooks/useTrafficControl";

const TrafficControl = () => {
  const { state, dispatch } = useTrafficControl();
  
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      <Typography variant="h3" sx={{ mt: 4 }}>
        Verkehrsampel
      </Typography>
      {!state.timerId ? (
        <Button variant="contained" onClick={() => dispatch(Action.START)}>
          Start
        </Button>
      ) : (
        <Button variant="outlined" onClick={() => dispatch(Action.STOP)}>
          Stop
        </Button>
      )}
      <Container
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TrafficLight light={state.lightState[0]} name="Hauptstraße" />
        <TrafficLight light={state.lightState[1]} name="Nebenstraße" />
        <PedestrianLight
          pedestrianLight={state.lightState[2]}
          state={state}
          dispatch={dispatch}
        />
      </Container>
    </Container>
  );
};

export default TrafficControl;
