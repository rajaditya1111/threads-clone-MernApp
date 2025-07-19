import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Error = () => {
  // it will goto the given path>> 
  //()=>navigate('/profile'),
  //onClick={() => navigate(-1)}   >> Return where users last page using
  const navigate = useNavigate();

  return (
    <>
      <Stack
        width={"100%"}
        height={"100vh"}
        flexDirection={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        
      >

        <Stack
          p={10}
          border={"2px solid black"}
          bgcolor={"white"}
          borderRadius={"10px"}
          flexDirection={"column"}
          alignItems={"center"}
          gap={2}
          boxShadow={"10px 10px 10px grey"}
        >

          <Typography variant="h3">OOP`s</Typography>
          <Typography variant="h6">Wrong Location !</Typography>

          <Button
            size="large"
            sx={{
              bgcolor: "black",
              color: "white",
              borderRadius: "10px",
              p: 2,
              ":hover": {
                bgcolor: "green",
                cursor: "pointer",
              },
            }}
            //Return where users last page using
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Stack>

      </Stack>
    </>
  );
};
export default Error;
