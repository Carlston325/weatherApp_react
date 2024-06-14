import React, { useState, useEffect } from "react";
import axios from "axios";
import { locationApiKey } from "./apiKeys";
import ReactAnimatedWeather from "react-animated-weather";

function Forcast(props) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState({
    lat: undefined,
    lon: undefined,
    place: undefined,
  });
  const [error, setError] = useState("");

  const search = async () => {
    try {
      const response = await axios.get(
        `${locationApiKey.base}search?key=${locationApiKey.key}&q=${query}&format=json&`
      );
      const result = response.data[0];
      setLocation({
        place: result.display_name,
        lat: result.lat,
        lon: result.lon,
      });
      setQuery("");
      console.log(result);
    } catch (error) {
      console.log(error);
      setQuery("");
      setError({ message: "Not Found", query: query });
    }
  };

  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  useEffect(() => {
    search("Feltham");
  }, []);

  return (
    <div className="forecast">
      <div className="forecast-icon">
        <ReactAnimatedWeather
          icon={props.icon}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>
      <div className="today-weather">
        <h3>{props.weather.city}</h3>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Enter City & Postcode"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <div className="img-box">
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              onClick={search}
              alt="search icon"
            />
          </div>
        </div>
        <ul>
          {props.weather.description !== "undefined" ? (
            <div>
              <li className="cityHead">
                <p>{location.place}</p>
              </li>
              <li>
                Temperature
                <span className="temp">
                  {Math.round(props.weather.temperatureC)}°c (
                  {props.weather.description})
                </span>
              </li>
              <li>
                Humidity
                <span className="temp">
                  {Math.round(props.weather.humidity)}%
                </span>
              </li>
              <li>
                Visibility
                <span className="temp">
                  {Math.round(props.weather.visibility)} mi
                </span>
              </li>
              <li>
                Wind Speed
                <span className="temp">
                  {Math.round(props.weather.wind.speed)} Km/h
                </span>
              </li>
            </div>
          ) : (
            <li>{error}</li>
          )}
        </ul>
      </div>
    </div>
  );
}
export default Forcast;
