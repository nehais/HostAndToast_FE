import axios from "axios";
import { API_URL } from "../config/apiConfig.js";
import { createContext, useEffect, useState } from "react";

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

  useEffect(() => {
    //Authenticate application on initial application load
    authenticateUser();
  }, []);

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
    const theToken = localStorage.getItem("authToken"); //Check if any session Token exists
    if (theToken) {
      //Verify the existing Token if the session is valid
      try {
        const { data } = await axios.get(`${API_URL}/auth/verify`, {
          headers: { authorization: `Bearer ${theToken}` },
        });
        console.log("Session valid");
        setUser({ username: data.username, _id: data._id }); // Replace the entire object
        setIsLoading(false);
        setIsLoggedIn(true);
      } catch (error) {
        setUser({ username: "", _id: "" }); // Reset state
        setIsLoading(false);
        setIsLoggedIn(false);
        console.error("Error Authenticating", error.response?.data?.message);
      }
    } else {
      //No valid session Token present
      setUser({ username: "", _id: "" }); // Reset state
      setIsLoading(false);
      setIsLoggedIn(false);
      console.log("No Auth Token present");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthWrapper };
