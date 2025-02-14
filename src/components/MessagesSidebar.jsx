import { useContext } from "react";
import ProfileIcon from "../assets/profile.png";
import { MessageContext } from "../contexts/message.context.jsx";

const MessagesSidebar = () => {
  const { otherUsers, setSelectedUser } = useContext(MessageContext);
  return (
    <aside className="messages-sidebar">
      {otherUsers &&
        otherUsers.map((user) => {
          return (
            <button key={user._id} onClick={() => setSelectedUser(user)}>
              <div className="meal-chef-details">
                <img
                  src={user.imageUrl ? user.imageUrl : ProfileIcon}
                  alt="Chef Icon"
                  className="profile-img"
                />
                <p>
                  <strong>Chef</strong> {user.username} {/* Changed 'meal' to 'user' */}
                </p>
              </div>
            </button>
          );
        })}
    </aside>
  );
};
export default MessagesSidebar;
