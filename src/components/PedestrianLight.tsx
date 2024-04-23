import BackHandIcon from "@mui/icons-material/BackHand";
import { Box, Button } from "@mui/material";

type PedestrianLightProps = {
  handleRequest: () => void;
  pedestrianLight: "red" | "green";
};

const PedestrianLight = ({
  handleRequest,
  pedestrianLight,
}: PedestrianLightProps) => {
  const lamps = ["red", "green"];

  return (
    <Box
      sx={{
        mt: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
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
          p: 1,
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
        onClick={handleRequest}
        startIcon={<BackHandIcon />}
      >
        Request
      </Button>
    </Box>
  );
};

export default PedestrianLight;
