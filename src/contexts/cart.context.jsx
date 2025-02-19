import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./auth.context";
import { API_URL } from "../config/apiConfig.js";
import axios from "axios";

const CartContext = createContext();

const CartWrapper = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : { counter: 0 };
  });
  const { user, isLoggedIn } = useContext(AuthContext);

  // Function to update cart counter
  const updateCartCounter = (amount, setToZero = false) => {
    if (setToZero) {
      setCart((prevCart) => {
        const updatedCart = {
          ...prevCart,
          counter: 0,
        };
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      });
      return;
    }
    setCart((prevCart) => {
      const updatedCart = {
        ...prevCart,
        counter: prevCart.counter + amount,
      };
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  useEffect(() => {
    // console.log("User changed:", user, isLoggedIn);
    async function fetchCart() {
      try {
        const { data } = await axios.get(`${API_URL}/api/orders/user/${user._id}`);
        // console.log("Cart data:", data);
        const ordersReserved = data.filter((order) => order.status === "RESERVED");
        const cartCounter = ordersReserved.reduce((acc, order) => acc + order.plates, 0);
        updateCartCounter(cartCounter);
        // console.log("Cart counter:", cartCounter);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }

    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // Sync with local storage when cart changes
    if (cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, updateCartCounter }}>{children}</CartContext.Provider>
  );
};

export { CartContext, CartWrapper };
