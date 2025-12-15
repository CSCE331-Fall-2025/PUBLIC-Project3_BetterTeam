import { useEffect, useState } from "react";
import Button from "../../components/ButtonComponents/Button";
import "./Weather.css";

export default function Weather() {
  const [data, setData] = useState<any>(null);
  const [place, setPlace] = useState<string>("Galveston");
  const [trigger, setTrigger] = useState<number>(0);
  const [error, setError] = useState<string|null>(null);
  const [inputValue, setInputValue] = useState<string>("Galveston");

  useEffect(() => {
    const fetchWeather = async () => {
		try {
			setError(null);
			const apiKey = "fc12533bdd2b4d788cb52620250812";
			const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${place}`;//hardcoded for galveston

			const response = await fetch(url);
			const json = await response.json();

			if (!response.ok || json.error) {
				throw new Error(json?.error?.message || "Location not found");
			}
			setData(json);
		}
		catch (err:any) {
			setData(null);
			setError(err.message);
		}
    };

    fetchWeather();
  }, [trigger, place]);
  
  const recommendation = (): string => {
	if(data.current.condition.text==="Sunny"){return "Kung Pao Chicken is great in this weather!"};
	if(data.current.condition.text==="Overcast"){return "Try the Honey Walnut Shrimp!"};
	if(data.current.condition.text==="Cloudy"){return "Try our Black Pepper Sirloin Steak!"};
	if(data.current.condition.text==="Partly Cloudy"){return "Try our Mushroom Chicken!"};
	if(data.current.condition.text==="Clear"){return "Teriyaki Chicken is great in this Weather!"};
	if(data.current.condition.text==="Mist"){return "Try our world famous Broccoli Beef!"};
	return "You should try our Orange Chicken!";
  }

  const handleGet = () => {
	if(!inputValue) return;
	setPlace(inputValue);
	setTrigger(prev=>prev+1);
  }

  return (
    <div className="weather-page" >
      <h1>Weather</h1>
	  <input id="in" placeholder="Enter Location" value={inputValue} onChange={(e)=>setInputValue(e.target.value)}/>
	  <Button name="Get Weather" onClick={handleGet} className="weatherbutton" />
		{error ? 
			(<div>
				<h2> Invalid Location! </h2>
			</div>) : 
		!data ? 
		(<p>Loading</p>) : 
		(<div>
			<h2>{data.location.name}, {data.location.country}</h2>
			<p><strong>Temperature:</strong> {data.current.temp_f}°F</p>
			<p><strong>Condition:</strong> {data.current.condition.text}</p>
			<img src={data.current.condition.icon} alt="weather icon" />
			<p>{recommendation()}</p>
		</div>)
		}
    </div>
  );
}
