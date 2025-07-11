
import express from "express";
import { incomeList } from "../../controller/user/incomeController.js";



const router = express.Router();
const baseURL = "/api/v1/user/";

router.get(`${baseURL}incomes`, incomeList);



export default router;