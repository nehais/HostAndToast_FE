import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

const AuthContext = createContext();

const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState({ username: "", _id: "" });
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    address: {},
    imageUrl: "",
    description: "",
    specialty: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    if (isLoggedIn && !socket) {
      connectSocket(); // Only connect when the user is logged in and socket is not yet initialized
    }
  }, [isLoggedIn]);

  const authenticateUser = async () => {
    const theToken = localStorage.getItem("authToken");
    if (theToken) {
      try {
        const { data } = await axios.get(`${API_URL}/auth/verify`, {
          headers: { authorization: `Bearer ${theToken}` },
        });
        setUser({ username: data.username, _id: data._id });
        setIsLoggedIn(true);
        setIsLoading(false);
      } catch (error) {
        setIsLoggedIn(false);
        setIsLoading(false);
        console.error("Error Authenticating", error.response?.data?.message);
      }
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  };

  const connectSocket = () => {
    console.log("Connecting socket...");
    const socketInstance = io(API_URL);
    setSocket(socketInstance);
  };

  const disconnectSocket = () => {
    console.log("Disconnecting socket...");
    if (socket?.connected) {
      socket.disconnect();
      setSocket(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        profileData,
        setProfileData,
        isLoading,
        isLoggedIn,
        authenticateUser,
        connectSocket,
        disconnectSocket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthWrapper };
