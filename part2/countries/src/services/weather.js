import axios from "axios";

const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

const getWeather = (capital, apiKey) => {
  const url = `${baseUrl}?q=${capital}&units=metric&appid=${apiKey}`;
  return axios.get(url).then((res) => {
    const data = res.data;

    return {
      temperature: data.main.temp,
      windSpeed: data.wind.speed,
      icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    };
  });
};

export default { getWeather };
