
import express from "express";
import { verify } from "../../controller/user/dashboardController.js";

const router = express.Router();
const baseURL = "/api/v1/user/";

router.get(`${baseURL}session/verify`, verify);



export default router;