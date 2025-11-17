
/*
	* Example "router" file
	*	- Responsibel for "routing" --> i.e. some http request came in, what should I do with it?
	*	- Thus a route will simply route a request to the specified controller
	*
	* A SINGLE route file can contain all "related" routes
*/

import { Router } from "express";

// one againe need to import any routes you want tou use
import { getDishes } from "../controllers/exampleController.js";

// create an express router
const router = Router();

// routes THE RELEVANT PATH to a specific controller
// 		- relevant? Well we want to structure http request to make sense... SO in the index.html, we define the base route like `app.use("api/dish)`. Now we can define a bunch of more 
// 		  specific routes like:
// 			- localhost:/api/dish/
// 			- localhost:/api/dish/name
// 			- localhost:/api/dish/prices
// 			- localhost:/api/dish/someOtherCustomRoute
//

// so this route is relative to the the example route in index.html and lready has /api/example in front of it. Now it routes the full path of /api/example/ to the controller getDishes
router.get("/", getDishes);


// once again, this file can define any number of routers that you need to support the number of controllers
// router.get(path, specificController)
// router.get(path, specificController)
// router.get(path, specificController)
// router.post(path, specificController)
// router.post(path, specificController)

export default router;

