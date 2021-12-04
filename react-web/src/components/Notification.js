import { useNotify } from "../context/NotifyContext";
import { Layer, Box, Text, Button } from "grommet";
import { FormClose, StatusGood, StatusCritical } from "grommet-icons";

const Notification = () => {

  const { message, context, onClose } = useNotify();
  if (!message) {
    return null;
  }
  return (
    <Layer
      position="bottom"
      modal={false}
      margin={{ vertical: 'medium', horizontal: 'small' }}
      onEsc={onClose}
      responsive={false}
      plain
    >
      <Box
        align="center"
        direction="row"
        gap="small"
        justify="between"
        round="medium"
        elevation="medium"
        pad={{ vertical: 'xsmall', horizontal: 'small' }}
        background={context ? "status-ok" : "status-critical"}
      >
        <Box align="center" direction="row" gap="xsmall">
          {context ? <StatusGood /> : <StatusCritical />}
          <Text>
            {message}
          </Text>
        </Box>
        <Button icon={<FormClose />} onClick={onClose} plain />
      </Box>
    </Layer>
  );
}

export default Notification;