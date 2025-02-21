import { createContext, useState } from "react";

const RefreshProfContext = createContext();

// CREATE A WRAPPER COMPONENT
function RefreshProfWrapper({ children }) {
  const [refreshProf, setRefreshProf] = useState(0);

  /* SET UP THE PROVIDER */
  return (
    <RefreshProfContext.Provider value={{ refreshProf, setRefreshProf }}>
      {children}
    </RefreshProfContext.Provider>
  );
}

export { RefreshProfContext, RefreshProfWrapper };
