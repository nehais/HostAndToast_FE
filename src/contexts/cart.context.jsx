import { createContext, useState, useEffect } from "react";

const CartContext = createContext();

const CartWrapper = ({ children }) => {
  console.log("inside CartWrapper******************************************");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : { counter: 0 };
  });

  // Function to update cart counter
  const updateCartCounter = (amount) => {
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
