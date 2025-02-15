import { useContext } from "react";
import ProfileIcon from "../assets/profile.png";
import { MessageContext } from "../contexts/message.context.jsx";

const MessagesSidebar = ({ mobileView, showSideBar, setShowSidebar }) => {
  const { otherUsers, setSelectedUser, selectedUser } = useContext(MessageContext);

  return (
    <aside className="messages-sidebar">
      {otherUsers &&
        otherUsers.map((user) => {
          const isSelected = selectedUser && selectedUser._id === user._id;

          return (
            <button
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                if (mobileView) setShowSidebar(false);
              }}
              className={`button-contact ${isSelected ? "button-selected-user" : ""}`}
            >
              <div className={`meal-chef-details`}>
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
