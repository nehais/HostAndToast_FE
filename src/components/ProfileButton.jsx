import { useState, useContext, useRef, useEffect } from "react";
import ProfileIcon from "../assets/profile.png";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { AuthContext } from "../contexts/auth.context";

const ProfileButton = () => {
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const { user, authenticateUser } = useContext(AuthContext);
  const ref = useRef();

  useEffect(() => {
    //onClick outside of element close the DD
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowDropdown(false); // Close the dropdown
      }
    }
    // Bind
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up on unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const handleLogOut = () => {
    logOut();
    setShowDropdownMenu(false); // Close the dropdown
  };

  async function logOut() {
    localStorage.removeItem("authToken");
    await authenticateUser();
  }

  return (
    <>
      <button
        className="profile-button"
        onClick={() => setShowDropdownMenu(true)}
        onMouseEnter={() => setShowDropdownMenu(true)}
        onMouseLeave={() => setShowDropdownMenu(false)}
      >
        <img src={ProfileIcon} alt="" className="profile-img" />

        {showDropdownMenu && (
          <>
            <div className="profile-drop-down">
              <p>Hello {user.username}!</p>
              <ul>
                <li onClick={() => handleLogOut()} ref={ref}>
                  Profile
                </li>
                <li onClick={() => handleLogOut()} ref={ref}>
                  Messages
                </li>
                <li onClick={() => handleLogOut()} ref={ref}>
                  Your Listings
                </li>
                <li onClick={() => handleLogOut()} ref={ref}>
                  Your Favourites
                </li>
                <li onClick={() => handleLogOut()} ref={ref}>
                  Log Out!
                </li>
              </ul>
            </div>
          </>
        )}
      </button>
    </>
  );
};

export default ProfileButton;
