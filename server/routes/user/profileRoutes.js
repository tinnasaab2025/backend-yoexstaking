
import express from "express";
import { eventAchiver, joinMalasiyaEvent, luckyUsers } from "../../controller/user/profileController.js";
import { joinMalasiyaEventValidation } from "../../middleware/profileMiddleware.js";

const router = express.Router();
const baseURL = "/api/v1/profile/";

router.get(`${baseURL}event_achiver`, eventAchiver);
router.get(`${baseURL}lucky-users`, luckyUsers);
router.post(`/api/v1/event/join_malasiya`,joinMalasiyaEventValidation, joinMalasiyaEvent);




export default router;