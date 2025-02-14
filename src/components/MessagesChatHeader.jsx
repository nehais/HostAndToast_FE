import { useContext } from "react";
import { MessageContext } from "../contexts/message.context";
import ProfileIcon from "../assets/profile.png";

const MessagesChatHeader = () => {
  const { selectedUser, setSelectedUser } = useContext(MessageContext);
  // console.log(selectedUser);

  return (
    <div className="messages-chat-header">
      <div className="avatar">
        <div className="user-info">
          <img
            src={selectedUser.imageUrl ? selectedUser.imageUrl : ProfileIcon}
            alt="Chef Icon"
            className="profile-img"
          />
          <p>
            <strong>Chef</strong> {selectedUser.username} {/* Changed 'meal' to 'user' */}
          </p>
        </div>
        <button className="close-btn" onClick={() => setSelectedUser(null)}>
          X
        </button>
      </div>
    </div>
  );
};
export default MessagesChatHeader;
