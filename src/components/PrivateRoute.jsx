import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";

const PrivateRoute = ({ children }) => {
  const { isLoading, isLoggedIn } = useContext(AuthContext);

  //User is not logged in so open the Login Modal
  if (!isLoading && !isLoggedIn) {
    return <Navigate to="/?session=out" />;
  }

  return <div>{children}</div>;
};

export default PrivateRoute;
