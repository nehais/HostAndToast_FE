import "../styles/Navbar.css";
import logoIcon from "../assets/iconLogo.png";

import { useContext, useState } from "react";

import Button from "react-bootstrap/Button";
import SignUpModal from "./SignUpModal.jsx";
import LogInModal from "./LogInModal.jsx";
import { AuthContext } from "../contexts/auth.context";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton.jsx";
import AddressSearch from "./AddressSearch.jsx";
import CartButton from "./CartButton.jsx";

const Navbar = () => {
  const [modalShowSignUp, setModalShowSignUp] = useState(false);
  const [modalShowLogIn, setModalShowLogIn] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const nav = useNavigate();
  const loc = useLocation();

  function addMeal() {
    if (!isLoggedIn) {
      setModalShowLogIn(true);
    } else {
      nav("/add-meal");
    }
  }

  return (
    <div className="navbar">
      <div>
        <Link to="/">
          <img src={logoIcon} alt="Website Logo & Icon" className="logo-icon" />
        </Link>
      </div>

      {/*Address Bar is shown in Navbar when not on HomePage*/}
      {loc.pathname !== "/" && (
        <AddressSearch componentId="navbar" className="navbar-adr" />
      )}

      <div className="nav-buttons">
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="register-tooltip">
              List your meal for others to book and savor.
            </Tooltip>
          }
        >
          <Button
            id="list-meal-button"
            variant="secondary"
            onClick={() => addMeal()}
          >
            + List Your Meal
          </Button>
        </OverlayTrigger>

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
                Sign up
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
          <>
            <ProfileButton />
            <CartButton />
          </>
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
