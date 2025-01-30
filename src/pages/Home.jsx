import "../styles/Home.css";

import AddressSearch from "../components/AddressSearch";
import HowItWorks from "../components/HowItWorks";

const Home = () => {
  return (
    <div>
      <div className="address-container">
        <AddressSearch componentId="home" />
      </div>
      <HowItWorks />
    </div>
  );
};

export default Home;
