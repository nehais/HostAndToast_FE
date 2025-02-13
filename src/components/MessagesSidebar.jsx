import ProfileIcon from "../assets/profile.png";

const MessagesSidebar = ({ otherUsers }) => {
  return (
    <aside>
      {otherUsers &&
        otherUsers.map((user) => {
          return (
            <div className="meal-chef-details" key={user._id}>
              {" "}
              {/* Assuming each user has a unique ID */}
              <img
                src={user.imageUrl ? user.imageUrl : ProfileIcon}
                alt="Chef Icon"
                className="profile-img"
              />
              <p>
                <strong>Chef</strong> {user.username} {/* Changed 'meal' to 'user' */}
              </p>
            </div>
          );
        })}
    </aside>
  );
};
export default MessagesSidebar;
