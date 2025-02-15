import { useContext, useEffect, useState } from "react";
import { API_URL } from "../config/apiConfig.js";
import axios from "axios";
import { AuthContext } from "../contexts/auth.context.jsx";
import { MessageContext } from "../contexts/message.context.jsx";
import MessagesSidebar from "../components/MessagesSidebar.jsx";
import MessagesChatContainer from "../components/MessagesChatContainer.jsx";
import "../styles/Messages.css";
import { use } from "react";

const Messages = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  // const [showChat, setShowChat] = useState(true);
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

  // Handle mobile view based on window width
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth <= 768); // Set to true if the window width is less than or equal to 768px
    };
    // Run on component mount
    handleResize();
    // Add event listener on resize
    window.addEventListener("resize", handleResize);
    // Cleanup event listener on component unmount
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
        const otherUsers = res.data.map((message) => {
          return message.senderId._id === user._id ? message.receiverId : message.senderId;
        });
        const uniqueOtherUsers = Array.from(new Set(otherUsers.map((user) => user._id))).map(
          (id) => {
            return otherUsers.find((user) => user._id === id);
          }
        );
        setOtherUsers(uniqueOtherUsers);
        setSelectedUser(uniqueOtherUsers[0]);
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
    <div className="messages-wrapper">
      <div className="messages">
        <h1>Your Messages</h1>

        <div className="messages-container">
          {!showSidebar && (
            <button
              onClick={() => {
                // setShowChat(showSidebar);
                setShowSidebar(!showSidebar);
              }}
              className="hide-sidebar"
            >
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
