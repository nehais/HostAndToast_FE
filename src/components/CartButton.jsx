import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/cart.context";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const CartButton = () => {
  const { cart } = useContext(CartContext);
  const nav = useNavigate();

  // Ensure cart is defined and provide a default counter value
  const cartCounter = cart?.counter ?? 0;

  return (
    <>
      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip id="cart-tooltip">
            {cartCounter === 0 ? "Empty Shopping Cart" : `Shopping Cart with ${cartCounter} meals.`}
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
              cartCounter.toString().length > 1 ? "cart-counter align-counter" : "cart-counter"
            }`}
          >
            {cartCounter}
          </p>
        </button>
      </OverlayTrigger>
    </>
  );
};

export default CartButton;
