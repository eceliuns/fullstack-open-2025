const Weather = ({ country, weather }) => {
  if (!country || !country.capital || !weather) {
    return null;
  }
  return (
    <>
      <h2>Weather in {country.capital[0]}</h2>
      <p>Temperature {weather.temperature} Celsius</p>
      <img src={weather.icon}></img>
      <p>Wind {weather.windSpeed} m/s</p>
    </>
  );
};

export default Weather;
