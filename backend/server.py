"""Flask backend serving world population data to the React frontend.

The CSV file has one row per country and one column per year. At startup it
is reshaped to long format (one row per country and year), and the endpoints
below filter and aggregate it.
"""

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

DATA_FILE = "world_population_data.csv"
YEARS = ["1970", "1980", "1990", "2000", "2010", "2015", "2020", "2022", "2023"]
LATEST_YEAR = "2023"

app = Flask(__name__)
CORS(app)  # Allow requests from the frontend, which runs on another port


def load_data(filename: str) -> pd.DataFrame:
    """Load the population data from a CSV file.

    Args:
        filename: Path to the CSV file.

    Returns:
        One row per country, with one population column per year.
    """
    return pd.read_csv(filename)


def to_long_format(df: pd.DataFrame) -> pd.DataFrame:
    """Reshape the data to one row per country and year.

    Args:
        df: Data with one row per country and one column per year.

    Returns:
        Columns country, continent, year (as a string, e.g. "2023") and
        population.
    """
    df_long = df.melt(
        id_vars=["country", "continent"],
        value_vars=YEARS,
        var_name="year",
        value_name="population",
    )
    return df_long


# Loaded once at startup and shared by all endpoints
df = load_data(DATA_FILE)
df_long = to_long_format(df)


@app.route("/continent_growth")
def continent_growth():
    """Total population per continent for each year.

    Returns:
        JSON list with one object per continent, e.g.
        {"continent": "Asia", "1970": ..., "2023": ...}.
    """
    totals = df.groupby("continent")[YEARS].sum().reset_index()
    return jsonify(totals.to_dict(orient="records"))


@app.route("/country_growth")
def country_growth():
    """Population of one country for each year.

    Query parameters:
        country: Name of the country, e.g. "Norway".

    Returns:
        JSON object mapping year to population, e.g. {"1970": ..., "2023": ...}.
    """
    country = request.args.get("country")
    populations = df.loc[df["country"] == country, YEARS].sum()
    return jsonify(populations.to_dict())


@app.route("/get_population_data")
def get_population_data():
    """Population of every country in the latest year.

    Returns:
        JSON list with one object per country.
    """
    latest = df_long[df_long["year"] == LATEST_YEAR]
    return jsonify(latest.to_dict(orient="records"))


@app.route("/get_country_population_data")
def get_country_population_data():
    """Population of every country in one continent in the latest year.

    Query parameters:
        continent: Name of the continent, e.g. "Europe".

    Returns:
        JSON list with one object per country in the continent.
    """
    continent = request.args.get("continent")
    selected = df_long[
        (df_long["continent"] == continent) & (df_long["year"] == LATEST_YEAR)
    ]
    return jsonify(selected.to_dict(orient="records"))


if __name__ == "__main__":
    app.run(debug=True)
