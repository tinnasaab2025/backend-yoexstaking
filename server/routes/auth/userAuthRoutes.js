import {
  signin,
  checkRegister,
  signup,

} from "../../controller/authController.js";
import express from "express";

import {
  signinValidation,
  signupValidation,
  // signupValidation,
  // signupValidation2,
} from "../../middleware/authMiddleware.js";

const router = express.Router();
const baseURL = "/api/v1/auth/";

/* POST signin API. */
router.post(`${baseURL}signin`, signinValidation, signin);

router.post(`${baseURL}signup`, signupValidation, signup);
// router.post(`${baseURL}checkValidationForSignup`, signupValidation2,checkRegister);


export default router;