import Toast from "react-bootstrap/Toast";
import { useEffect, useState } from "react";

import { useToast } from "../contexts/toast.context.jsx";

const ToastMessage = () => {
  const { toast } = useToast();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (toast && toast.msg) {
      //Toast message was set. We need to show it
      setShowToast(true);

      let toastTimer = setTimeout(() => {
        setShowToast(false);
        clearTimeout(toastTimer);
      }, 2500);
    }
  }, [toast]);

  return (
    <>
      <Toast
        className="d-inline-block m-1 footer-toast"
        bg={toast.type}
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={1500}
      >
        <Toast.Body className="text-white toast-text">{toast.msg}</Toast.Body>
      </Toast>
    </>
  );
};

export default ToastMessage;
