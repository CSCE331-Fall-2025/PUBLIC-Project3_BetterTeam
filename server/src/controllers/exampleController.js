
/*
	* Example "controller" file
	* 	- Will be called by some router that has passed in the http request that contains:
	* 		- req --> request (can contain data meant to be passed... like the specific employee you want to show get data for or somethign)
	* 			- data in the client URL
	* 			- meta data about the page
	* 			- cookie data
	* 		- res --> response (you populate the resonse with data you want to be passed back the client
	* 			- .json ; Pass the raw data (its in json form) to the resonse 
	* 			- .status() ; pass status info, 
	* 			- .redirect() ; redirect the request to a new controller 
	* 			- .cookie ; can set cookies (probably want to do this after someone has logged in
	* 	- Handles the HTTP request by calling a model
	*	- gets the data back from model
	* 	- Does whatever you want with the data 
*/

// NEED TO IMPORT WHATEVER MODEL YOU WANT TO BE ABLE TO CALL
import { getAllDishes } from "../models/exampleModel.js";

export async function getDishes(req, res) {
	try {
		const items = await getAllDishes();
		res.json(items);
	} catch (err) {
		console.error("Error fetching dishes:", err);
		res.status(500).json({ error: "Failed to fetch menu" });
	}
}

// Of course you coud've imported any number of models you want and thus would also need to write a controller for each of them:
// controller1
// controller2
// controller3
// controller4
// controller5

