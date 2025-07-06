
import express from "express";
import { configurations, stakeHistory, unStakeHistory } from "../../controller/user/stakingController.js";

const router = express.Router();
const baseURL = "/api/v1/staking/";


router.get(`${baseURL}configuations`, configurations);
router.get(`${baseURL}stake_history`, stakeHistory);
router.get(`${baseURL}unstake_history`, unStakeHistory);



export default router;