"use strict";
import { Op, Sequelize } from 'sequelize';

import { ERROR, SUCCESS } from "../../config/AppConstants.js";
import { handleErrorMessage, handleSuccess } from '../../utils/UniversalFunctions.js';
import { getOne  as getOneUser} from '../../service/userService.js';

import { getOne } from '../../service/configrationService.js';
import { getFindAllWithCount } from '../../service/stakeGHistoryService.js';
import { getFindAllWithCount as getFindAllWithCountUnStake } from '../../service/unstakeHistoryService.js';


export const configurations = async (req, res) => {
  try {
    const { user_id } = req.user;
    let criteria = {
      user_id: user_id,
    };
    const attribute = ['disabled'];
    const user = await getOneUser(criteria, attribute);
    if (user['disabled'] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = 'User blocked, please contact our support';
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

    const configurations = await getOne({ setting_key: 'stake_enabled' }, ['setting_value']);
   
    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = 'Configurations getting successfully';
    finalMessage.data = configurations;
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
}


export const stakeHistory = async (req, res) => {
    try {
        const { skip, limit } = req.query;
        const { user_id } = req.user;

    let criteria2 = {
      user_id: user_id,
    };
    const attribute = ['disabled'];
    const user = await getOneUser(criteria2, attribute);
    if (user['disabled'] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = 'User blocked, please contact our support';
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

        let criteria = {
            user_id: user_id,
        };
        const list = await getFindAllWithCount(criteria, skip, limit);
        handleSuccess(res, list);
    } catch (error) {
        handleErrorMessage(res, error);
    }
};


export const unStakeHistory = async (req, res) => {
    try {
        const { skip, limit } = req.query;
        const { user_id } = req.user;

    let criteria2 = {
      user_id: user_id,
    };
    const attribute = ['disabled'];
    const user = await getOneUser(criteria2, attribute);
    if (user['disabled'] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = 'User blocked, please contact our support';
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

        let criteria = {
            user_id: user_id,
        };
        const list = await getFindAllWithCountUnStake(criteria, skip, limit);
        handleSuccess(res, list);
    } catch (error) {
        handleErrorMessage(res, error);
    }
};
