import { useContext, useEffect, useState } from "react";
import { API_URL } from "../config/apiConfig.js";
import axios from "axios";
import { AuthContext } from "../contexts/auth.context.jsx";
import { MessageContext } from "../contexts/message.context.jsx";
import MessagesSidebar from "../components/MessagesSidebar.jsx";
import MessagesChatContainer from "../components/MessagesChatContainer.jsx";
import "../styles/Messages.css";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams

const Messages = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [mobileView, setMobileView] = useState(false); // State for mobile view
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

  // Get query parameters
  const [searchParams] = useSearchParams();
  const receiverId = searchParams.get("receiverId"); // Extract receiverId from query params

  // Handle mobile view based on window width
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      if (!user._id) return;

      setIsUsersLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/messages/user/${user._id}`);
        setMessages(res.data);

        const otherUsers = res.data.map((message) =>
          message.senderId._id === user._id ? message.receiverId : message.senderId
        );

        const uniqueOtherUsers = Array.from(new Set(otherUsers.map((user) => user._id))).map((id) =>
          otherUsers.find((user) => user._id === id)
        );

        setOtherUsers(uniqueOtherUsers);

        // If receiverId is in the URL, select that user; otherwise, default to the first user
        if (receiverId) {
          const selectedFromUrl = uniqueOtherUsers.find((user) => user._id === receiverId);
          setSelectedUser(selectedFromUrl || uniqueOtherUsers[0]);
        } else {
          setSelectedUser(uniqueOtherUsers[0]);
        }
      } catch (error) {
        console.log("Error getting users", error);
      } finally {
        setIsUsersLoading(false);
      }
    }
    fetchUsers();
  }, [user, receiverId]); // Add receiverId to dependencies to react to URL changes

  useEffect(() => {
    if (!socket) return;

    socket.on("receiveMessage", (newMessage) => {
      console.log("Received message:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket]);

  return (
    <div className="messages-wrapper">
      <div className="messages">
        <h1>Your Messages</h1>

        <div className="messages-container">
          {!showSidebar && (
            <button onClick={() => setShowSidebar(!showSidebar)} className="hide-sidebar">
              Show contacts
            </button>
          )}
          {showSidebar && (
            <MessagesSidebar
              mobileView={mobileView}
              showSidebar={showSidebar}
              setShowSidebar={setShowSidebar}
            />
          )}
          {(!showSidebar || !mobileView) && <MessagesChatContainer messages={messages} />}
        </div>
      </div>
    </div>
  );
};

export default Messages;
