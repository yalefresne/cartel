import { Box, Button, Heading, Layer, Text } from "grommet";

/**
 * Confirm Dialog
 * @param  {Header} confirmHandler Title of this dialog.
 * @param  {BodyText} confirmHandler BodyText of this dialog.
 * @param  {closeConfirm} closeConfirm The function should toggle between view/hide this dialog.
 * @param  {confirmHandler} confirmHandler calls this function after "Yes" confirmation.
  */
const ConfirmDialog = ({ Header, BodyText, closeConfirm, confirmHandler }) => {
  return (
    <Layer position="center" onClickOutside={closeConfirm} onEsc={closeConfirm}>
      <Box pad="medium" gap="small" width="medium" justify="center" align="center" direction="column" fill>
        <Heading level={3} margin="none">{Header}</Heading>
        <Text>{BodyText}</Text>
        <Box
          as="footer"
          gap="small"
          direction="row"
          align="center"
          justify="end"
          pad={{ top: 'medium', bottom: 'small' }}
        >
          <Button label="No" onClick={closeConfirm} color="dark-3" />
          <Button
            label={
              <Text color="white">
                <strong>Yes</strong>
              </Text>
            }
            onClick={confirmHandler}
            primary
            color="status-critical"
          />
        </Box>
      </Box>
    </Layer>
  );
}

export default ConfirmDialog;