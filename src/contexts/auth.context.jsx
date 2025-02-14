import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { API_URL } from "../config/apiConfig.js";
import { use } from "react";

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

    // Listen for successful connection
    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setSocket(socketInstance); // Set the socket instance after it's connected
    });

    // Listen for connection errors
    socketInstance.on("connect_error", (error) => {
      console.log("Socket connection failed:", error);
      setSocket(null); // Reset socket state if connection fails
    });

    // Listen for disconnection
    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setSocket(null); // Optionally set socket to null if disconnected
    });
  };

  const disconnectSocket = () => {
    console.log("Disconnecting socket...");
    if (socket?.connected) {
      socket.disconnect();
      setSocket(null);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("disconnect", () => {
        console.log("Socket disconnected.");
      });

      socket.on("connect", () => {
        console.log("Socket reconnected.");
      });
    }
  }, [socket]);

  useEffect(() => {
    console.log("Profile data updated", profileData);
  }, [profileData]);

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
        socket,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthWrapper };
