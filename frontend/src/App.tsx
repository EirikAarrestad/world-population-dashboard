import "./App.css";
import React, { useState } from "react";
import InputComponent from "./components/InputComponent";
import ContinentChoropleth from "./components/ContinentChoropleth";
import CountryGrowth from "./components/CountryGrowth";
import Slideshow from "./components/Slideshow";

// Special values from the dropdowns: the whole world, or all countries
const WHOLE_WORLD = "whole_";
const ALL_COUNTRIES = "all_";

const CONTINENTS = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "Oceania",
    "South America",
];

const App: React.FC = () => {
    // Latest selection in the dropdowns, and the selection currently shown
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [shownOption, setShownOption] = useState<string>("");

    // Choose which visualisation to show for the current selection
    const renderContent = () => {
        if (
            !shownOption ||
            shownOption === WHOLE_WORLD ||
            shownOption === ALL_COUNTRIES
        ) {
            return <Slideshow />;
        }
        if (CONTINENTS.includes(shownOption)) {
            return <ContinentChoropleth continent={shownOption} />;
        }
        return <CountryGrowth country={shownOption} />;
    };

    return (
        <div className="grid-container">
            {/* Title and controls at the top, visualisation below */}
            <header className="header">
                <div>
                    <h2>Verdens befolkning</h2>
                    <p>
                        Velg mellom å se befolkningsveksten til et land eller
                        kontinent
                    </p>
                </div>
                <div className="controls">
                    <InputComponent onOptionChange={setSelectedOption} />
                    <button onClick={() => setShownOption(selectedOption)}>
                        Se data
                    </button>
                </div>
            </header>
            <div className="content">{renderContent()}</div>
        </div>
    );
};

export default App;
