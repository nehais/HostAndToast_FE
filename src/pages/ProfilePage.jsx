import "../styles/ProfilePage.css";

import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { useContext, useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { AuthContext } from "../contexts/auth.context";
import { useToast } from "../contexts/toast.context.jsx";
import UserProfileInfo from "../components/UserProfileInfo.jsx";

const ProfilePage = ({ setShowSpinner }) => {
  const [key, setKey] = useState("chef");
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

  useEffect(() => {
    if (profileData) setNewProfData({ ...profileData });
  }, [profileData]);

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
      <div style={{ width: "50%" }}>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="chef" title="Chef's Dashboard">
            <div style={{ height: "75vh", border: "1px solid white" }}>
              <h2>You have 0 Up coming Meals v</h2>
            </div>
          </Tab>
          <Tab eventKey="buyer" title="Buyers's Dashboard">
            <div>
              <h3>Tab content for Buyer</h3>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
