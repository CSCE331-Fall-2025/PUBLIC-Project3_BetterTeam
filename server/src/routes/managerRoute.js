import { Router } from "express";

// one again need to import any routes you want to use
// import { xReport } from "../controllers/managerController.js";

// create an express router
const router = Router();

// so this route is relative to the the example route in index.html and already has /api/manager in front of it. Now it routes the full path of /api/manager/ to the controller xReport.
// router.get("/", xReport);
// router.get("/", zReport);

export default router;
