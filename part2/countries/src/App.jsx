import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import CountryList from "./components/CountryList";
import CompleteCountry from "./components/CompleteCountry";
import countryService from "./services/countries";
import weatherService from "./services/weather";

function App() {
  const [countries, setCountries] = useState([]);
  const [weather, setWeather] = useState(null);
  const [newFilter, setNewFilter] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

  useEffect(() => {
    countryService
      .getAll()
      .then(setCountries)
      .catch((error) => {
        console.error("Failed to fetch countries:", error.message);
      });
  }, []);

  useEffect(() => {
    if (!selectedCountry?.capital) return;

    weatherService
      .getWeather(selectedCountry.capital, apiKey)
      .then(setWeather)
      .catch((err) => console.error("Weather fetch error:", err.message));
  }, [selectedCountry, apiKey]);

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
    setSelectedCountry(null);
  };

  const handleShow = (country) => {
    setSelectedCountry(country);
  };

  return (
    <>
      <Filter value={newFilter} onChange={handleFilterChange}></Filter>
      <CountryList
        countries={countries}
        newFilter={newFilter}
        onClick={handleShow}
        weather={weather}
      ></CountryList>
      {selectedCountry && (
        <CompleteCountry country={selectedCountry} weather={weather} />
      )}
    </>
  );
}

export default App;
