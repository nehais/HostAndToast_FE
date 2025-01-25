import { useContext } from "react";
import { AuthContext } from "../contexts/auth.context";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  //isLoading any Use here?

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <div>{children}</div>;
};

export default PrivateRoute;
