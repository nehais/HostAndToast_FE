import "../styles/ProfilePage.css";
import profileIcon from "../assets/profile.png";

import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

import { useContext, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import { AuthContext } from "../contexts/auth.context";
import { useToast } from "../contexts/toast.context.jsx";
import AddressSearch from "../components/AddressSearch.jsx";

const ProfilePage = ({ setShowSpinner }) => {
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

  function handleChange(e) {
    //Form change value
    setNewProfData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function handleAdrChange(displayName, lat, long) {
    setNewProfData((prev) => {
      return {
        ...prev,
        address: {
          ...prev.address,
          displayName: displayName,
          lat: lat,
          long: long,
        },
      };
    });
  }

  async function handleImgUpload(e) {
    const file = e.target.files[0];

    try {
      setShowSpinner((prev) => !prev); //Show custom spinner during the upload

      // Upload the image to Cloudinary
      console.log("Uploading Image...");
      const uploadedUrl = await uploadToCloudinary(file, "Image"); // Upload to Cloudinary

      setShowSpinner((prev) => !prev); //Show custom spinner during the upload
      if (uploadedUrl) {
        setNewProfData((prev) => {
          return {
            ...prev,
            imageUrl: uploadedUrl,
          };
        });
      }
    } catch (error) {
      setShowSpinner((prev) => !prev); //Show custom spinner during the upload

      console.error("File upload failed:", error);
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
    <form className="profile-page" onSubmit={handleSubmit}>
      <div className="pp-user-info">
        <div className="col-field-prof-img">
          <h3 id="mobileProfHeader">Your Profile</h3>

          <img
            src={newProfData.imageUrl ? newProfData.imageUrl : profileIcon}
            alt="Profile Image"
            className="pp-img"
          />

          {/*Change Image Field */}

          <label htmlFor="cuisine">Change Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            name="imageUrl"
            onChange={handleImgUpload}
            className="profile-input-img"
          />
        </div>

        <div className="profile-info">
          <h3 id="otherProfHeader">Your Profile</h3>

          <div className="col-fields">
            <div className="col-field">
              {/*Title Field */}
              <label htmlFor="username">User Name</label>
              <input
                type="text"
                name="username"
                required
                value={newProfData.username}
                placeholder="Please enter your User Name"
                onChange={handleChange}
                className="profile-input"
              />
            </div>

            <div className="col-field">
              {/*Email Field */}
              <label htmlFor="email">User Login Email</label>
              <input
                type="email"
                name="email"
                disabled={true}
                value={newProfData.email}
                placeholder="Please enter your User Name"
                onChange={handleChange}
                className="profile-input  input-disabled"
              />
            </div>
          </div>

          {/*Description Field */}
          <div className="col-field-100">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={newProfData.description}
              required
              placeholder="Tell us about yourself"
              onChange={handleChange}
              className="profile-input-desc"
            />
          </div>

          <div className="col-fields">
            {/*Cuisine Field */}
            <div className="col-field">
              <label htmlFor="cuisine">Specialty</label>
              <Dropdown
                onSelect={(selectedValue) =>
                  setNewProfData((prev) => ({
                    ...prev,
                    specialty: selectedValue,
                  }))
                }
              >
                <Dropdown.Toggle
                  variant="primary"
                  id="cuisine-dropdown"
                  className="profile-input"
                >
                  {newProfData.specialty || "Select Specialty"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Italian">Italian</Dropdown.Item>
                  <Dropdown.Item eventKey="Mexican">Mexican</Dropdown.Item>
                  <Dropdown.Item eventKey="Indian">Indian</Dropdown.Item>
                  <Dropdown.Item eventKey="Chinese">Chinese</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/*Address Field */}
            <div className="col-field">
              <label htmlFor="address">Address</label>
              <AddressSearch
                name="address"
                componentId="profile"
                handleAdrChange={handleAdrChange}
              />
            </div>
          </div>
        </div>
      </div>

      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip id="update-profile-tooltip">
            Update your User profile
          </Tooltip>
        }
      >
        <Button
          variant="success"
          className="upd-profile-button button-shadow"
          type="submit"
        >
          Update Your Profile
        </Button>
      </OverlayTrigger>
    </form>
  );
};

export default ProfilePage;
