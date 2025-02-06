import "../styles/Home.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AddressSearch from "../components/AddressSearch";
import HowItWorks from "../components/HowItWorks";
import LogInModal from "../components/LogInModal.jsx";

const Home = () => {
  const [modalShowLogIn, setModalShowLogIn] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const session = searchParams.get("session"); //Check if newly created book

  //Private route hit. Login 1st
  useEffect(() => {
    if (session === "out") {
      setModalShowLogIn(true);
    }
  }, [session]);

  return (
    <div>
      <div className="address-container">
        <AddressSearch componentId="home" />
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
