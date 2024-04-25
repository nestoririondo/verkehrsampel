import BackHandIcon from "@mui/icons-material/BackHand";
import { Box, Button, Typography } from "@mui/material";

type PedestrianLightProps = {
  pedestrianLight: "red" | "green";
  handleRequest: () => void;
  isRequest: boolean;
};

const PedestrianLight = ({ pedestrianLight, handleRequest, isRequest }: PedestrianLightProps) => {
  const lamps = ["red", "green"];

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
        disabled={pedestrianLight === "green" || isRequest}
        sx={{ mt: 2 }}
        onClick={handleRequest}
      >
        Anfrage
      </Button>
    </Box>
  );
};

export default PedestrianLight;
