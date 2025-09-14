import Country from "./Country";
import { useEffect } from "react";

const CountryList = ({ countries, newFilter, onClick }) => {
  let filteredCountries = countries.filter((country) => {
    return country.name.toLowerCase().includes(newFilter.toLowerCase());
  });

  useEffect(() => {
    if (filteredCountries.length === 1) {
      onClick(filteredCountries[0]);
    }
  }, [filteredCountries, onClick]);

  if (!newFilter.trim()) {
    return null;
  }

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (filteredCountries.length === 0) {
    return <p>No matches found</p>;
  }

  return filteredCountries.map((country) => (
    <div key={country.name}>
      <Country country={country}></Country>
      <button onClick={() => onClick(country)}>Show</button>
    </div>
  ));
};

export default CountryList;
