import { useContext, useEffect, useState } from "react";
import { API_URL } from "../config/apiConfig.js";
import axios from "axios";
import { AuthContext } from "../contexts/auth.context.jsx";
import MessagesSidebar from "../components/MessagesSidebar.jsx";
import MessagesNoChatSelected from "../components/MessagesNoChatSelected.jsx";
import MessagesChatContainer from "../components/MessagesChatContainer.jsx";
import "../styles/Messages.css";

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  // const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      if (!user._id) return;

      setIsUsersLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/messages/user/${user._id}`);
        setMessages({ messages: res.data });
        const otherUsers = res.data.map((message) => {
          return message.senderId._id === user._id ? message.receiverId : message.senderId;
        });
        const uniqueOtherUsers = Array.from(new Set(otherUsers.map((user) => user._id))).map(
          (id) => {
            return otherUsers.find((user) => user._id === id);
          }
        );
        setOtherUsers(uniqueOtherUsers);
      } catch (error) {
        console.log("Error getting users", error);
      } finally {
        setIsUsersLoading(false);
      }
    }
    fetchUsers();
  }, [user]);

  // useEffect(() => {
  //   function fetchMessages = async () => {
  //     setIsMessagesLoading(true);
  //     try {
  //       const res = await axios.get(`${API_URL}/api/messages/${user._id}/${selectedUser._id}`);
  //       setMessages({messages: res.data});
  //     } catch (error) {
  //       console.log("Error getting messages", error);
  //     } finally {
  //       setIsMessagesLoading(false);
  //     }
  //   }
  //   if (selectedUser) {
  //     fetchMessages();
  //   }
  // }, [selectedUser]);

  return (
    <div className="messages-container">
      <MessagesSidebar otherUsers={otherUsers} />
      {!selectedUser ? <MessagesNoChatSelected /> : <MessagesChatContainer />}
    </div>
  );
};

export default Messages;
