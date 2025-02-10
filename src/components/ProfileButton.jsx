import { useState, useContext } from "react";
import ProfileIcon from "../assets/profile.png";
import { AuthContext } from "../contexts/auth.context";
import { Link } from "react-router-dom";

const ProfileButton = () => {
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const { profileData, authenticateUser } = useContext(AuthContext);

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
                <li>Messages</li>
                <li>
                  <Link to="/meal-list" className="profile-menu-link">
                    Your Meals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/meal-list?mode=orders"
                    className="profile-menu-link"
                  >
                    Your Orders
                  </Link>
                </li>
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
