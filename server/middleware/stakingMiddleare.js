import Joi from "joi";
import { ERROR } from "../config/AppConstants.js";

export const signValidation = async (req, res, next) => {
  try {
   const schema = Joi.object({
  total_amount: Joi.number().strict().required(),
  amount: Joi.number().strict().required(),
  amount_usdt: Joi.number().strict().required(),
}).unknown(false); // This will **reject** any unknown keys

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
