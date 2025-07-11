"use strict";
import { getFindAllWithCount } from "../../service/incomeService.js";
import { handleErrorMessage, handleSuccess } from "../../utils/UniversalFunctions.js";



export const incomeList = async (req, res) => {
    try {
        const { skip, limit } = req.query;
        const { incomeType } = req.params;
        const { user_id } = req.user;
        let criteria = {
            user_id: user_id,
            type: incomeType
        };
        const list = await getFindAllWithCount(criteria, skip, limit);
        handleSuccess(res, list);
    } catch (error) {
        handleErrorMessage(res, error);
    }
};