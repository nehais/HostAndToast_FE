import "../styles/Footer.css";
import GitHubLogo from "../assets/gitOpen.png";

import { Link } from "react-router-dom";
import ToastMessage from "./ToastMessage.jsx";

const Footer = () => {
  return (
    <div className="footer">
      <Link to="https://github.com/girsy01/HostAndToast_FE" target="_blank">
        <img src={GitHubLogo} alt="GitHub" className="github-logo" />
      </Link>

      {/*Show Delete Toast Message*/}
      <ToastMessage className="footer-toast"></ToastMessage>
    </div>
  );
};

export default Footer;
