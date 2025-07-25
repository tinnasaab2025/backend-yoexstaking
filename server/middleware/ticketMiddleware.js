import Joi from "joi";
import { Op } from "sequelize";
import { ERROR } from "../config/AppConstants.js";
import { getOne } from "../service/ticketService.js";


export const createTicketValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      topic_id: Joi.number().required(),
      subject: Joi.string().required().trim(),
      description: Joi.string().required().trim(),
    });
    const { user_id } = req.user;
    const checkTicket = await getOne({ user_id: user_id,status: {
      [Op.in]: ['open', 'pending']
    } }, ['status']);
    if (checkTicket) {
      const ticketStatus = checkTicket.status;
      console.log('ticketStatus:', ticketStatus);
      if (ticketStatus === 'open' || ticketStatus === 'pending') {
        let finalMessage = { ...ERROR.error };
        finalMessage.message = "You already have an open ticket.";
        return res.status(ERROR.error.statusCode).json(finalMessage);
      }
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

