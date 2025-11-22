
import express from "express";
import cors from "cors";
import { pool } from "./db.js";

// IMPORT THE ROUTE
import exampleRoute from "./routes/exampleRoute.js";
import userRoute from "./routes/userRoute.js";
import managerRoutes from "./routes/managerRoutes.js";
import dishRoute from "./routes/dishRoute.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test DB connection
pool.connect()
  .then(client => {
    console.log("Connected to PostgreSQL");
    client.release();
  })
  .catch(err => console.error("Connection error:", err));


// NEED TO INCLUDE THE ROUTERS... i.e the specific https routes that mean something to our app

// Test your backend request directly here if you want:
// --> can test if model/controller/route scheme works without yet bothering with whatever frontend
// --> you want to ellicit this http request

// .use(<URL_custom_BASE_route>, <actual_router>)
app.use("/api/example", exampleRoute);
app.use("/api/users", userRoute);

// app.use("/api/employee", employeeRoutes);
app.use("/api/manager", managerRoutes);
//app.use("/api/something", somethingRoutes);
app.use("/api/dishes", dishRoute);



// To test your route/controller/model without have to issue an http request from the frontend/client, you could:
// 	- type the request into a browser: `https://localhost:4000/api/example/"
// 	- Use curl in terminal
// 	- Use postman or some other thing


// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 

/*
	* Remeber that the client and server are two different applications. 
	*
	* In order for the frontend to communicate with the backend to do something (query db), the backend
	* must be listening for any incoming request. 
*/




