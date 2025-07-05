
import express from "express";
import { eventAchiver, luckyUsers } from "../../controller/user/profileController.js";

const router = express.Router();
const baseURL = "/api/v1/profile/";

router.get(`${baseURL}event_achiver`, eventAchiver);
router.get(`${baseURL}lucky-users`, luckyUsers);



export default router;