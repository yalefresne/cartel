import { Box, Grommet } from "grommet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import SideBar from "./components/SideBar";
import Notification from "./components/Notification";

// Contexts
import { NotifyContextProvider } from "./context/NotifyContext";
import { AuthContextProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import InfoBar from "./components/InfoBar";

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
    <AuthContextProvider>
      <Grommet theme={theme} full>
        <Box overflow="auto" direction="row" fill>
          <NotifyContextProvider>
            <Router>
              <Box
                fill
                direction="row"
                justify="center"
                align="start"
                margin={{ horizontal: "small", top: "small" }}
              >
                <SideBar style={{ position: "fixed" }} />
                <Box direction="row" width="large">
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                  <Notification />
                </Box>
                <InfoBar />
              </Box>
            </Router>
          </NotifyContextProvider>
        </Box>
      </Grommet>
    </AuthContextProvider>
  );
}

export default App;
