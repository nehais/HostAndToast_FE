import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const ProfileButton = () => {
  return (
    <>
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id="profile-tooltip">User Profile Options</Tooltip>}
      >
        <Button variant="secondary">Profile</Button>
      </OverlayTrigger>
    </>
  );
};

export default ProfileButton;
