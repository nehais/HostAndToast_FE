import AddressSearch from "../components/AddressSearch.jsx";
import Select from "react-select";
import { Dropdown } from "react-bootstrap";

import axios from "axios";
import { API_URL } from "../config/apiConfig.js";

const MealForm = ({
  useMealID,
  setUseMealID,
  mealFormData,
  setMealFormData,
  handleSubmit,
  handleError,
  setShowSpinner,
  imgError,
}) => {
  function handleChange(e) {
    //Form change value
    setMealFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function handleImageUpload(e) {
    //prevent the form from reloading
    e.preventDefault();

    const addImages = Array.from(e.target.files);

    //create formData for multer on the server
    const myFormData = new FormData();
    addImages.forEach((image) => {
      myFormData.append("imageUrl", image);
    });

    try {
      setShowSpinner((prev) => !prev); //Show custom spinner during the upload

      const { data } = await axios.post(
        `${API_URL}/api/multiple-uploads`,
        myFormData
      );
      setShowSpinner((prev) => !prev);
      console.log("image uploaded successfully", data);

      setMealFormData((prev) => {
        const updatedImageUrls = [...prev.imageUrl, ...data.imageUrls];
        return { ...prev, imageUrl: updatedImageUrls };
      });
    } catch (error) {
      setShowSpinner((prev) => !prev);
      handleError("File upload failed: ", error);
    }
  }

  function clearImg(index) {
    setMealFormData((prev) => {
      const updatedImageUrls = prev.imageUrl.filter((_, i) => i !== index);
      return { ...prev, imageUrl: updatedImageUrls };
    });
  }

  //Clear the Meal Form
  async function clearMeal(e) {
    e.preventDefault();

    setUseMealID("");

    setMealFormData((prev) => {
      return {
        ...prev,
        title: "",
        cuisine: "Others",
        description: "",
        imageUrl: [],
        allergies: [],
        plates: 1,
        pickupTime: "",
        hosted: false,
        price: 1,
      };
    });
  }

  return (
    <>
      {" "}
      <form onSubmit={handleSubmit} className="meal-form">
        <div className="col-fields">
          <div className="col-field">
            {/*Title Field */}
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              required
              disabled={useMealID ? true : false}
              value={mealFormData.title}
              onChange={handleChange}
              placeholder="The Meal title"
              maxLength="40"
              className={`meal-input ${useMealID ? "input-disabled" : ""}`}
            />

            {/*Description Field */}
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={mealFormData.description}
              placeholder="Describe the Meal"
              onChange={handleChange}
              className="meal-input-desc"
            />
          </div>

          <div className="col-field col-field-img">
            {/*Image Field */}
            <label htmlFor="imageUrl">Meal Images</label>
            <input
              type="file"
              accept="image/*"
              name="imageUrl"
              multiple
              onChange={handleImageUpload}
              className="meal-input meal-input-img"
            />

            {mealFormData.imageUrl.length === 0 && imgError && (
              <p className="errors">Please upload at least one image.</p>
            )}

            <div className="meal-images-containter">
              {mealFormData.imageUrl &&
                mealFormData.imageUrl.map((image, index) => (
                  <div className="meal-image-containter" key={index}>
                    <img
                      src={image}
                      alt="Uploaded Meal Image"
                      className="form-meal-img"
                    />
                    <p onClick={() => clearImg(index)}>X</p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="col-fields">
          <div className="col-field">
            {/*User Preferances Field */}
            <label htmlFor="allergies">User Preferances</label>

            <Select
              options={[
                { value: "Vegan", label: "Vegan 🌿" },
                { value: "Vegetarian", label: "Vegetarian 🥕" },
                { value: "No Peanuts", label: "No Peanuts 🥜" },
                { value: "No Shellfish", label: "No Shellfish 🦐" },
                { value: "No Dairy", label: "No Dairy 🥛" },
                { value: "No Gluten", label: "No Gluten 🍞" },
              ]}
              isMulti
              value={mealFormData.allergies?.map((allergy) => ({
                value: allergy,
                label: allergy,
              }))}
              onChange={(selectedOptions) =>
                setMealFormData((prev) => ({
                  ...prev,
                  allergies: selectedOptions.map((option) => option.value),
                }))
              }
              placeholder="Select User Preferances"
              styles={{ padding: "0 !important" }}
            />
          </div>

          <div className="col-field-cuisine-row">
            <div className="col-field" style={{ width: "35%" }}>
              {/*Cuisine Field */}
              <label htmlFor="cuisine">Cuisine</label>
              <Dropdown
                onSelect={(selectedValue) =>
                  setMealFormData((prev) => ({
                    ...prev,
                    cuisine: selectedValue,
                  }))
                }
              >
                <Dropdown.Toggle
                  variant="warning"
                  id="cuisine-dropdown"
                  className="meal-input"
                >
                  {mealFormData.cuisine || "Select a Cuisine"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Chinese">Chinese</Dropdown.Item>
                  <Dropdown.Item eventKey="Italian">Italian</Dropdown.Item>
                  <Dropdown.Item eventKey="Indian">Indian</Dropdown.Item>
                  <Dropdown.Item eventKey="Chinese">German</Dropdown.Item>
                  <Dropdown.Item eventKey="Mexican">Mexican</Dropdown.Item>
                  <Dropdown.Item eventKey="Others">Others</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="col-field" style={{ width: "25%" }}>
              {/*No. of Plates Field */}
              <label htmlFor="plates">Plates</label>
              <input
                type="number"
                name="plates"
                required
                value={mealFormData.plates}
                onChange={handleChange}
                className="meal-input"
                min={1}
              />
            </div>

            <div className="col-field" style={{ width: "25%" }}>
              {/*Price Field */}
              <label htmlFor="price">Price €</label>
              <input
                type="number"
                name="price"
                required
                value={mealFormData.price}
                onChange={handleChange}
                className="meal-input"
                min={1}
              />
            </div>
          </div>
        </div>

        <div className="col-fields">
          <div className="col-field">
            {/*Address Field */}
            <label htmlFor="address" className="col25">
              Address
            </label>

            <AddressSearch name="address" componentId="meal-form" />
          </div>

          <div className="col-field-row">
            <div className="col-field">
              {/*Pickup Time Field */}
              <label htmlFor="pickupTime">Date</label>
              <input
                type="datetime-local"
                name="pickupTime"
                required
                value={mealFormData.pickupTime}
                onChange={handleChange}
                className="meal-input"
              />
            </div>

            <div className="col-field">
              {/*Is the Meal hosted indicator*/}
              <label htmlFor="hosted">Hosted</label>

              <input
                type="checkbox"
                name="hosted"
                checked={mealFormData.hosted}
                onChange={(e) =>
                  setMealFormData((prev) => ({
                    ...prev,
                    hosted: e.target.checked,
                  }))
                }
                className="meal-input meal-input-checkbox"
              />
            </div>
          </div>
        </div>

        <div className="bottom-buttons">
          {/*Clear the Meal form*/}
          <button
            type="submit"
            variant="primary"
            className="meal-clear-button add-meal-button"
            onClick={clearMeal}
          >
            Clear The Meal
          </button>

          {/*Sumbit the Meal to List it on the Site*/}
          <button
            type="submit"
            variant="primary"
            className="meal-submit-button add-meal-button"
          >
            List Your Meal
          </button>
        </div>
      </form>
    </>
  );
};

export default MealForm;
