import "../styles/Navbar.css";

import { useContext, useState } from "react";

import Button from "react-bootstrap/Button";
import SignUpModal from "./SignUpModal.jsx";
import LogInModal from "./LogInModal.jsx";
import { AuthContext } from "../contexts/auth.context";

const Navbar = () => {
  const [modalShowSignUp, setModalShowSignUp] = useState(false);
  const [modalShowLogIn, setModalShowLogIn] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="navbar">
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
        <Button variant="primary" onClick={() => {}}>
          Log Out
        </Button>
      )}

      <SignUpModal show={modalShowSignUp} onHide={() => setModalShowSignUp(false)} />
      <LogInModal show={modalShowLogIn} onHide={() => setModalShowLogIn(false)} />
    </div>
  );
};

export default Navbar;
