
import express from "express";
import { createTicket,getTopics,getTickets } from "../../controller/user/ticketController.js";
import { createTicketValidation} from "../../middleware/ticketMiddleware.js";

const router = express.Router();
const baseURL = "/api/v1/support/";


router.post(`${baseURL}post_ticket`, createTicketValidation,createTicket);
router.get(`${baseURL}topics`,getTopics);

router.get(`${baseURL}view_post`,getTickets);


export default router;