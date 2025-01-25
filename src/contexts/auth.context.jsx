import axios from "axios";
import { API_URL } from "../config/apiConfig.js";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    //Authenticate application on initial application load
    authenticateUser();
  }, []);

  const authenticateUser = async () => {
    const theToken = localStorage.getItem("authToken");
    if (theToken) {
      try {
        const { data } = await axios.get(`${API_URL}/auth/verify`, {
          headers: { authorization: `Bearer ${theToken}` },
        });
        console.log("Session valid");
        setUser(data.username); //Check with Franzi
        setIsLoading(false);
        setIsLoggedIn(true);
      } catch (error) {
        setUser(null);
        setIsLoading(false);
        setIsLoggedIn(false);
        console.log("Error Authenticating", error.response.data.message);
      }
    } else {
      setUser(null);
      setIsLoading(false);
      setIsLoggedIn(false);
      console.log("No Auth Token present");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn, authenticateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthWrapper };
