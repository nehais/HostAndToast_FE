import { createContext, useState } from "react";

const CartContext = createContext();

const CartWrapper = ({ children }) => {
  const [cart, setCart] = useState({ counter: 0 });

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartWrapper };
