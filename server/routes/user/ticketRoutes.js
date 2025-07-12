
import express from "express";
import { createTicket,getTopics,getTickets,getViewSinglePost, postReply } from "../../controller/user/ticketController.js";
import { createTicketValidation, postReplyValidation} from "../../middleware/ticketMiddleware.js";

const router = express.Router();
const baseURL = "/api/v1/support/";


router.post(`${baseURL}post_ticket`, createTicketValidation,createTicket);
router.get(`${baseURL}topics`,getTopics);

router.get(`${baseURL}view_post`,getTickets);

router.get(`${baseURL}view_single_post`,getViewSinglePost);
router.post(`${baseURL}post/reply`,postReplyValidation,postReply);



export default router;