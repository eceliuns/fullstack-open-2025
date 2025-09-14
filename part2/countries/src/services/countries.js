import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) =>
    response.data.map((country) => ({
      name: country.name.common,
      capital: country.capital,
      area: country.area,
      languages: Object.values(country.languages || {}),
      flag: country.flags.png,
    }))
  );
};

export default { getAll };
