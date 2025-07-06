import Joi from "joi";
import { ERROR } from "../config/AppConstants.js";

import { getOne as getOneEvents } from "../service/eventService.js";

const bep20Regex = /^0x[a-fA-F0-9]{40}$/;

export const joinMalasiyaEventValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      first_name: Joi.string().required().trim(),
      last_name: Joi.string().required().trim(),
      email: Joi.string()
        .email({ tlds: { allow: false } }) // Disable top-level domain enforcement (or set e.g., { allow: ['com', 'net'] })
        .required()
        .trim()
        .lowercase()
        .messages({
          "string.empty": "Email is required.",
          "string.email": "Please provide a valid email address.",
        }),

      wallet_address: Joi.string().pattern(bep20Regex).required().messages({
        "string.pattern.base":
          "Invalid BEP-20 address. It should start with 0x and be followed by 40 hex characters.",
        "string.empty": "Wallet Address is required.",
      }),
    });
    const checkWallet = await getOneEvents(
      { wallet_address: req.body.wallet_address },
      ["wallet_address"]
    );
    if (checkWallet) {
      let finalMessage = { ...ERROR.error };
      finalMessage.message = "This Wallet address request already submitted!";
      return res.status(ERROR.error.statusCode).json(finalMessage);
    }
    const checkEmail = await getOneEvents({ email: req.body.email }, ["id"]);
    if (checkEmail) {
      let finalMessage = { ...ERROR.error };
      finalMessage.message = "This Email address request already submitted!";
      return res.status(ERROR.error.statusCode).json(finalMessage);
    }
    const validation = schema.validate(req.body);
    if (validation.error !== undefined) {
      let finalMessage = {};
      finalMessage = { ...ERROR.error };
      finalMessage.message = validation.error.details[0].message;
      return res.status(ERROR.error.statusCode).json(finalMessage);
    }
    next();
  } catch (error) {
    return res
      .status(ERROR.somethingWentWrong.statusCode)
      .json(ERROR.somethingWentWrong);
  }
};

export const unBondValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      hash: Joi.string().required().trim(),
    });

    const validation = schema.validate(req.body);
    if (validation.error !== undefined) {
      let finalMessage = {};
      finalMessage = { ...ERROR.error };
      finalMessage.message = validation.error.details[0].message;
      return res.status(ERROR.error.statusCode).json(finalMessage);
    }
    next();
  } catch (error) {
    return res
      .status(ERROR.somethingWentWrong.statusCode)
      .json(ERROR.somethingWentWrong);
  }
};
