import "../styles/Footer.css";
import GitHubLogo from "../assets/gitOpen.png";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <Link to="https://github.com/girsy01/HostAndToast_FE" target="_blank">
        <img src={GitHubLogo} alt="GitHub" className="github-logo" />
      </Link>
    </div>
  );
};

export default Footer;
