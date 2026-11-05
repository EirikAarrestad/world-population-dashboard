import { useEffect, useState } from "react";
import "../App.css";
import Plot from "react-plotly.js";
import axios from "axios";
import { format } from "d3-format";
import { API_URL } from "../api";
import { darkLayout, logPopulationColorbar } from "../plotStyle";

interface PopulationData {
    country: string;
    population: number;
}

interface ContinentChoroplethProps {
    continent: string;
}

const formatNumber = format(",");

// Map of one continent coloured by population in 2023
const ContinentChoropleth: React.FC<ContinentChoroplethProps> = ({
    continent,
}) => {
    const [populationData, setPopulationData] = useState<PopulationData[]>([]);

    // Fetch new data whenever the selected continent changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/get_country_population_data`,
                    { params: { continent } }
                );
                setPopulationData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [continent]);

    return (
        <div className="continentContainer">
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
                    title: "Befolkningskart",
                    hovermode: "closest",
                    geo: {
                        scope: continent.toLowerCase(),
                        resolution: 50,
                    },
                }}
            />
        </div>
    );
};

export default ContinentChoropleth;
