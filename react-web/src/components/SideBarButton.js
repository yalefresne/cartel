import { Box, Button } from "grommet";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Don't forget to include the "to" param
const SideBarButton = ({ icon, label, to, onClick }) => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const [hoverColor, setHoverColor] = useState("white");

  const toggleHoverColor = () => {
    if (hoverColor === "white") {
      setHoverColor("light-3");
    } else {
      setHoverColor("white");
    }
  };

  return (
    <Box
      direction="row"
      align="center"
      justify="start"
      gap="xxsmall"
      round="medium"
      margin={{ horizontal: "small" }}
      pad={{ horizontal: "small", vertical: "small" }}
      background={pathname !== to || label === "Login" || label === "Logout" ? hoverColor : "light-3"}
      onMouseEnter={toggleHoverColor}
      onMouseLeave={toggleHoverColor}
      onClick={onClick ? onClick : () => navigate(to)}
      focusIndicator="white"
    >
      {icon} {label}
    </Box>
  );
};

export default SideBarButton;
