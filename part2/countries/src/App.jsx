import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        const names = response.data.map((country) => ({
          name: country.name.common,
        }));
        setCountries(names);
        console.log(names);
      });
  }, []);

  return <></>;
}

export default App;
