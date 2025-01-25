import "../styles/Navbar.css";

import { useState } from "react";

import Button from "react-bootstrap/Button";
import SignUpModal from "./SignUpModal.jsx";
import LogInModal from "./LogInModal.jsx";

const Navbar = () => {
  const [modalShowSignUp, setModalShowSignUp] = useState(false);
  const [modalShowLogIn, setModalShowLogIn] = useState(false);

  return (
    <div className="navbar">
      <Button variant="primary" onClick={() => setModalShowSignUp(true)}>
        Register User
      </Button>
      <Button variant="secondary" onClick={() => setModalShowLogIn(true)}>
        Log In
      </Button>

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
