import React from "react";
import "../styles/PageNotFound.css";
import emptyPlateImage from "../assets/emptyPlate.png";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <div className="container">
        <h1>Oops! Looks like this plate is empty.</h1>
        <img src={emptyPlateImage} />
        <Link to="/">
          <button>Back to the Menu</button>
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
