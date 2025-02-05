import "../styles/Spinner.css";

import ForkIcon from "../assets/spinner-fork.png";
import PlateIcon from "../assets/spinner-plate.png";
import SpoonIcon from "../assets/spinner-spoon.png";

const CustomSpinner = () => {
  return (
    <div className="customer-spinner">
      <img src={ForkIcon} alt="Fork Icon" className="spinner-frok" />
      <img src={PlateIcon} alt="Fork Icon" className="spinner-plate" />
      <img src={SpoonIcon} alt="Fork Icon" className="spinner-spoon" />
    </div>
  );
};

export default CustomSpinner;
