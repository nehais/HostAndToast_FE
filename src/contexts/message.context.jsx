import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../config/apiConfig.js";
import axios from "axios";
import { AuthContext } from "./auth.context.jsx";

const MessageContext = createContext();

// CREATE A WRAPPER COMPONENT
function MessageProviderWrapper(props) {
  const [messages, setMessages] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);

  async function sendMessage(messageData) {
    try {
      const res = await axios.post(`${API_URL}/api/messages/send`, messageData);
      console.log("Message sent", res.data);
      setMessages([...messages, res.data]);
    } catch (error) {
      console.log("Error sending message", error);
    }
  }

  /* SET UP THE PROVIDER */
  return (
    <MessageContext.Provider
      value={{
        messages,
        setMessages,
        otherUsers,
        setOtherUsers,
        selectedUser,
        setSelectedUser,
        isUsersLoading,
        setIsUsersLoading,
        sendMessage,
      }}
    >
      {props.children}
    </MessageContext.Provider>
  );
}

export { MessageProviderWrapper, MessageContext };
