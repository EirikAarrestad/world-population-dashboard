// Shared Plotly settings, so all charts look the same

// Dark background and app font
export const darkLayout = {
    autosize: true,
    paper_bgcolor: "#1a1a1a",
    plot_bgcolor: "#1a1a1a",
    font: {
        color: "white",
        family: "Work Sans, sans-serif",
    },
};

// Maps are coloured by log10(population). The colour bar shows plain numbers.
export const logPopulationColorbar = {
    title: { text: "Befolkning" },
    tickvals: [2, 3, 4, 5, 6, 7, 8, 9],
    ticktext: ["100", "1k", "10k", "100k", "1M", "10M", "100M", "1B"],
};
