import { Box, Nav } from "grommet";
import { Home, User, SettingsOption, Logout, Login as LoginIcon } from "grommet-icons";

import { useAuth } from "../context/AuthContext";

import SideBarButton from "./SideBarButton";
import { useState } from "react";
import Login from "./Login";
import { auth } from "../config/firebase";
import ConfirmDialog from "./ConfirmDialog";


const SideBar = () => {
  const user = useAuth();
  
  const [loginDialog, setLoginDialog] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  
  const toggleLogin = () => {
    setLoginDialog((prev) => !prev);
  };
  
  const toggleLogout = () => {
    setLogoutDialog((prev) => !prev);
  };

  const logoutHandler = () => {
    auth.signOut();
    toggleLogout();
  };

  // edge case
  if (user && loginDialog) {
    setLoginDialog(false);
  }

  const authActionButton = (user) => {
    if (user === undefined) return null;

    if (user !== null)
      return (
        <SideBarButton
          icon={<Logout size="medium" />}
          label="Logout"
          onClick={toggleLogout}
          to={window.location.pathname}
        />
      );

    return (
      <SideBarButton
        icon={<LoginIcon size="medium" />}
        label="Login"
        onClick={toggleLogin}
        to={window.location.pathname}
      />
    );
  };

  return (
    <Box direction="column" align="start" justify="start" fill="vertical">
      <Nav flex={false} direction="column" gap="xxsmall">
        <SideBarButton icon={<Home size="medium" />} label="Home" to="/home" />

        <SideBarButton
          icon={<User size="medium" />}
          label="Profile"
          to="/profile"
        />

        <SideBarButton
          icon={<SettingsOption size="medium" />}
          label="Settings"
          to="/settings"
        />

        {authActionButton(user)}

        {/* Dialogs */}
        {loginDialog && <Login toggleDialog={toggleLogin} />}
        {logoutDialog && <ConfirmDialog Header="Logout" BodyText="Are you Sure?" closeConfirm={toggleLogout} confirmHandler={logoutHandler}/>}
      </Nav>
    </Box>
  );
};

export default SideBar;
