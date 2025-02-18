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

  useEffect(() => {
    // Fetch & store the Profile Data
    async function getUserProfile() {
      try {
        const { data } = await axios.get(`${API_URL}/auth/users/${user._id}`);
        setProfileData({
          _id: data._id || "",
          username: data.username || "",
          email: data.email || "",
          address: data.address || {},
          imageUrl: data.imageUrl || "",
          description: data.description || "",
          specialty: data.specialty || "",
        });
      } catch (error) {
        setProfileData({
          username: "",
          email: "",
          address: {},
          imageUrl: "",
          description: "",
          specialty: "",
        });
        console.error("Error getting User", error.response?.data?.message);
      }
    }
    if (user._id) {
      getUserProfile();
    }
  }, [user._id]); // Track only `_id`

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
    if (!user._id) return; // Ensure user ID is available before connecting

    console.log("Connecting socket...");
    const socketInstance = io(API_URL, { transports: ["websocket"] }); // Force WebSocket transport

    // Listen for successful connection
    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      socketInstance.emit("registerUser", user._id); // Now correctly using socketInstance
      setSocket(socketInstance);
    });

    // Handle disconnections
    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setSocket(null);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
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

  // useEffect(() => {
  //   console.log("Profile data updated", profileData);
  // }, [profileData]);

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
