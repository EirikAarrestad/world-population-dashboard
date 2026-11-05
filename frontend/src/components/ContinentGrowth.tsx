import { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import { format } from "d3-format";
import { API_URL, YEARS } from "../api";
import { darkLayout } from "../plotStyle";

// One row per continent from the backend, with one key per year
type ContinentRow = { continent: string } & Record<string, number>;

const formatNumber = format(",");

// Line chart of total population per continent over time
const ContinentGrowth = () => {
    const [data, setData] = useState<ContinentRow[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/continent_growth`);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <Plot
                useResizeHandler
                style={{ width: "100%", height: "100%" }}
                data={data.map((row) => {
                    const populations = YEARS.map((year) => row[year]);
                    return {
                        type: "scatter" as const,
                        mode: "lines" as const,
                        name: row.continent,
                        x: YEARS,
                        y: populations,
                        text: populations.map((value) => formatNumber(value)),
                        hovertemplate: "<b>%{text}</b><extra></extra>",
                    };
                })}
                layout={{
                    ...darkLayout,
                    title: "Befolkningsvekst",
                    xaxis: { title: "År" },
                    yaxis: { title: "Befolkning" },
                }}
            />
        </div>
    );
};

export default ContinentGrowth;
