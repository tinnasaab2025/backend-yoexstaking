"use strict";
import { ERROR, SUCCESS } from "../../config/AppConstants.js";
import { InsertData, updateData } from "../../service/ticketService.js";
import { getData } from "../../service/topicService.js";
import { addReply, getReplies, getTicket, getUserTickets } from "../../utils/GetTickets.js";
import { handleErrorMessage } from "../../utils/UniversalFunctions.js";


export const getViewSinglePost = async (req, res) => {
  try {
    const { ticket_id } = req.query;
    if (!ticket_id) {
      return res.status(ERROR.error.statusCode).json(ERROR.error);
    }
    const ticket = await getTicket(ticket_id);
    if (!ticket) {
      return res.status(ERROR.dataNotFound.statusCode).json(ERROR.dataNotFound);
    }
    const replies = await getReplies(ticket_id);

    const finalRsult = {
      ticket: ticket,
      replies: replies,
    }
    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "Ticket fetched successfully";
    finalMessage.data = finalRsult;
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const postReply = async (req, res) => {
  try {
    const { ticket_id, message } = req.body;

    const ticket = await getTicket(ticket_id);
    if (!ticket) {
      return res.status(ERROR.dataNotFound.statusCode).json(ERROR.dataNotFound);
    }
    const objectToInsert = {
      ticket_id: ticket_id,
      replied_by_admin: false,
      message: message,
    };


    const [added, reply] = await Promise.all([
      addReply(objectToInsert),
      updateData(
        { id: ticket_id },
        { status: 'pending' }
      )
    ])

    if (reply && added) {
      let finalMessage = { ...SUCCESS.created };
      finalMessage.message = "Reply posted successfully";
      return res.status(SUCCESS.created.statusCode).json(finalMessage);
    } else {
      return res.status(ERROR.error.statusCode).json(ERROR.error);
    }
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const getTickets = async (req, res) => {
  try {
    const { user_id } = req.user;
    const topics = await getUserTickets(user_id);
    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "Tickets fetched successfully";
    finalMessage.data = topics;
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const getTopics = async (req, res) => {
  try {
    const topics = await getData({}, [
      "id",
      "name",
      "created_at",
      "updated_at",
    ]);
    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "Topics fetched successfully";
    finalMessage.data = topics;
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const createTicket = async (req, res) => {
  try {
    const { topic_id, subject, description } = req.body;
    const { user_id, wallet_address } = req.user;
    let obj = {};
    obj.user_id = user_id;
    obj.wallet_address = wallet_address;
    obj.topic_id = topic_id;
    obj.subject = subject;
    obj.description = description;

    const result = await InsertData(obj);
    if (result) {
      let finalMessage = { ...SUCCESS.created };
      return res.status(SUCCESS.created.statusCode).json(finalMessage);
    } else {
      return res.status(ERROR.error.statusCode).json(ERROR.error);
    }
  } catch (error) {
    handleErrorMessage(res, error);
  }
};
