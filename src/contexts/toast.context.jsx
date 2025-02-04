import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

// CREATE A WRAPPER COMPONENT
function ToastProviderWrapper(props) {
  {
    /*type can hold values 
    Primary - Blue, Danger - Red, Success - Green*/
  }
  const [toast, setToast] = useState({ msg: "", type: "" });

  /* SET UP THE PROVIDER */
  return (
    <ToastContext.Provider value={{ toast, setToast }}>
      {props.children}
    </ToastContext.Provider>
  );
}

export { ToastProviderWrapper };

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
}
