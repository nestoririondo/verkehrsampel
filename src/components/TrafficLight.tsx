import {
  TrafficLightColor,
  useTrafficControl,
} from "../hooks/useTrafficControl";
import { Box, Typography } from "@mui/material";

type TrafficLightProps = {
  light: string;
  name: string;
};

const TrafficLight = ({ light, name }: TrafficLightProps) => {
  const lamps = [TrafficLightColor.R, TrafficLightColor.Y, TrafficLightColor.G];

  const { mapTrafficLightColor } = useTrafficControl();

  const thisLight = mapTrafficLightColor(light)

  return (
    <Box>
      <Typography sx={{ textAlign: "center" }} variant="h6">
        {name}
      </Typography>
      <Box
        sx={{
          width: 100,
          height: 300,
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
              backgroundColor:
              thisLight === color || (thisLight === "red-yellow" && color !== "green")
                  ? color
                  : "gray",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TrafficLight;
