import { useToast } from "../contexts/toast.context.jsx";

import "../styles/Home.css";

const MealList = () => {
  const { setToast } = useToast(); //Use setToast context to set message

  function toasting() {
    setToast({ msg: "test", type: "success" });
  }

  return (
    <div>
      <button onClick={toasting}>Test Button</button>
    </div>
  );
};

export default MealList;
