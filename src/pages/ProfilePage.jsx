import "../styles/ProfilePage.css";

import { AuthContext } from "../contexts/auth.context";
import { useContext } from "react";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  return <div>ProfilePage of User {user}</div>;
};

export default ProfilePage;
