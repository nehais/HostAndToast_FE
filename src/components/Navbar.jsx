import "../styles/Navbar.css";
import logoIcon from "../assets/iconLogo.png";

import { useContext, useState } from "react";

import Button from "react-bootstrap/Button";
import SignUpModal from "./SignUpModal.jsx";
import LogInModal from "./LogInModal.jsx";
import { AuthContext } from "../contexts/auth.context";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const Navbar = () => {
  const [modalShowSignUp, setModalShowSignUp] = useState(false);
  const [modalShowLogIn, setModalShowLogIn] = useState(false);
  const { isLoggedIn, authenticateUser } = useContext(AuthContext);

  async function logOut() {
    localStorage.removeItem("authToken");
    await authenticateUser();
  }

  return (
    <div className="navbar">
      <div>
        <img src={logoIcon} alt="Website Logo & Icon" className="logo-icon" />
      </div>

      <div className="nav-buttons">
        {!isLoggedIn && (
          <>
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="register-tooltip">
                  Register your User profile
                </Tooltip>
              }
            >
              <Button
                variant="secondary"
                onClick={() => setModalShowSignUp(true)}
              >
                Register User
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="login-tooltip">
                  Login with your User details
                </Tooltip>
              }
            >
              <Button variant="primary" onClick={() => setModalShowLogIn(true)}>
                Log In
              </Button>
            </OverlayTrigger>
          </>
        )}
        {isLoggedIn && (
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="logout-tooltip">Logout of your User Profile</Tooltip>
            }
          >
            <Button
              variant="primary"
              onClick={() => {
                logOut();
              }}
            >
              Log Out
            </Button>
          </OverlayTrigger>
        )}
      </div>
      <SignUpModal
        show={modalShowSignUp}
        onHide={() => setModalShowSignUp(false)}
      />
      <LogInModal
        show={modalShowLogIn}
        onHide={() => setModalShowLogIn(false)}
      />
    </div>
  );
};

export default Navbar;
