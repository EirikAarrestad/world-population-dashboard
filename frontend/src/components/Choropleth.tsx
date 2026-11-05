import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import { format } from "d3-format";
import { API_URL } from "../api";
import { darkLayout, logPopulationColorbar } from "../plotStyle";

interface PopulationDataItem {
    country: string;
    continent: string;
    year: string;
    population: number;
}

const formatNumber = format(",");

// World map coloured by population in 2023
const Choropleth: React.FC = () => {
    const [populationData, setPopulationData] = useState<PopulationDataItem[]>(
        []
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/get_population_data`
                );
                setPopulationData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="continents">
            <Plot
                useResizeHandler
                style={{ width: "100%", height: "100%" }}
                data={[
                    {
                        type: "choropleth",
                        locations: populationData.map((item) => item.country),
                        locationmode: "country names",
                        // Log scale, so differences between small countries are visible
                        z: populationData.map((item) =>
                            Math.log10(item.population)
                        ),
                        text: populationData.map(
                            (item) =>
                                `${item.country}: ${formatNumber(
                                    item.population
                                )}`
                        ),
                        hovertemplate: "<b>%{text}</b><extra></extra>",
                        marker: { line: { color: "#1a1a1a", width: 1 } },
                        colorscale: "Viridis",
                        colorbar: logPopulationColorbar,
                    },
                ]}
                layout={{
                    ...darkLayout,
                    title: "Verdenskart - Befolkning",
                    hovermode: "closest",
                    geo: {
                        projection_type: "natural earth",
                        showcoastlines: true,
                        showcountries: true,
                        showocean: true,
                        oceancolor: "LightBlue",
                    },
                }}
            />
        </div>
    );
};

export default Choropleth;
