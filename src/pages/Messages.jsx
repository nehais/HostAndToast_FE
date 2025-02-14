import { useContext, useEffect, useState } from "react";
import { API_URL } from "../config/apiConfig.js";
import axios from "axios";
import { AuthContext } from "../contexts/auth.context.jsx";
import { MessageContext } from "../contexts/message.context.jsx";
import MessagesSidebar from "../components/MessagesSidebar.jsx";
import MessagesNoChatSelected from "../components/MessagesNoChatSelected.jsx";
import MessagesChatContainer from "../components/MessagesChatContainer.jsx";
import "../styles/Messages.css";

const Messages = () => {
  const { user, socket } = useContext(AuthContext);
  const {
    messages,
    setMessages,
    otherUsers,
    setOtherUsers,
    selectedUser,
    setSelectedUser,
    setIsUsersLoading,
  } = useContext(MessageContext);

  useEffect(() => {
    async function fetchUsers() {
      if (!user._id) return;

      setIsUsersLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/messages/user/${user._id}`);
        setMessages(res.data);
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

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages from socket
    socket.on("receiveMessage", (newMessage) => {
      console.log("Received message:", newMessage);
      // Update messages state with the new message
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage"); // Cleanup when the component is unmounted
    };
  }, [socket]);

  return (
    <div className="messages-container">
      <MessagesSidebar />
      {!selectedUser ? <MessagesNoChatSelected /> : <MessagesChatContainer messages={messages} />}
    </div>
  );
};

export default Messages;
