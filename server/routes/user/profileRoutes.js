
import express from "express";
import { eventAchiver } from "../../controller/user/profileController.js";

const router = express.Router();
const baseURL = "/api/v1/profile/";

router.get(`${baseURL}event_achiver`, eventAchiver);



export default router;