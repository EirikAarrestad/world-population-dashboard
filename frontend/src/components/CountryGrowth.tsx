import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import { format } from "d3-format";
import "../App.css";
import { API_URL, YEARS } from "../api";
import { darkLayout } from "../plotStyle";

interface CountryGrowthProps {
    country: string;
}

const formatNumber = format(",");

// Line chart of the population of one country over time
const CountryGrowth: React.FC<CountryGrowthProps> = ({ country }) => {
    // Population per year, e.g. { "1970": 557501301, ... }
    const [data, setData] = useState<Record<string, number> | null>(null);

    // Fetch new data whenever the selected country changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/country_growth`, {
                    params: { country },
                });
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [country]);

    if (!data) {
        return null;
    }

    const populations = YEARS.map((year) => data[year]);

    return (
        <div className="continentContainer">
            <Plot
                useResizeHandler
                style={{ width: "100%", height: "100%" }}
                data={[
                    {
                        type: "scatter",
                        mode: "lines",
                        name: country,
                        x: YEARS,
                        y: populations,
                        text: populations.map((value) => formatNumber(value)),
                        hovertemplate: "<b>%{text}</b><extra></extra>",
                    },
                ]}
                layout={{
                    ...darkLayout,
                    title: `Befolkningsvekst i ${country}`,
                    xaxis: { title: "År" },
                    yaxis: { title: "Befolkning" },
                }}
            />
        </div>
    );
};

export default CountryGrowth;
