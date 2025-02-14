import "../styles/Home.css";
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import AddressSearch from "../components/AddressSearch";
import HowItWorks from "../components/HowItWorks";
import LogInModal from "../components/LogInModal.jsx";
import GoButton from "../components/GoButton.jsx";
import { AuthContext } from "../contexts/auth.context";

const Home = () => {
  const [modalShowLogIn, setModalShowLogIn] = useState(false);
  const { isLoggedIn } = useContext(AuthContext); // Get the isLoggedIn state from context
  const [searchParams, setSearchParams] = useSearchParams();
  const session = searchParams.get("session"); // Check if newly created book

  useEffect(() => {
    if (session === "out" && !isLoggedIn) {
      setModalShowLogIn(true); // Only show the modal if the user is logged out
    }
  }, [session, isLoggedIn]);

  return (
    <div>
      <div className="address-container">
        <AddressSearch componentId="home" />
        <GoButton />
      </div>
      <HowItWorks />

      <LogInModal
        show={modalShowLogIn}
        onHide={() => setModalShowLogIn(false)}
      />
    </div>
  );
};

export default Home;
