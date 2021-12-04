import { Box, Layer } from "grommet";

import { auth } from "../config/firebase";
import { GoogleAuthProvider } from "firebase/auth";
import { StyledFirebaseAuth } from "react-firebaseui";
import { useAuth } from "../context/AuthContext";

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/home',
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};

/**
 * Sign In Layer
 * @param  {closeConfirm} closeConfirm should toggle between view/hide this dialog.
 */
const SignIn = ({ closeConfirm }) => {
  return (
    <Layer position="center" onClickOutside={closeConfirm} onEsc={closeConfirm}>
      <Box
        pad="medium"
        gap="small"
        width="medium"
        justify="center"
        align="center"
        direction="column"
        fill
      >
        <Box
          as="footer"
          gap="small"
          direction="row"
          align="center"
          justify="end"
          pad={{ top: "medium", bottom: "small" }}
        >
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth}/>
        </Box>
      </Box>
    </Layer>
  );
};

export default SignIn;
