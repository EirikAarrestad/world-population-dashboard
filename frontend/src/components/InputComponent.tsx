import countries from "./countries";
import React, { useState } from "react";
import styles from "./InputComponent.module.scss";

interface InputComponentProps {
    // Called with the selected continent or country
    onOptionChange: (selectedValue: string) => void;
}

const CONTINENTS = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "Oceania",
    "South America",
];

// Dropdowns for choosing a continent, and a country within that continent
const InputComponent: React.FC<InputComponentProps> = ({ onOptionChange }) => {
    const [selectedContinent, setSelectedContinent] = useState<string>("whole_");
    const [selectedCountry, setSelectedCountry] = useState<string>("all_");

    // Only show countries in the selected continent
    const filteredCountries =
        selectedContinent === "whole_"
            ? countries
            : countries.filter(
                  (country) => country.continent === selectedContinent
              );

    const handleContinentChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedContinent(event.target.value);
        setSelectedCountry("all_");
        onOptionChange(event.target.value);
    };

    const handleCountryChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedCountry(event.target.value);
        onOptionChange(event.target.value);
    };

    return (
        <div className={styles.inputContainer}>
            <div>
                <label htmlFor="continent">Kontinent</label>
                <select
                    name="continent"
                    id="continent"
                    value={selectedContinent}
                    onChange={handleContinentChange}
                >
                    <option value="whole_">Hele verden</option>
                    {CONTINENTS.map((continent) => (
                        <option key={continent} value={continent}>
                            {continent}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="country">Land</label>
                <select
                    name="country"
                    id="country"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                >
                    <option value="all_">Se alle land...</option>
                    {filteredCountries.map((country) => (
                        <option key={country.cca3} value={country.country}>
                            {country.country}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default InputComponent;
