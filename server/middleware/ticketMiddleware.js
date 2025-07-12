import Joi from "joi";
import { ERROR } from "../config/AppConstants.js";

export const createTicketValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      topic_id: Joi.number().required(),
      subject: Joi.string().required().trim(),
      description: Joi.string().required().trim(),
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
export const postReplyValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      ticket_id: Joi.number().required(),
      message: Joi.string().required().trim(),
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

