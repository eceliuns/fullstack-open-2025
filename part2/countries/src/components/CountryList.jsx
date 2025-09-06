import Country from "./Country";

const CountryList = ({ countries, newFilter }) => {
  let filteredCountries = countries.filter((country) => {
    return country.name.toLowerCase().includes(newFilter.toLowerCase());
  });

  if (!newFilter.trim()) {
    return null;
  }

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (filteredCountries.length === 0) {
    return <p>No matches found</p>;
  }

  if (filteredCountries.length < 10 && filteredCountries.length != 0) {
    return filteredCountries.map((country) => (
      <Country key={country.name} country={country}></Country>
    ));
  }
};

export default CountryList;
