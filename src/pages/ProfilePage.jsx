import "../styles/ProfilePage.css";

import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../contexts/auth.context";
import { useToast } from "../contexts/toast.context.jsx";
import GenModal from "../components/GenModal";
import ProfileUserInfo from "../components/ProfileUserInfo.jsx";
import ProfileDashboard from "../components/ProfileDashboard.jsx";

const ProfilePage = ({ setShowSpinner }) => {
  const { user, profileData, setProfileData, setUser } =
    useContext(AuthContext);
  const { setToast } = useToast(); //Use setToast context to set message
  const [genMessageModal, setGenMessageModal] = useState({
    header: "",
    message: "",
    show: false,
    confirmation: false,
  });
  const [refreshProfile, setRefreshProfile] = useState(0);
  const [userRating, setUserRating] = useState(0);
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
  const orderPAID = "PAID";

  useEffect(() => {
    if (!profileData || !profileData._id) return;

    setShowSpinner((prev) => !prev); //Show custom spinner during update Meal

    setNewProfData({ ...profileData });
    getAllChefMeals(); //Get All the Chef meals
    getChefStats(); //Get the Chefs Statistics
    getAllCustomerOrders(); //Get the customer orders
    getUserRating(); //Get the users rating

    setShowSpinner((prev) => !prev); //Show custom spinner during update Meal
  }, [profileData._id, refreshProfile]);

  //Gets all meals for the User
  async function getAllChefMeals() {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/meals/user/${profileData._id}`
      );

      filterByPickupTime(data);
    } catch (error) {
      handleError("Error fetching All Chef Meals: ", error);
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
      handleError("Error fetching stats: ", error);
    }
  }

  //Gets all orders for the User
  async function getAllCustomerOrders() {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/orders/user/${profileData._id}`
      );

      filterOrderByStatus(data);
    } catch (error) {
      handleError("Error fetching Customer Orders: ", error);
    }
  }

  function filterOrderByStatus(orders) {
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
      } else if (order.status === orderPAID) {
        activeOrders.push(order);
      }
    });

    activeOrders.sort(
      (a, b) => new Date(a.meal.pickupTime) - new Date(b.meal.pickupTime)
    );

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

  //Get Chef rating
  async function getUserRating() {
    try {
      const { data } = await axios.get(
        `${API_URL}/auth/users/rating/${profileData._id}`
      );
      setUserRating(data.averageRating);
    } catch (error) {
      handleError("Error fetching user rating: ", error);
    }
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
            _id: data.address._id,
            displayName: data.address.displayName,
            lat: data.address.lat,
            long: data.address.long,
          },
        };
      });

      setToast({ msg: "User Profile updated", type: "success" });
    } catch (error) {
      setShowSpinner((prev) => !prev);
      handleError("Update User Profile error: ", error);
    }
  }

  function handleError(logMsg, error) {
    console.log(logMsg, error?.response?.data?.message);
    setGenMessageModal({
      header: "Error",
      message: logMsg + error?.response?.data?.message,
      show: true,
    });
  }

  return (
    <div className="profile-page">
      {/*User Profile Info */}
      <ProfileUserInfo
        newProfData={newProfData}
        setNewProfData={setNewProfData}
        handleSubmit={handleSubmit}
        setShowSpinner={setShowSpinner}
        userRating={userRating}
        handleError={handleError}
      />

      {/*User Dashboard for Chef / Buyer */}
      <ProfileDashboard
        chefMeals={chefMeals}
        buyerMeals={buyerMeals}
        platesServed={chefStats.platesServed}
        totalRevenue={chefStats.totalRevenue}
        platesBought={customerStats.platesBought}
        totalPurchase={customerStats.totalPurchase}
        setRefreshProfile={setRefreshProfile}
      />

      {/* Error Modal */}
      <GenModal
        messageObj={genMessageModal}
        handleClose={(prev) => setGenMessageModal({ ...prev, show: false })}
      />
    </div>
  );
};

export default ProfilePage;
