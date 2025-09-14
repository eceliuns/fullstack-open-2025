import Weather from "./Weather";

const CompleteCountry = ({ country, weather }) => {
  const languages = country.languages.map((language, index) => (
    <li key={index}>{language}</li>
  ));

  return (
    <div>
      <h1>{country.name}</h1>
      <p>Capital {country.capital.join(", ")}</p>
      <p>Area {country.area}</p>
      <h2>Languages</h2>
      <ul>{languages}</ul>
      <img src={country.flag}></img>
      <Weather country={country} weather={weather}></Weather>
    </div>
  );
};

export default CompleteCountry;
