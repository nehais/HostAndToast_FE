import ProfileIcon from "../assets/profile.png";
import { Link } from "react-router-dom";

const MealListCustInfo = ({ user }) => {
  return (
    <div
      className="meal-chef-details"
      style={{ justifyContent: "center", gap: "15px" }}
    >
      <Link to={`/chef/${user._id}`}>
        <img
          src={user.imageUrl ? user.imageUrl : ProfileIcon}
          alt="User Icon"
          className="profile-img meal-list-button"
        />{" "}
      </Link>
      <span className="meal-card-font" style={{ width: "30%" }}>
        {user.username}
      </span>
    </div>
  );
};

export default MealListCustInfo;
