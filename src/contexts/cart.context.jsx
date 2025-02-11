import { createContext, useState } from "react";

const CartContext = createContext();

const CartWrapper = ({ children }) => {
  const [cart, setCart] = useState({ counter: 0 });

  // Function to update cart counter
  const updateCartCounter = (amount) => {
    setCart((prevCart) => ({
      ...prevCart,
      counter: prevCart.counter + amount,
    }));
  };

  return (
    <CartContext.Provider value={{ cart, setCart, updateCartCounter }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartWrapper };
