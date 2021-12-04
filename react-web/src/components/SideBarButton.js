import { Button } from "grommet";

const SideBarButton = ({ icon, label, ...rest }) => {
  return (
      <Button margin={{horizontal: "medium"}} size="large"
        gap="small"
        alignSelf="start"
        hoverIndicator="light-3"
        color="white"
        icon={icon}
        label={label}
        {...rest}
      />
  );
};

export default SideBarButton;
