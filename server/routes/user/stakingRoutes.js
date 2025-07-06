
import express from "express";
import { configurations, stakeHistory, unStakeHistory,unbondIncomeHistory,bondIncomeHistory, yoexStakingHistory } from "../../controller/user/stakingController.js";
import { unbond } from "../../controller/authController.js";
import { unBondValidation } from "../../middleware/profileMiddleware.js";

const router = express.Router();
const baseURL = "/api/v1/staking/";
const baseURL2 = "/api/v1/bond/";


router.get(`${baseURL}configuations`, configurations);
router.get(`${baseURL}stake_history`, stakeHistory);
router.get(`${baseURL}unstake_history`, unStakeHistory);
router.get(`${baseURL2}bond_history`, bondIncomeHistory);
router.post(`${baseURL2}unbond`,unBondValidation, unbond);
router.get(`${baseURL}yoex_stake_history`, yoexStakingHistory);

router.get(`${baseURL2}unbond_income_history`, unbondIncomeHistory);



export default router;