import "react-slideshow-image/dist/styles.css";
import { Slide } from "react-slideshow-image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ContinentGrowth from "./ContinentGrowth";
import Choropleth from "./Choropleth";
import styles from "./Slideshow.module.scss";

const slides = [<ContinentGrowth />, <Choropleth />];

// Room on the sides so the arrows do not cover the charts
const slideStyle = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "20px 64px",
};

const arrowStyle = {
    fontSize: "24px",
    color: "white",
    margin: "0 8px",
    backgroundColor: "transparent",
    padding: "10px 15px",
};

// Carousel with the continent growth chart and the world map
const Slideshow = () => {
    return (
        <div className={styles.container}>
            <Slide
                autoplay={false}
                prevArrow={
                    <div style={arrowStyle}>
                        <FaArrowLeft />
                    </div>
                }
                nextArrow={
                    <div style={arrowStyle}>
                        <FaArrowRight />
                    </div>
                }
            >
                {slides.map((slide, index) => (
                    <div key={index} className={styles.slide}>
                        <div style={slideStyle}>{slide}</div>
                    </div>
                ))}
            </Slide>
        </div>
    );
};

export default Slideshow;
