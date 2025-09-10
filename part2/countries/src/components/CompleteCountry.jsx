const CompleteCountry = ({ country }) => {
  //   const capitals = country.capital.map((capital, index) => {
  //     return <p key={index}>{capital}</p>;
  //   });
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
    </div>
  );
};

export default CompleteCountry;
