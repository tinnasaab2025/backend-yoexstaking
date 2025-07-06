"use strict";
import { Op, Sequelize } from "sequelize";

import { ERROR, SUCCESS } from "../../config/AppConstants.js";
import {
  handleErrorMessage,
  handleSuccess,
} from "../../utils/UniversalFunctions.js";
import { getOne as getOneUser } from "../../service/userService.js";
import {
  getOne as getOneUserBusiness,
  updateData as updateDataUserBusiness,
} from "../../service/userBusinessService.js";

import { getOne } from "../../service/configrationService.js";
import { getFindAllWithCount } from "../../service/stakeGHistoryService.js";
import { getFindAllWithCount as getFindAllWithCountBond } from "../../service/bondHistoryService.js";

import { getFindAllWithCount as getFindAllWithCountUnStake } from "../../service/unstakeHistoryService.js";
import { getFindAllWithCount as getFindAllWithCountUnBond } from "../../service/unBondHistoryService.js";
import {
  getLimitRecordsExcludeType,
  InsertData as inseretDataAsset,
} from "../../service/assetsService.js";

import {
  getOne as getOneSignature,
  InsertData as inseretDataSigature,
} from "../../service/signatureService.js";
import { getOne as getOnePrice } from "../../service/tokenValueService.js";

const callThirdPartyAPI = async (object2) => {
  const object = {
    walletAddress: object2.wallet_address,
    totalAmount: object2.amount, // Assuming eth_address is the wallet address
    unstakeAmount: object2.amount,
  };
  const apiUrl = "http://165.22.62.179:9096/sign-for-our";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  });

  const data = await response.json();
  return data;
};
export const signTransaction = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { total_amount, amount, amount_usdt } = req.body;
    const user = await getOneUser({ user_id: user_id }, [
      "disabled",
      "eth_address",
    ]);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }
    const object = {
      user_id: user_id,
      wallet_address: user.eth_address, // Assuming eth_address is the wallet address
      total_amount: total_amount,
      amount: amount,
      amount_usdt: amount_usdt,
    };

    const response = await callThirdPartyAPI(object);
    if (response.status === false) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = response.error || "Error generating signature";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

    if (response) {
      const finalSignatureCheck = await getOneSignature(
        { signature: response.signature },
        ["signature"]
      );
      if (finalSignatureCheck) {
        let finalResponse = { ...ERROR.error };
        finalResponse.message = "Connect wallet for Trxaction!";
        return res.status(ERROR.error.statusCode).json(finalResponse);
      }

      const [userInfo, tokenPriceDB] = await Promise.all([
        getOneUserBusiness({ user_id: user_id }, [
          "user_id",
          "eth_address",
          "available_asset",
        ]),
        getOnePrice({ id: 1 }, ["amount"]),
      ]);
      const tokenPrice = tokenPriceDB ? tokenPriceDB.amount : 0;
      const finalTokens = amount / 10 ** 12;
      if (finalTokens < 0) {
        let finalResponse = { ...ERROR.error };
        finalResponse.message = "Invalid amount, please try again!";
        return res.status(ERROR.error.statusCode).json(finalResponse);
      }
      if (userInfo.available_asset < 0) {
        let finalResponse = { ...ERROR.error };
        finalResponse.message = "Insufficient balance, please try again!";
        return res.status(ERROR.error.statusCode).json(finalResponse);
      }

      if (userInfo.available_asset >= finalTokens) {
        const availableAsset = userInfo.available_asset - finalTokens;
        const availableAssetUsdt = userInfo.available_asset / finalTokens;
        await updateDataUserBusiness(
          { user_id: user_id },
          { available_asset: availableAsset }
        );
        const objectToInsert = {
          user_id: user_id,
          amount: -amount,
          type: "unstake_signature",
          description: "Unstake Signature",
          remark: response.signature,
        };
        await inseretDataAsset(objectToInsert);

        const objectToSignature = {
          user_id: user_id,
          wallet_address: user.eth_address,
          package_amount: availableAssetUsdt,
          package_tokens: user.available_asset,
          enter_amount: amount,
          signature: response.signature,
          nonce: response.nonce,
          token_price: tokenPrice,
        };
        await inseretDataSigature(objectToSignature);
        let finalResponse = {
          wallet_address: user.eth_address,
          signature: response.signature,
          nonce: response.nonce,
          expiry: response.expiry,
        };
        let finalMessage = { ...SUCCESS.found };
        finalMessage.message = "Signature generated successfully";
        finalMessage.data = finalResponse;
        return res.status(SUCCESS.found.statusCode).json(finalMessage);
      }
    }
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

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
    console.log("user_id", user_id);
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
    finalMessage.data = list;
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
    finalMessage.data = list;
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
    finalMessage.data = list;
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
    finalMessage.data = list;
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

    const records = await getLimitRecordsExcludeType(
      user_id,
      ["*"],
      "unstake_signature",
      limits,
      start
    );
    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "Yoex Staking getting successfully";
    finalMessage.data = records;
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};
