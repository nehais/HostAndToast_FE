import slide1 from "../assets/01_how_it_works_post.jpg";
import slide2 from "../assets/02_how_it_works_book.jpg";
import slide3 from "../assets/03_how_it_works_cook.jpg";
import slide4 from "../assets/04_how_it_works_pick.jpg";
import { useEffect, useState } from "react";

const HowItWorks = () => {
  const slides = [
    { img: slide1, desc: "Chef’s Creation: Meal Posted" },
    { img: slide2, desc: "Reserve Your Flavor: Meal Booked" },
    { img: slide3, desc: "Cooking Magic: Meal in the Making" },
    { img: slide4, desc: "Bon Appétit: Ready for Pickup" },
  ];
  const [slideNo, setSlideNo] = useState(0);
  let slideInterval;

  useEffect(() => {
    slideInterval = setInterval(() => {
      setSlideNo((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 4000);

    return () => {
      //Clean Up on unmount
      clearInterval(slideInterval);
    };
  }, []);

  return (
    <div className="works-container">
      <h2>How the Feast Unfolds</h2>
      <div className="slider-container">
        <div className="slider">
          <img
            src={slides[slideNo].img}
            alt="Slider Image"
            className="img-slide"
          />
          <p className="slide-desc">{slides[slideNo].desc}</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
