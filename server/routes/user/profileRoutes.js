
import express from "express";
import { assets, bondTerms, eventAchiver, getUserStakeStatus, inviteHistoryTeam, joinMalasiyaEvent, luckyUsers, luckyUsersDubai, overview, userInfo } from "../../controller/user/profileController.js";
import { joinMalasiyaEventValidation } from "../../middleware/profileMiddleware.js";

const router = express.Router();
const baseURL = "/api/v1/profile/";

router.get(`/api/v1/portfolios/assets`, assets);

router.get(`${baseURL}user_info`, userInfo);
router.get(`${baseURL}getUserStakeStatus`, getUserStakeStatus);

router.get(`${baseURL}overview`, overview);
router.get(`${baseURL}bond/bond_terms`, bondTerms);
router.get(`${baseURL}invite_history_team`,inviteHistoryTeam)

router.get(`${baseURL}event_achiver`, eventAchiver);
router.get(`${baseURL}lucky-users`, luckyUsers);
router.get(`${baseURL}lucky-users-dubai`, luckyUsersDubai);

router.post(`${baseURL}event/join_malaysia`,joinMalasiyaEventValidation, joinMalasiyaEvent);




export default router;