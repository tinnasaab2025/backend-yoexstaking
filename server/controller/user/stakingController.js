"use strict";
import { Op, Sequelize } from "sequelize";

import { ERROR, SUCCESS } from "../../config/AppConstants.js";
import {
  handleErrorMessage,
  handleSuccess,
} from "../../utils/UniversalFunctions.js";
import { getOne as getOneUser } from "../../service/userService.js";

import { getOne } from "../../service/configrationService.js";
import { getFindAllWithCount } from "../../service/stakeGHistoryService.js";
import { getFindAllWithCount as getFindAllWithCountBond } from "../../service/bondHistoryService.js";

import { getFindAllWithCount as getFindAllWithCountUnStake } from "../../service/unstakeHistoryService.js";
import { getFindAllWithCount as getFindAllWithCountUnBond } from "../../service/unBondHistoryService.js";
import { getLimitRecordsExcludeType } from "../../service/assetsService.js";

export const configurations = async (req, res) => {
  try {
    const { user_id } = req.user;
    let criteria = {
      user_id: user_id,
    };
    const attribute = ["disabled"];
    const user = await getOneUser(criteria, attribute);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

    const configurations = await getOne({ setting_key: "stake_enabled" }, [
      "setting_value",
    ]);

    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "Configurations getting successfully";
    finalMessage.data = configurations;
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const stakeHistory = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const { user_id } = req.user;
    console.log('user_id',user_id)
 const start = parseInt(skip, 10);
    const limits = parseInt(limit, 10);
    let criteria2 = {
      user_id: user_id,
    };
    const attribute = ["disabled"];
    const user = await getOneUser(criteria2, attribute);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

    let criteria = {
      user_id: user_id,
    };
    const list = await getFindAllWithCount(criteria, start, limits);
     let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "Stake getting successfully";
    finalMessage.data = list
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const bondIncomeHistory = async (req, res) => {
  try {     
    const { skip, limit } = req.query;
    const { user_id } = req.user;

    const start = parseInt(skip, 10);
    const limits = parseInt(limit, 10);

    let criteria2 = {
      user_id: user_id,
    };
    const attribute = ["disabled"];
    const user = await getOneUser(criteria2, attribute);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

    let criteria = {
      user_id: user_id,
    };
    const list = await getFindAllWithCountBond(criteria, start, limits);
     let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "Bond getting successfully";
    finalMessage.data = list
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const unbondIncomeHistory = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const { user_id } = req.user;

    const start = parseInt(skip, 10);
    const limits = parseInt(limit, 10);

    let criteria2 = {
      user_id: user_id,
    };
    const attribute = ["disabled"];
    const user = await getOneUser(criteria2, attribute);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

    let criteria = {
      user_id: user_id,
    };
    const list = await getFindAllWithCountUnBond(criteria, start, limits);
     let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "UnStake getting successfully";
    finalMessage.data = list
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};
export const unStakeHistory = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const { user_id } = req.user;
     const start = parseInt(skip, 10);
    const limits = parseInt(limit, 10);

    let criteria2 = {
      user_id: user_id,
    };
    const attribute = ["disabled"];
    const user = await getOneUser(criteria2, attribute);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

    let criteria = {
      user_id: user_id,
    };
    const list = await getFindAllWithCountUnStake(criteria, start, limits);
     let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "UnBond getting successfully";
    finalMessage.data = list
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const yoexStakingHistory = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    const { user_id } = req.user;

    const start = parseInt(skip, 10);
    const limits = parseInt(limit, 10);

    let criteria2 = {
      user_id: user_id,
    };
    const attribute = ["disabled"];
    const user = await getOneUser(criteria2, attribute);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

     const records = await getLimitRecordsExcludeType(user_id, ['*'], 'unstake_signature', limits, start);
     let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "Yoex Staking getting successfully";
    finalMessage.data = records
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
}
