
import express from "express";
import {rateLimit,ipKeyGenerator} from "express-rate-limit";
import { createTicket,getTopics,getTickets,getViewSinglePost, postReply } from "../../controller/user/ticketController.js";
import { createTicketValidation, postReplyValidation} from "../../middleware/ticketMiddleware.js";

const signRequestLimit = rateLimit({
    windowMs: 3 * 1000, // 3 seconds window
  max: 1, // allow only 1 request per window
  // message: "Too many attempts. Try again after 1 minutes.",
    keyGenerator: (req) => {
    // Prefer per-user limit, fallback to safe IP
    return req.user?.user_id || ipKeyGenerator(req);
  },
  handler: (req, res) => {
    res.status(429).json({
      status: false,
      message: 'Too many attempts. Try again after 1 minute.'
    });
  }
});

const router = express.Router();
const baseURL = "/api/v1/support/";


router.post(`${baseURL}post_ticket`, createTicketValidation,signRequestLimit,createTicket);
router.get(`${baseURL}topics`,getTopics);

router.get(`${baseURL}view_post`,getTickets);

router.get(`${baseURL}view_single_post`,getViewSinglePost);
router.post(`${baseURL}post/reply`,postReplyValidation,postReply);



export default router;