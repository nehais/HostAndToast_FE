import "../styles/AboutUs.css";
import imageFranzi from "../assets/imageFranzi.jpg";
import imageNeha from "../assets/imageNeha.jpg";

const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="container">
        <h1>About Host & Toast</h1>
        <p>
          Welcome to Host & Toast – a place where homemade meals find a home! 🍽️
        </p>
        <p>
          We believe that good food should never go to waste. That’s why we
          created this platform for home cooks to share their extra meals with
          others. Whether you’ve prepared more than you’ll eat or are looking
          for a delicious homemade dish nearby, Host & Toast connects people
          through food.
        </p>
        <p>
          This project was created during our Full-Stack Web Development course
          to explore how technology can bring people together.
        </p>
        <p>Bon appétit! 🥂 </p>
      </div>

      <div className="container">
        <h2>Meet the Team</h2>
        <div className="team">
          <div className="team-member">
            <img src={imageNeha} alt="Neha Sinha" />
            <h3>Neha Sinha</h3>
            <p>Full-Stack Developer</p>
            <button>
              <a
                href="https://www.linkedin.com/in/neha-sinha-builds/" // Replace with actual LinkedIn link
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin-link"
              >
                Connect on LinkedIn
              </a>
            </button>
          </div>
          <div className="team-member">
            <img src={imageFranzi} alt="Franziska Scheer" />
            <h3>Franziska Scheer</h3>
            <p>Full-Stack Developer</p>
            <button>
              <a
                href="https://www.linkedin.com/in/franziska-scheer" // Replace with actual LinkedIn link
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin-link"
              >
                Connect on LinkedIn
              </a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
