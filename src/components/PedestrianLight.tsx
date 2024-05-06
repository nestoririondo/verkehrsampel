import BackHandIcon from "@mui/icons-material/BackHand";
import { Box, Button, Typography } from "@mui/material";
import { Action, PedestrianLightColor, State } from "../hooks/useTrafficControl";

type PedestrianLightProps = {
  pedestrianLight: PedestrianLightColor;
  dispatch: (action: Action) => void;
  state: State;
};

const PedestrianLight = ({
  pedestrianLight,
  dispatch,
  state,
}: PedestrianLightProps) => {
  const lamps = [PedestrianLightColor.R, PedestrianLightColor.G];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        mb: "auto",
      }}
    >
      <Typography sx={{ textAlign: "center" }} variant="h6">
        Fußgängerampel
      </Typography>
      <Box
        sx={{
          width: 100,
          height: 200,
          border: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "lightgray",
          p: 2,
          borderRadius: 2,
        }}
      >
        {lamps.map((color) => (
          <Box
            key={color}
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: pedestrianLight === color ? color : "gray",
            }}
          />
        ))}
      </Box>

      <Button
        variant="outlined"
        startIcon={<BackHandIcon />}
        disabled={
          pedestrianLight === "green" || !state.timerId || state.requestState
        }
        sx={{ mt: 2 }}
        onClick={() => dispatch(Action.REQUEST)}
      >
        Anfrage
      </Button>
    </Box>
  );
};

export default PedestrianLight;
