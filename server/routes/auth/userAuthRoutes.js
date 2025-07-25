import {
  signin,
  checkRegister,
  signup,
  walletExist,
  checkTra,
  checkTransaction,
  unbond,
  getPopupStatus,
  rewardList,

} from "../../controller/authController.js";
import express from "express";

import {
  signinValidation,
  signupValidation,
  walletExistValidation,
  // signupValidation,
  // signupValidation2,
} from "../../middleware/authMiddleware.js";
import { dashboard } from "../../controller/user/dashboardController.js";
import { removeStake } from "../../controller/user/stakingController.js";

const router = express.Router();
const baseURL = "/api/v1/auth/";
const baseURLPublic = "/api/v1/";

/* POST signin API. */
router.post(`${baseURL}signin`, signinValidation, signin);

router.post(`${baseURL}signup`, signupValidation, signup);

router.post(`${baseURL}wallet_verify`, walletExistValidation, walletExist);
router.get(`${baseURLPublic}dashboard`, dashboard);

router.get(`${baseURLPublic}checkhash`, checkTra);
router.get(`${baseURLPublic}reward_list`, rewardList);
router.get(`${baseURLPublic}checktransaction`, checkTransaction);

router.post(`${baseURL}removeStake`, removeStake);
router.get(`${baseURLPublic}getPopupStatus`, getPopupStatus);


// router.post(`${baseURL}checkValidationForSignup`, signupValidation2,checkRegister);


export default router;