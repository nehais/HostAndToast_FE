import { useContext } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { CartContext } from "../contexts/cart.context";

const CartButton = () => {
  const { cart } = useContext(CartContext);

  return (
    <>
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id="cart-tooltip">Shopping Cart</Tooltip>}
      >
        <button className="cart-button">
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
