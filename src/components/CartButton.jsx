import { useContext } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { CartContext } from "../contexts/cart.context";

import { Link, useNavigate } from "react-router-dom";

const CartButton = () => {
  const { cart } = useContext(CartContext);
  const nav = useNavigate();

  return (
    <>
      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip id="cart-tooltip">
            {cart.counter === 0
              ? "Empty Shopping Cart"
              : `Shopping Cart with ${cart.counter} meals.`}
          </Tooltip>
        }
      >
        <button
          className="cart-button"
          onClick={() => {
            nav("/shopping-cart");
          }}
        >
          <p
            className={` ${
              cart.counter.toString().length > 1
                ? "cart-counter align-counter"
                : "cart-counter"
            }`}
          >
            {cart.counter}
          </p>
        </button>
      </OverlayTrigger>
    </>
  );
};

export default CartButton;
