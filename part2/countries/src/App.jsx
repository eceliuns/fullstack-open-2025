import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import CountryList from "./components/CountryList";
import CompleteCountry from "./components/CompleteCountry";

function App() {
  const [countries, setCountries] = useState([]);
  const [newFilter, setNewFilter] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        const countriesData = response.data.map((country) => ({
          name: country.name.common,
          capital: country.capital,
          area: country.area,
          languages: Object.values(country.languages || {}),
          flag: country.flags.png,
        }));
        setCountries(countriesData);
        console.log(countriesData);
      });
  }, []);

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
      ></CountryList>
      {selectedCountry && <CompleteCountry country={selectedCountry} />}
    </>
  );
}

export default App;
