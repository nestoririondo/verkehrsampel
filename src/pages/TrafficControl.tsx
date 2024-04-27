import TrafficLight from "../components/TrafficLight";
import PedestrianLight from "../components/PedestrianLight";
import { Button, Container, Typography } from "@mui/material";
import { useTrafficControl, Action } from "../hooks/useTrafficControl";

const TrafficControl = () => {
  const { lights, state, dispatch } = useTrafficControl();

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
        <TrafficLight light={lights.main} name="Hauptstraße" />
        <TrafficLight light={lights.side} name="Nebenstraße" />
        <PedestrianLight
          pedestrianLight={lights.pedestrian}
          state={state}
          dispatch={dispatch}
        />
      </Container>
    </Container>
  );
};

export default TrafficControl;
