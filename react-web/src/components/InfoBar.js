import { Box, Nav } from "grommet";

const InfoBar = () => {

  return (
    <Box
      align="end"
      justify="between"
      fill="vertical"
    >
      <Box align="center" justify="center">
        <Nav align="start" flex={false} direction="column" gap="xxsmall">
          InfoBar
        </Nav>
      </Box>
    </Box>
  );
};

export default InfoBar;
