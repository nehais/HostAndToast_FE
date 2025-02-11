import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/auth.context";
import { API_URL } from "../config/apiConfig.js";
import axios from "axios";

const Cart = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      // Fetch orders
      const fetchOrders = async () => {
        try {
          const { data } = await axios.get(`${API_URL}/api/orders/user/${user._id}`);
          console.log("Orders fetched successfully.", data);
          setOrders(data);
        } catch (error) {
          console.log("Error fetching the orders.", error);
        }
      };
      fetchOrders();
    }
  }, [user]);

  return <div>Cart</div>;
};
export default Cart;
