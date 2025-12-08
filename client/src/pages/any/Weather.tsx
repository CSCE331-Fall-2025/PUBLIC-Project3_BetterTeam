import { useEffect, useState } from "react";
import "./Weather.css";

export default function Weather() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = "fc12533bdd2b4d788cb52620250812";
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Galveston`;//hardcoded for galveston

      const response = await fetch(url);
      const json = await response.json();
      setData(json);
    };

    fetchWeather();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="weather-page" >
      <h1>Weather in Galveston</h1>

      <h2>{data.location.name}, {data.location.country}</h2>
      <p><strong>Temperature:</strong> {data.current.temp_f}°F</p>
      <p><strong>Condition:</strong> {data.current.condition.text}</p>
      <img src={data.current.condition.icon} alt="weather icon" />
	  <p>Orange Chicken is great in this weather!</p>
    </div>
  );
}
