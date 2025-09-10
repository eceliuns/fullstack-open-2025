import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import CountryList from "./components/CountryList";

function App() {
  const [countries, setCountries] = useState([]);
  const [newFilter, setNewFilter] = useState("");

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
  };

  return (
    <>
      <Filter value={newFilter} onChange={handleFilterChange}></Filter>
      <CountryList countries={countries} newFilter={newFilter}></CountryList>
    </>
  );
}

export default App;
