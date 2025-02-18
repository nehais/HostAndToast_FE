import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config/apiConfig.js";
import { useContext, useEffect, useState } from "react";
import "../styles/SingleMeal.css";
import spoonIcon from "../assets/bowl-spoon.png";
import calendarIcon from "../assets/calendar-clock.png";
import lunchBoxIcon from "../assets/lunch-box.png";
import hostedIcon from "../assets/meeting-alt.png";
import euroIcon from "../assets/euro.png";
import profileIcon from "../assets/profile.png";
import chatIcon from "../assets/messages.png";
import { AuthContext } from "../contexts/auth.context.jsx";
import Rating from "../components/Rating.jsx";
import { useToast } from "../contexts/toast.context.jsx";
import StarRating from "../components/StarRating.jsx";
import GenModal from "../components/GenModal.jsx";
import { CartContext } from "../contexts/cart.context.jsx";

const SingleMeal = () => {
  const { mealId } = useParams();
  const [meal, setMeal] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [numberImages, setNumberImages] = useState(1);
  const [showAllImages, setShowAllImages] = useState(false);
  const [host, setHost] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const { user } = useContext(AuthContext);
  const { setToast } = useToast();
  const nav = useNavigate();
  const [genMessageModal, setGenMessageModal] = useState({
    header: "",
    message: "",
    show: false,
    confirmation: false,
  });
  const { cart, updateCartCounter } = useContext(CartContext);

  // Fetch the meal data
  useEffect(() => {
    const getMeal = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/meals/${mealId}`);
        setMeal(data);
        setNumberImages(data.imageUrl.length);
        setHost(data.user);
      } catch (error) {
        console.log("Error fetching meal", error.response.data.message);
      }
    };
    getMeal();
  }, [mealId]);

  // Fetch the host data
  useEffect(() => {
    if (!meal || !meal.user) return;

    const getHost = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/auth/users/${meal.user}`);
        setHost(data);
      } catch (error) {
        console.log("Error fetching user", error.response?.data?.message || error.message);
      }
    };

    getHost();
  }, [meal]);

  // Fetch the ratings data
  useEffect(() => {
    if (!meal) return;

    const getRatings = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/ratings/meals/${mealId}`);
        setRatings(data);
        console.log("Ratings", data);
      } catch (error) {
        console.log("Error fetching ratings", error.response?.data?.message || error.message);
      }
    };

    getRatings();
  }, [meal]);

  // Fetch the hosts rating
  useEffect(() => {
    if (!host || !host._id) return;

    const getUserRating = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/auth/users/rating/${host._id}`);
        setUserRating(data.averageRating);
      } catch (error) {
        console.log("Error fetching user rating", error.response?.data?.message || error.message);
      }
    };

    getUserRating();
  }, [host]);

  // Format the date and time
  const formatDateTime = (isoString, shortWeekday = false) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);

    // Short or full weekday name
    const weekdayFormat = shortWeekday ? "short" : "long";

    const formattedDate = `${date.toLocaleDateString("en-GB", {
      weekday: weekdayFormat,
    })}, ${date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })}`;

    // Format the time as "18:30"
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${formattedDate} at ${formattedTime}`;
  };

  // Add meal to cart (create new order)
  const handleAddToCart = (event) => {
    event.preventDefault();

    console.log("Add to cart");

    const mealId = meal._id;
    const plates = Number(event.target.quantity.value);
    const price = meal.price;
    const userId = user._id;

    const newOrder = {
      meal: mealId,
      plates,
      price,
      user: userId,
    };

    const addToCart = async () => {
      try {
        const { data } = await axios.post(`${API_URL}/api/orders`, newOrder);
        console.log("Order created", data);

        console.log("Cart before update", cart);

        updateCartCounter(plates);
        console.log("Cart updated", cart);

        nav("/shopping-cart");
      } catch (error) {
        console.log("Error creating the order", error);
      }
    };
    if (user.isLoggedIn) {
      addToCart();
    } else {
      // nav("/");
      setToast({ msg: `Please log in to add meals to your cart!`, type: "danger" });
    }
  };

  const handleEditMeal = () => {
    nav(`/handle-meal?mode=Edit&Id=${meal._id}`);
  };

  function onDelete() {
    //Call Delete API to delete the meal
    axios
      .delete(`${API_URL}/api/meals/${meal._id}`)
      .then(() => {
        nav("/");
        setToast({ msg: `'${meal.title}' Meal was Deleted!`, type: "danger" });
      })
      .catch((error) => console.log("Error during meal delete:", error));
  }

  function handleDelete() {
    //Check for Delete Confirmation
    setGenMessageModal((prev) => ({
      ...prev,
      header: "Delete Confirmation",
      message: "Are you sure, you want to Delete the Meal?",
      show: true,
      confirmation: true,
    }));
  }

  function handleGetInContact() {
    const createMessage = async () => {
      try {
        const { data } = await axios.post(`${API_URL}/api/messages/empty`, {
          receiverId: host._id,
          senderId: user._id,
        });
        nav(`/messages?recieverId=${host._id}`);
      } catch (error) {
        console.log("Error creating message", error.response.data.message);
      }
    };
    createMessage();
  }

  if (!meal) return <div>Loading...</div>;

  return (
    <div className="single-meal">
      <div className="container">
        <div className="header">
          <h1>{meal.title}</h1>
          <Link to={`/all-meals`}>
            <button>Back to all meals</button>
          </Link>
        </div>
        <div className="images-container">
          {/* Only one image */}
          {numberImages === 1 && (
            <div className="main-image">
              <img src={meal.imageUrl[0]} alt={meal.title} />
            </div>
          )}

          {/* Two images */}
          {numberImages === 2 && (
            <>
              <div className="main-image">
                <img src={meal.imageUrl[0]} alt={meal.title} />
              </div>
              <div className="small-images">
                <img src={meal.imageUrl[1]} alt={meal.title} />
              </div>
            </>
          )}

          {/* More than 2 images */}
          {numberImages > 2 && (
            <>
              <div className="main-image">
                <img src={meal.imageUrl[0]} alt={meal.title} />
              </div>
              <div className="small-images">
                <img src={meal.imageUrl[1]} alt={meal.title} />
                <div className="overlay-container">
                  <img src={meal.imageUrl[2]} alt={meal.title} />
                  {numberImages > 3 && !showAllImages && (
                    <button className="show-more-btn" onClick={() => setShowAllImages(true)}>
                      +{numberImages - 3} More
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Show all images in a modal/grid when button is clicked */}
          {showAllImages && (
            <div className="all-images-modal">
              <div className="modal-content">
                <button className="close-btn" onClick={() => setShowAllImages(false)}>
                  ←
                </button>
                <div className="modal-main-image">
                  <img src={meal.imageUrl[0]} alt={meal.title} />
                </div>
                <div className="modal-grid">
                  {meal.imageUrl.slice(1).map((img, index) => (
                    <img key={index} src={img} alt={`Meal image ${index + 1}`} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="info-container">
        <div className="left-column">
          <h2>{meal.cuisine}</h2>
          <p>{meal.description}</p>
          {meal.allergies.map((e) => (
            <p className="one-label" key={e}>
              {e}
            </p>
          ))}
          <p>
            <img src={spoonIcon} alt="Meal icon" className="icon" />
            Plates available: {meal.plates}
          </p>
          <p>
            <img src={calendarIcon} alt="Calendar icon" className="icon" />
            Ready: {formatDateTime(meal.pickupTime, true)}
          </p>
          {meal.hosted ? (
            <p>
              <img src={hostedIcon} className="icon" alt="Host icon" />
              This meal is hosted.
            </p>
          ) : (
            <p>
              <img src={lunchBoxIcon} className="icon" alt="lunchbox icon" />
              This meal is for pickup.
            </p>
          )}
          <p>
            <img src={euroIcon} alt="Price icon" className="icon" />
            Price: {meal.price}€
          </p>
          {user._id !== host._id ? (
            <form onSubmit={handleAddToCart}>
              <label htmlFor="quantity">
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max={meal.plates}
                  defaultValue="1"
                />
              </label>

              <button className="cart-btn">Add to cart</button>
            </form>
          ) : (
            <>
              <button onClick={handleEditMeal}>Edit Meal</button>
              <button onClick={handleDelete}>Delete Meal</button>
            </>
          )}
        </div>
        <div className="right-column">
          <Link to={`/chef/${host._id}`}>
            <div>
              <h2>The Chef</h2>
              <img
                src={host.imageUrl ? host.imageUrl : profileIcon}
                className={!host.imageUrl ? "profile-image default-image" : "profile-image"}
              />
              <div>
                <h3>{host.username}</h3>
              </div>
              <div>
                <StarRating initialValue={userRating ? userRating : 0} editable={false} />
              </div>
            </div>
          </Link>
          {host._id !== user._id && (
            <button className="contact-btn" onClick={handleGetInContact}>
              Get in contact
            </button>
          )}
        </div>
      </div>
      <div className="container ratings-container">
        <h2>Ratings</h2>
        <div className="ratings">
          {ratings.length ? (
            ratings.map((rating) => <Rating rating={rating} key={rating._id} />)
          ) : (
            <p>No ratings yet</p>
          )}
        </div>
      </div>
      <GenModal
        messageObj={genMessageModal}
        handleClose={(prev) => setGenMessageModal({ ...prev, show: false })}
        handleAction={onDelete}
      />
    </div>
  );
};

export default SingleMeal;
