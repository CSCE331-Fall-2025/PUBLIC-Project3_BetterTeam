
import express from "express";
import cors from "cors";
import { pool } from "./db.js";

// Import API Routes
import exampleRoute from "./routes/exampleRoute.js";
import authRoute from "./routes/authRoute.js";
import managerRoute from "./routes/managerRoute.js";
import managerDishRoute from "./routes/managerDishRoute.js";
import managerEmployeeRoute from "./routes/managerEmployeeRoute.js";
import managerInventoryRoute from "./routes/managerInventoryRoute.js";
import dishRoute from "./routes/dishRoute.js";
import transactionRoute from "./routes/transactionRoute.js"
import customerRoutes from "./routes/customerRoutes.js"
import paypalRoute from "./routes/paypal.js";
import inventoryRoute from "./routes/inventoryRoute.js";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/paypal", paypalRoute);

// Test DB connection
pool.connect()
  .then(client => {
    console.log("Connected to PostgreSQL");
    client.release();
  })
  .catch(err => console.error("Connection error:", err));


// Base Routes
app.use("/api/example", exampleRoute);
app.use("/api/auth", authRoute);
app.use("/api/manager", managerRoute);
app.use("/api/manager/dish", managerDishRoute);
app.use("/api/manager/employee", managerEmployeeRoute);
app.use("/api/manager/inventory", managerInventoryRoute);
app.use("/api/dishes", dishRoute);
app.use("/api/transactions", transactionRoute);
app.use("/api/customers", customerRoutes);
app.use("/api/inventory", inventoryRoute);



// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 

