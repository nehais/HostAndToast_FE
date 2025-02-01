import { Link } from "react-router-dom";
import "../styles/MealCard.css";

const MealCard = ({ meal }) => {
  const imageUrl =
    meal.imageUrl || "https://cdn.midjourney.com/1671c6ab-9fde-4fd0-a475-344758cc84d2/0_1.png";

  // Function to truncate description
  const truncateText = (text, limit) => {
    return text && text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  // Function to format the pickup time
  const formatPickupTime = (isoString, shortWeekday = false) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);

    // Short or full weekday name
    const weekdayFormat = shortWeekday ? "short" : "long";

    // Format the date as "Wed, 20.02.25" or "Wednesday, 20.02.25"
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
    });

    return `${formattedDate} at ${formattedTime}`;
  };

  return (
    <Link to={`/meals/${meal._id}`} className="meal-card">
      <div className="meal-card-inner">
        {/* Front Side */}
        <div className="meal-card-front">
          <img src={imageUrl} alt={meal.title} />
          <div className="meal-card-infos">
            <h2>{meal.title}</h2>
            <p>
              <strong>Cook: </strong>
              {meal.user.username}
            </p>
            <p>
              <strong>Price: </strong> {meal.price}€
            </p>
          </div>
        </div>

        {/* Back Side */}
        <div className="meal-card-back" style={{ backgroundImage: `url(${imageUrl})` }}>
          <div className="meal-card-back-overlay">
            <h3>More Information</h3>
            <p>{truncateText(meal.description, 100) || "N/A"}</p>
            <div>
              <p>
                <strong>Ready: </strong> {formatPickupTime(meal.pickupTime, true)}
              </p>
              <p>
                <strong>Available Portions: </strong> {meal.plates || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MealCard;
