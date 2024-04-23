import { LightColor } from "../context/TrafficControlContext";
import { Box } from "@mui/material";

type TrafficLightProps = {
  light: LightColor;
};

const TrafficLight = ({ light }: TrafficLightProps) => {

  const lamps = ["red", "yellow", "green"];

  return (
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
              light === color || (light === "red-yellow" && color !== "green")
                ? color
                : "gray",
          }}
        />
      ))}
    </Box>
  );
};

export default TrafficLight;
