import { Box, Nav } from "grommet";
import { Home, User, SettingsOption, Logout, Login } from "grommet-icons";

import { useAuth } from "../context/AuthContext";

import SideBarButton from "./SideBarButton";
import { useState } from "react";
import SignIn from "./SignIn";
import { auth } from '../config/firebase';

const signOutHandler = () => {
  auth.signOut();
}

const SideBar = () => {
  const user = useAuth();

  const [signInPopUp, setSignInPopUp] = useState(false);

  const closeConfirm = () => {
    setSignInPopUp((prev) => !prev);
  };

  if (user && signInPopUp) {
      setSignInPopUp(false);
  }

  return (
    <Box
      align="start"
      justify="between"
      style={{ position: "fixed" }}
      fill="vertical"
    >
      <Box align="center" justify="center">
        <Nav align="center" flex={false} direction="column" gap="xxsmall">
          <SideBarButton icon={<Home size="medium" />} label="Home" />
          <SideBarButton icon={<User size="medium" />} label="Profile" />
          <SideBarButton
            icon={<SettingsOption size="medium" />}
            label="Settings"
          />
          {user ? (
            <SideBarButton icon={<Logout size="medium" />} label="Log Out" onClick={signOutHandler} />
          ) : (
            <SideBarButton
              icon={<Login size="medium" />}
              label="Log In"
              onClick={closeConfirm}
            />
          )}
          {signInPopUp && <SignIn closeConfirm={closeConfirm} />}
        </Nav>
      </Box>
    </Box>
  );
};

export default SideBar;
