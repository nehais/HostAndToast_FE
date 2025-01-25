import "../styles/Navbar.css";
import logoIcon from "../assets/iconLogo.png";

import { useContext, useState } from "react";

import Button from "react-bootstrap/Button";
import SignUpModal from "./SignUpModal.jsx";
import LogInModal from "./LogInModal.jsx";
import { AuthContext } from "../contexts/auth.context";

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
            <Button variant="primary" onClick={() => setModalShowSignUp(true)}>
              Register User
            </Button>
            <Button variant="secondary" onClick={() => setModalShowLogIn(true)}>
              Log In
            </Button>
          </>
        )}
        {isLoggedIn && (
          <Button
            variant="primary"
            onClick={() => {
              logOut();
            }}
          >
            Log Out
          </Button>
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
