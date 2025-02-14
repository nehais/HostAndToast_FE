import { createContext, useEffect, useState } from "react";

const AddressContext = createContext();

const AddressWrapper = ({ children }) => {
  const [address, setAddress] = useState({ label: null, lat: null, lon: null });

  useEffect(() => {
    // console.log("Address selected", address);
  }, [address]);

  return (
    <AddressContext.Provider value={{ address, setAddress }}>{children}</AddressContext.Provider>
  );
};

export { AddressContext, AddressWrapper };
