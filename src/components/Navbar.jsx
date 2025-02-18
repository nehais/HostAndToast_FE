import "../styles/Navbar.css";
// import logoIcon from "../assets/iconLogo.png";
import logoIcon from "../assets/iconLogo.svg";

import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import SignUpModal from "./SignUpModal.jsx";
import LogInModal from "./LogInModal.jsx";
import ProfileButton from "./ProfileButton.jsx";
import AddressSearch from "./AddressSearch.jsx";
import CartButton from "./CartButton.jsx";
import GoButton from "./GoButton.jsx";
import { AuthContext } from "../contexts/auth.context";

import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const Navbar = () => {
  const [modalShowSignUp, setModalShowSignUp] = useState(false);
  const [modalShowLogIn, setModalShowLogIn] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const nav = useNavigate();
  const loc = useLocation();

  function addMeal() {
    nav("/handle-meal");
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
        <div className="adr-go nav-go">
          <AddressSearch componentId="navbar" />
          <GoButton />
        </div>
      )}

      <div className="nav-buttons">
        {/* Add Meal Button */}
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="register-tooltip">List your meal for others to book and savor.</Tooltip>
          }
        >
          <Button
            id="list-meal-button"
            variant="warning"
            className="button-shadow"
            onClick={() => addMeal()}
          >
            + List Your Meal
          </Button>
        </OverlayTrigger>

        {!isLoggedIn && (
          <>
            {/* Registration Button */}
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="register-tooltip">Register your User profile</Tooltip>}
            >
              <Button
                variant="secondary"
                className="button-shadow"
                onClick={() => setModalShowSignUp(true)}
              >
                Sign up
              </Button>
            </OverlayTrigger>

            {/* Login Button */}
            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="login-tooltip">Login with your User details</Tooltip>}
            >
              <Button
                variant="primary"
                className="button-shadow"
                onClick={() => setModalShowLogIn(true)}
              >
                Log In
              </Button>
            </OverlayTrigger>
          </>
        )}

        {isLoggedIn && (
          <>
            {/* Profile Button - Opens sub-menu*/}
            <ProfileButton />
            {/* Shopping Cart Button */}
            <CartButton />
          </>
        )}
      </div>

      <SignUpModal show={modalShowSignUp} onHide={() => setModalShowSignUp(false)} />

      <LogInModal show={modalShowLogIn} onHide={() => setModalShowLogIn(false)} />
    </div>
  );
};

export default Navbar;
