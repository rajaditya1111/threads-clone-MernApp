import { Grid, Stack, useMediaQuery, Divider } from "@mui/material";
import Navbar from "./Navbar";
import { IoMenu } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toggleMainMenu } from "../../redux/slice";


const Header = () => {
  const { darkMode } = useSelector((state) => state.service);
  const _700 = useMediaQuery("(min-width:700px)");

  const dispatch = useDispatch();


  //mainmenu (hamburger icon) click func. from slice/reducer/func >> Mainmenu.jsx
  const handleOpenMenu = (e) => {
    dispatch(toggleMainMenu(e.currentTarget));
  };


  return (
    <>
      {_700 ? (
        <Stack
          flexDirection={"row"}
          height={50}
          justifyContent={"space-around"}
          alignItems={"center"}
          position={"sticky"}
          borderBottom={"5px solid black"}
          top={0}
          py={1}

        >

          {/* logo acc. to darkMode */}
          {darkMode ? (
            <img
              src="/Threads-logo-black-bg.webp"
              alt="logo"
              width={60}
              height={50}
            />
          ) : (
            <img
              src="/Threads-logo-white-bg.png"
              alt="logo"
              width={60}
              height={35}
            />
          )}

          {/* Navbar styles */}
          <Stack
            justifyContent={"center"}
            width={"1200px"}
            bgcolor={darkMode ? "" : "white"}
            zIndex={2}
            height={50}
          >
            <Navbar />
          </Stack>


          <IoMenu
            size={40}
            className="image-icon"
            color="gray"
            onClick={handleOpenMenu}
          />



        </Stack>
      )


        :


        (
          <>

            <Stack
              position={"fixed"}
              bottom={0}
              justifyContent={"center"}
              width={"100%"}
              height={52}
              p={1}
              bgcolor={"aliceblue"}
              zIndex={2}
            >


            </Stack>

            <Grid
              container
              height={60}
              justifyContent={"flex-end"}
              alignItems={"center"}
              p={1}
            >

              <Grid item xs={6}>
                <img
                  src="/Threads-logo-white-bg.png"
                  alt="logo"
                  width={60}
                  height={35}
                />
              </Grid>

              <IoMenu size={36} className="image-icon" color="gray" />
              
            </Grid>


          </>
        )}
    </>
  );
};

export default Header;
