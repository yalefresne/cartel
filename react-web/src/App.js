import { Box, Grommet } from "grommet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import SideBar from "./components/SideBar";
import Notification from "./components/Notification";

// Contexts
import { NotifyContextProvider } from "./context/NotifyContext";
import { AuthContextProvider } from "./context/AuthContext";

const theme = {
  global: {
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
  },
};

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <Grommet theme={theme} full>
          <Box overflow="auto" direction="row" fill>
            <NotifyContextProvider>
              <Box
                fill
                direction="row"
                justify="start"
                align="start"
                gap="large"
              >
                <SideBar />
                <Box direction="row" justify="center" fill>
                  <Routes>
                    <Route exact path="/home" component={null} />
                    <Route path="/activity/:id" component={null} />
                  </Routes>
                  <Notification />
                </Box>
              </Box>
            </NotifyContextProvider>
          </Box>
        </Grommet>
      </AuthContextProvider>
    </Router>
  );
}

export default App;
