import React, { useEffect, useState } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";
import Forcast from "./forcast";

function Weather() {
  function dateBuilder(d) {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
  }

  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  const [state, setState] = useState({
    lat: undefined,
    lon: undefined,
    city: undefined,
    countryCode: undefined,
    description: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    wind: {
      speed: undefined,
      gust: undefined,
      direction: undefined,
    },
    humidity: undefined,
    visibility: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
    errorMessage: undefined,
  });

  let currentLocation = false;
  const [lat, setLat] = useState(undefined);
  const [lon, setLon] = useState(undefined);

  useEffect(() => {
    // GET USER LOCATION
    const getPosition = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    };

    if (navigator.geolocation) {
      getPosition()
        //If user allow location service then will fetch data & send it to get-weather function.
        .then((position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        })
        .catch((err) => {
          //If user denied location service then standard location weather will le shown on basis of latitude & latitude.
          setLat(28.67);
          setLon(77.22);
          alert(
            "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
          );
        });
    } else {
      alert("Geolocation not available");
    }
  });

  useEffect(() => {
    const getWeather = async () => {
      try {
        const response = await axios.get(
          `${apiKeys.base}current?lat=${lat}&lon=${lon}&key=${apiKeys.key}`
        );
        const result = response.data;
        setState({
          lat: result.lat,
          lon: result.lon,
          city: result.city_name,
          countryCode: result.country_code,
          description: result.weather.description,
          temperatureC: Math.round(result.temp),
          temperatureF: Math.round(result.temp * 1.8 + 32),
          wind: {
            speed: result.wind_spd,
            gust: result.gust,
            direction: result.wind_dir,
          },
          humidity: result.rh,
          visibility: result.vis,
        });
        console.log(result);
      } catch (error) {
        console.log(error.message);
      }

      setTimeout(getWeather(), 600000);
      switch (state.description) {
        case "Clear sky":
          setState({ icon: "CLEAR_DAY" });
          break;
        case "Few clouds":
          setState({ icon: "PARTLY_CLOUDY_DAY" });
          break;
        case "Broken clouds":
          setState({ icon: "CLOUDY" });
          break;
        case "Moderate Rain":
          setState({ icon: "RAIN" });
          break;
        case "Snow":
          setState({ icon: "SNOW" });
          break;
        case "Heavy sleet":
          setState({ icon: "WIND" });
          break;
        case "Sleet":
          setState({ icon: "SLEET" });
          break;
        case "Fog":
          setState({ icon: "FOG" });
          break;
        case "Haze":
          setState({ icon: "FOG" });
          break;
        case "Thunderstorm with rain":
          setState({ icon: "WIND" });
          break;
        default:
          setState({ icon: "CLEAR_DAY" });
      }
    };
  });

  if (currentLocation) {
    return (
      <>
        <img
          src={loader}
          style={{ width: "50%", WebkitUserDrag: "none" }}
          className="icon"
        />
        <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
          Detecting your location
        </h3>
        <h3 style={{ color: "white", marginTop: "10px" }}>
          Your current location wil be displayed on the App <br></br> & used for
          calculating Real time weather.
        </h3>
      </>
    );
  } else {
    return (
      <>
        <div className="city">
          <div className="title">
            <h2>{state.city}</h2>
            <h3>{state.country}</h3>
          </div>
          <div className="mb-icon">
            <ReactAnimatedWeather
              icon={state.icon}
              color={defaults.color}
              size={defaults.size}
              animate={defaults.animate}
            />
            <p>{state.main}</p>
          </div>
          <div className="date-time">
            <div className="dmy">
              <div id="txt"></div>
              <div className="current-time">
                <Clock format="HH:mm:ss" interval={1000} ticking={true} />
              </div>
              <div className="current-date">{dateBuilder(new Date())}</div>
            </div>
            <div className="temperature">
              <p>
                {state.temperatureC}°<span>C</span>
              </p>
              {/* <span className="slash">/</span>
                {state.temperatureF} &deg;F */}
            </div>
          </div>
        </div>
        <Forcast icon={state.icon} weather={state} lat={lat} lon={lon} />
      </>
    );
  }
}

export default Weather;
