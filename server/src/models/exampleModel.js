
/* 	
	* Example "model" file
	* 	- Contains functions that are called to query the Database
	* 	- 
	*
*/ 

// Need to import this if this file requires the credentials to DB
import { pool } from "../db.js";



// EXAMPLE DB Querying function...

// Simple return all rows in the dish table
export async function getAllDishes() {
	const result = await pool.query(
		'SELECT name FROM dish;'
	);
	return result.rows;
}

// Have all the other  models in thsi "group".. so say for instance I wanted all of my queires related to the dish table to be here:....
// THere's also a way for the model function to take args and then you can use those args as apart of the query. If you need that behavior look into.
	
//export async function getAllDishes() {}
//export async function getDishById(id) {}
//export async function getPopularDishes() {}
//export async function getDishesByCategory(category) {}
//export async function searchDishes(term) { }



