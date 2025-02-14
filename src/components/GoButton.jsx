import { useContext } from "react";
import { AddressContext } from "../contexts/address.context";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";

const GoButton = () => {
  const { address } = useContext(AddressContext);
  return (
    <>
      <Link to="/all-meals">
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="cart-tooltip">
              {address && address.label
                ? "Go to the list of Meals"
                : "Please enter the address to go the list of Meals"}
            </Tooltip>
          }
        >
          <button
            className={`go-button  ${
              address && address.label ? "" : "disabled-go"
            }`}
            disabled={address && address.label ? false : true}
          >
            GO
          </button>
        </OverlayTrigger>
      </Link>
    </>
  );
};

export default GoButton;
