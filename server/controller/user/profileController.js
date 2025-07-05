"use strict";
import { Op } from 'sequelize';

import { ERROR, SUCCESS } from "../../config/AppConstants.js";
import { getOne } from "../../service/userService.js";
import { getOne as getOneEvent } from "../../service/eventService.js";
import { handleErrorMessage } from "../../utils/UniversalFunctions.js";
import { getSum } from '../../service/bondHistoryService.js';



export const eventAchiver = async (req, res) => {
    try {
        const { user_id } = req.user;
        // console.log('user_id', req.user);
        let criteria = {
            user_id: user_id,
        };
        const attribute = ['user_id', 'sponser_id', 'sponser_eth_address', 'eth_address', 'directs', 'team_business', 'direct_business', 'disabled', 'package_amount', 'created_at'];
        const user = await getOne(criteria, attribute);
        if (user['disabled'] === true) {
            let finalResponse = { ...ERROR.error };
            finalResponse.message = 'User blocked, please contact our support';
            return res.status(ERROR.error.statusCode).json(finalResponse);
        }

        const bondData = await getSum('amount', {
            where: {
                user_id: user_id,
                lock_days: { [Op.gte]: 180 }
            }
        });

        const totalBond = bondData ? bondData : 0;

        if (totalBond >= 1500) {
            let finalMessage = { ...SUCCESS.found };
            finalMessage.message = 'Token is valid. User is authenticated.';
            finalMessage.data = {
                achived_status: true,
                total_bond: totalBond,
            }
            return res.status(SUCCESS.found.statusCode).json(finalMessage);
        } else {
            let finalMessage = { ...ERROR.error };
            finalMessage.message = 'Wallet is not eligible!';

            return res.status(ERROR.error.statusCode).json(finalMessage);
        }



    } catch (error) {
        handleErrorMessage(res, error);
    }
};

export const luckyUsers = async (req, res) => {
  try {
    const { wallet_address } = req.user;

    const event = await getOneEvent({ wallet_address }, ['status']);

    if (!event) {
      return getResponse(res, 3, 'Join Now', 'Pending');
    }

    const status = event.status;

    const statusMap = {
      0: { text: 'Pending', message: 'Pending' },
      1: { text: 'Approve', message: 'Pending' },
      2: { text: 'Reject', message: 'Complete' },
    };

    const { text, message } = statusMap[status] || { text: 'New User', message: 'Complete' };

    return getResponse(res, status ?? 3, text, message);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

const getResponse = (res, status, text, message) => {
  const finalMessage = {
    ...SUCCESS.found,
    message,
    data: {
      admin_status: status,
      joining: text,
    },
  };
  return res.status(SUCCESS.found.statusCode).json(finalMessage);
};

