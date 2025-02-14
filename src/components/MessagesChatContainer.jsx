import { useContext, useEffect } from "react";
import MessagesChatHeader from "./MessagesChatHeader";
import MessagesInput from "./MessagesInput";
import { MessageContext } from "../contexts/message.context";
import { AuthContext } from "../contexts/auth.context";
import ProfileIcon from "../assets/profile.png";

const MessagesChatContainer = () => {
  const { messages, selectedUser } = useContext(MessageContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {}, [messages]);

  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    const now = new Date();

    // Check if the message is sent today
    const isToday =
      now.getDate() === date.getDate() &&
      now.getMonth() === date.getMonth() &&
      now.getFullYear() === date.getFullYear();

    // Format the date as "Wed, 20.02.25" or "Wednesday, 20.02.25"
    const formattedDate = isToday
      ? date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : `${date.toLocaleDateString("en-GB", {
          // weekday: "short", // "short" for Mon, Tue, Wed, etc.
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })} at ${date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}`;

    return formattedDate;
  };

  return (
    <div className="messages-chat-container">
      <MessagesChatHeader />
      <div className="messages-chat">
        {messages
          .filter(
            (message) =>
              // Show only messages with the selected user
              message.senderId._id === selectedUser._id ||
              message.receiverId._id === selectedUser._id
          )
          .map((message) => {
            return message.senderId._id === user._id ? (
              <div key={message._id} className="message message-sent">
                <div className="message-content">
                  <p>{message.text}</p>
                  <p className="message-time">{formatDateTime(message.createdAt)}</p>
                </div>
                <img
                  src={message.senderId.imageUrl ? message.senderId.imageUrl : ProfileIcon}
                  alt="Profile Icon"
                  className="profile-img"
                />
              </div>
            ) : (
              <div key={message._id} className="message message-received">
                <img
                  src={message.senderId.imageUrl ? message.senderId.imageUrl : ProfileIcon}
                  alt="Profile Icon"
                  className="profile-img"
                />
                <div className="message-content">
                  <p>{message.text}</p>
                  <p className="message-time">{formatDateTime(message.createdAt)}</p>
                </div>
              </div>
            );
          })}
        <MessagesInput />
      </div>
    </div>
  );
};

export default MessagesChatContainer;
