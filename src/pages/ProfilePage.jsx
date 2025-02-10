import "../styles/ProfilePage.css";

import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../contexts/auth.context";
import { useToast } from "../contexts/toast.context.jsx";
import UserProfileInfo from "../components/UserProfileInfo.jsx";
import ProfileDashboard from "../components/ProfileDashboard.jsx";

const ProfilePage = ({ setShowSpinner, meals }) => {
  const { user, profileData, setProfileData, setUser } =
    useContext(AuthContext);
  const { setToast } = useToast(); //Use setToast context to set message
  const [newProfData, setNewProfData] = useState({
    username: "",
    email: "",
    address: {},
    imageUrl: "",
    description: "",
    specialty: "",
  });
  const [chefMeals, setChefAMeals] = useState({
    activeMeals: [],
    expiredMeals: [],
  });
  const [buyerMeals, setBuyerMeals] = useState({
    activeMeals: [],
    expiredMeals: [],
  });
  const [chefStats, setChefStats] = useState({
    platesServed: 0,
    totalRevenue: 0,
  });
  const [customerStats, setCustomerStats] = useState({
    platesBought: 0,
    totalPurchase: 0,
  });
  const orderFINISHED = "FINISHED";

  useEffect(() => {
    if (profileData) {
      setNewProfData({ ...profileData });

      if (profileData._id) {
        getAllChefMeals();
        getChefStats();
        getAllCustomerOrders();
      }
    }
  }, [profileData]);

  //Gets all meals for the User
  async function getAllChefMeals() {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/meals/user/${profileData._id}`
      );

      filterByPickupTime(data);
    } catch (error) {
      //handleError("Error fetching meals: ", error);
    }
  }

  function filterByPickupTime(meals) {
    const currentTime = new Date(); // Get the current date and time
    let expiredMeals = [];
    let activeMeals = [];

    meals.forEach((meal) => {
      const pickupTime = new Date(meal.pickupTime); // Convert pickupTime to a Date object
      // Check if pickupTime is less than currentTime
      if (pickupTime < currentTime) {
        expiredMeals.push(meal);
      } else {
        activeMeals.push(meal);
      }
    });

    setChefAMeals((prev) => {
      return { ...prev, activeMeals: activeMeals, expiredMeals: expiredMeals };
    });
  }

  //Gets all stats for the chef
  async function getChefStats() {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/orders/chef-stats/${profileData._id}`
      );

      setChefStats({
        platesServed: data.platesServed,
        totalRevenue: data.totalRevenue,
      });
    } catch (error) {
      //handleError("Error fetching stats: ", error);
    }
  }

  //Gets all orders for the User
  async function getAllCustomerOrders() {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/orders/user/${profileData._id}`
      );

      filterByStatus(data);
    } catch (error) {
      //handleError("Error fetching meals: ", error);
    }
  }

  function filterByStatus(orders) {
    let expiredOrders = [];
    let activeOrders = [];
    let platesBought = 0;
    let totalPurchase = 0;

    orders.forEach((order) => {
      // Check if order is completed
      if (order.status === orderFINISHED) {
        expiredOrders.push(order);
        platesBought += order.plates;
        totalPurchase += order.price;
      } else {
        activeOrders.push(order);
      }
    });

    setBuyerMeals((prev) => {
      return {
        ...prev,
        activeOrders: activeOrders,
        expiredOrders: expiredOrders,
      };
    });

    setCustomerStats({
      platesBought: platesBought,
      totalPurchase: totalPurchase,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setShowSpinner((prev) => !prev); //Show custom spinner during update Meal
      const { data } = await axios.put(
        `${API_URL}/auth/users/${user._id}`,
        newProfData
      );

      setShowSpinner((prev) => !prev);
      console.log("User Profile updated", data);

      setUser((prev) => {
        return {
          ...prev,
          username: data.username,
        };
      });

      setProfileData((prev) => {
        return {
          ...prev,
          username: data.username,
          imageUrl: data.imageUrl,
          description: data.description,
          specialty: data.specialty,
          address: {
            ...prev.address,
            displayName: data.address.displayName,
            lat: data.address.lat,
            long: data.address.long,
          },
        };
      });

      setToast({ msg: "User Profile updated", type: "success" });
    } catch (error) {
      setShowSpinner((prev) => !prev);
      //handleError("Update Meal Error: ", error);
    }
  }

  return (
    <div className="profile-page">
      {/*User Profile Info */}
      <UserProfileInfo
        newProfData={newProfData}
        setNewProfData={setNewProfData}
        handleSubmit={handleSubmit}
        setShowSpinner={setShowSpinner}
      />

      {/*User Dashboard for Chef / Buyer */}
      <ProfileDashboard
        chefMeals={chefMeals}
        buyerMeals={buyerMeals}
        platesServed={chefStats.platesServed}
        totalRevenue={chefStats.totalRevenue}
        platesBought={customerStats.platesBought}
        totalPurchase={customerStats.totalPurchase}
      />
    </div>
  );
};

export default ProfilePage;
