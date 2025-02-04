import { Carousel } from "react-bootstrap";

const ImageCarousel = ({ imageUrls }) => {
  return (
    <div style={{ width: "100px" }}>
      <Carousel>
        {imageUrls.map((url, index) => (
          <Carousel.Item key={index}>
            <img
              className="carousel-img"
              src={url}
              alt={`Slide ${index + 1}`}
            />
            <Carousel.Caption></Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
