import { useState, useContext } from "react";
import ProfileIcon from "../assets/profile.png";
import { AuthContext } from "../contexts/auth.context";
import { Link } from "react-router-dom";

const ProfileButton = () => {
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const { profileData, authenticateUser, disconnectSocket } = useContext(AuthContext);

  const handleLogOut = () => {
    disconnectSocket();
    logOut();
    setShowDropdownMenu(false); // Close the dropdown
  };

  async function logOut() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("cart");
    await authenticateUser();
  }

  return (
    <>
      <button
        className="profile-button"
        onMouseEnter={() => setShowDropdownMenu(true)}
        onMouseLeave={() => setShowDropdownMenu(false)}
      >
        <img
          src={profileData.imageUrl ? profileData.imageUrl : ProfileIcon}
          alt="Profile Icon"
          className="profile-img"
        />

        {showDropdownMenu && (
          <>
            <div className="profile-drop-down">
              <p>Hello {profileData.username}!</p>
              <ul>
                <li>
                  <Link to="/profile" className="profile-menu-link">
                    Profile
                  </Link>
                </li>
                <Link to="/messages">
                  <li>Messages</li>{" "}
                </Link>
                <li onClick={() => handleLogOut()}>Log Out!</li>
              </ul>
            </div>
          </>
        )}
      </button>
    </>
  );
};

export default ProfileButton;
