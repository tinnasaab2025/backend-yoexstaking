"use strict";
import Web3 from "web3";
import { Sequelize,Op } from 'sequelize';

import { ERROR, SUCCESS } from "../../config/AppConstants.js";
import { handleErrorMessage } from "../../utils/UniversalFunctions.js";
import { getOne as getOneUser } from "../../service/userService.js";
import {
  getOne as getOneUserBusiness,
  updateData as updateDataUserBusiness,
} from "../../service/userBusinessService.js";

import { getOne } from "../../service/configrationService.js";
import { getFindAllWithCount, getData as getDataStakeHistory } from "../../service/stakeGHistoryService.js";
import { getFindAllWithCount as getFindAllWithCountBond, getData as getDataBondHistory } from "../../service/bondHistoryService.js";

import {
  getOne as getOneUnStake,
  getFindAllWithCount as getFindAllWithCountUnStake,
  InsertData as InsertDataUnStake,
  getData as getDataUnStakeHistory,
} from "../../service/unstakeHistoryService.js";
import { getFindAllWithCount as getFindAllWithCountUnBond, getData as getDataUnbondIncomeHistory } from "../../service/unBondHistoryService.js";
import {
  getLimitRecordsExcludeType,
  InsertData as inseretDataAsset,
} from "../../service/assetsService.js";

import {
  getOne as getOneSignature,
  InsertData as inseretDataSigature,
  updateData as updateSignatureData,
} from "../../service/signatureService.js";

import {
  getOne as getOneStake,
  InsertData as insertDataStake,
} from "../../service/stakeGHistoryService.js";
import { getOne as getOnePrice } from "../../service/tokenValueService.js";
import { getTransactionDetails } from "../../utils/web3.js";
import { token } from "morgan";
const web3 = new Web3("https://bsc-dataseed.binance.org/");

const checkUnstakeTransaction = async (res, eth_address, hash) => {
  const response = await getTransactionDetails(hash);
  const getStake = await getOneStake({ hash: hash }, ["id"]);
  if (getStake) {
    return res.status(200).json({
      statusCode: 200,
      status: true,
      message: "Transaction already exists",
      data: { hash: getStake.hash },
    });
  }

  let decodedData = null;

  response.receipt.logs.forEach((element) => {
    const isTargetEvent =
      element.topics[0] ===
      "0x7fc4727e062e336010f2c282598ef5f14facb3de68cf8195c2f23e1454b2b74e";

    if (isTargetEvent) {
      const topics = element.topics;

      const user = web3.eth.abi.decodeParameter("address", topics[1]);
      const usdtRaw = web3.eth.abi
        .decodeParameter("uint256", topics[2])
        .toString();
      const yoexRaw = web3.eth.abi
        .decodeParameter("uint256", topics[3])
        .toString();

      decodedData = {
        user,
        totalAmount: (Number(yoexRaw) / 1e12).toString(),
        unstakeAmount: (Number(usdtRaw) / 1e12).toString(),
      };
    }
  });

  if (!decodedData) {
    return res.status(404).json({
      statusCode: 404,
      status: false,
      message: "unStake event not found in logs",
    });
  }

  // console.warn(getUser, tokenPrice);
  console.log("eth_address", eth_address);
  console.log("decodedData.user", decodedData.user);
  if (eth_address.toLowerCase() !== decodedData.user.toLowerCase()) {
    return res.status(403).json({
      statusCode: 403,
      status: false,
      message: "Invalid unstake request. User does not match.",
    });
  }
  return decodedData;
};

export const createParticipate = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { hash } = req.body;
    const user = await getOneUser({ user_id: user_id }, [
      "disabled",
      "eth_address",
    ]);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }
    let decodedData = null;
    const response = await getTransactionDetails(hash);
    response.receipt.logs.forEach((element) => {
      const isTargetEvent =
        element.topics[0] ===
        "0x1449c6dd7851abc30abf37f57715f492010519147cc2652fbc38202c18a6ee90";

      if (isTargetEvent) {
        const topics = element.topics;

        const user = web3.eth.abi.decodeParameter("address", topics[1]);
        const usdtRaw = web3.eth.abi
          .decodeParameter("uint256", topics[2])
          .toString();
        const yoexRaw = web3.eth.abi
          .decodeParameter("uint256", topics[3])
          .toString();

        decodedData = {
          user,
          yoexAmount: (Number(yoexRaw) / 1e12).toString(),
          usdtAmount: (Number(usdtRaw) / 1e18).toString(),
        };
      }
    });

    if (!decodedData) {
      return res.status(404).json({
        statusCode: 404,
        status: false,
        message: "participateCreated event not found in logs",
      });
    }

    if (user.eth_address.toLowerCase() !== decodedData.user.toLowerCase()) {
      return res.status(403).json({
        statusCode: 403,
        status: false,
        message: "Invalid participate request. User does not match.",
      });
    }
    const tokenPrice = await getOnePrice({ id: 1 }, ["amount"]);
    const object = {
      user_id: user_id,
      wallet_address: decodedData.user.toLowerCase(), // Assuming eth_address is the wallet address
      tokens: parseFloat(decodedData.yoexAmount),
      usdt_amount: parseFloat(decodedData.usdtAmount),
      hash: hash,
      token_price: tokenPrice.amount, // Assuming token price is not needed here
      timestamp_unix: 0,
    };
    await insertDataStake(object);
    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "Participate created successfully";
    finalMessage.data = {
      wallet_address: decodedData.user.toLowerCase(),
      tokens: parseFloat(decodedData.yoexAmount),
      usdt_amount: parseFloat(decodedData.usdtAmount),
      hash: hash,
      token_price: tokenPrice.amount, // Assuming token price is not needed here
    };
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const removeStake = async (req, res) => {
  try {
    const { user_id } = req.user;

    const { hash, signature } = req.body;

    const checkHash = await getOneUnStake({ hash: hash }, ["id"]);
    if (checkHash) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "UnStake already exists";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

    const user = await getOneUser({ user_id: user_id }, [
      "disabled",
      "eth_address",
    ]);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }
    const checkUnstakeData = await checkUnstakeTransaction(
      res,
      user.eth_address,
      hash
    );

    const checkSign = await getOneSignature(
      { signature: signature, status: 2 },
      ["signature"]
    );
    if (checkSign) {
      let finalResponse = { ...SUCCESS.created };
      finalResponse.message = "UnStake Created Successfully";
      return res.status(SUCCESS.created.statusCode).json(finalResponse);
    }
    const tokenPrice = await getOnePrice({ id: 1 }, ["amount"]);
    const createUnstake = {
      user_id: user_id,
      wallet_address: checkUnstakeData.user,
      amount: checkUnstakeData.unstakeAmount,
      tokens: checkUnstakeData.totalAmount,
      hash: hash,
      token_price: tokenPrice.amount, // Assuming token price is not needed here
    };
    await InsertDataUnStake(createUnstake);
    await updateSignatureData({ signature: signature }, { status: 2 });
    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "UnStake created successfully";
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

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
const lastWithdrawalTimes = {};
export const signTransaction = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { total_amount, amount, amount_usdt } = req.body;
    let currentTime = new Date();
    let lastWithdrawalTime;
    let twoMinutesLater;

    if (lastWithdrawalTimes[user_id]) {
      const lastWithdrawalTime = new Date(lastWithdrawalTimes[user_id]);
      const twoMinutesLater = new Date(lastWithdrawalTime.getTime() + 1 * 60 * 1000);

      if (currentTime < twoMinutesLater) {
        let finalResponse = { ...ERROR.error };
        finalResponse.message = "Please wait for 1 minutes before making another confirm request!";
        return res.status(ERROR.error.statusCode).json(finalResponse);
      }
    }

    const user = await getOneUser({ user_id: user_id }, [
      "disabled",
      "eth_address",
    ]);
    if (user["disabled"] === true) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "User blocked, please contact our support";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }

    if (amount <= 0 || total_amount <= 0 || amount_usdt <= 0) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "Invalid amount, please try again!";
      return res.status(ERROR.error.statusCode).json(finalResponse);
    }


    const checkSignatureStatus = await getOneSignature(
      { wallet_address: user.eth_address, status: 0, id: { [Op.gt]: 5331 } },
      ["id"]
    );
    if (checkSignatureStatus) {
      let finalResponse = { ...ERROR.error };
      finalResponse.message = "Signature Generation in progress, please wait!";
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
          amount: -Math.abs(amount), // ensures always negative         
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
    const attributeMinting = [
      [Sequelize.fn('SUM', Sequelize.col('usdt_amount')), 'amount'],
    ]
    const [list, totalAms] = await Promise.all([
      getFindAllWithCount(criteria, start, limits),
      getDataStakeHistory(criteria, attributeMinting),
    ]);

    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "Stake getting successfully";
    finalMessage.data = list;
    finalMessage.totalAmount = totalAms;
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

    const attributeMinting = [
      [Sequelize.fn('SUM', Sequelize.col('amount')), 'amount'],
    ]
    const [list, total_minting_amount] = await Promise.all([
      getFindAllWithCountBond(criteria, start, limits),
      getDataBondHistory(criteria, attributeMinting)
    ]);

    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "Bond getting successfully";
    finalMessage.data = list;
    finalMessage.totalAmount = total_minting_amount;
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
    const attributeMinting = [
      [Sequelize.fn('SUM', Sequelize.col('amount')), 'amount'],
    ]
    const [list, total_minting_amount] = await Promise.all([
      getFindAllWithCountUnBond(criteria, start, limits),
      getDataUnbondIncomeHistory(criteria, attributeMinting)
    ]);

    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "UnStake getting successfully";
    finalMessage.data = list;
    finalMessage.totalAmount = total_minting_amount;
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
    const attributeMinting = [
      [Sequelize.fn('SUM', Sequelize.col('tokens')), 'amount'],
    ]
    const [list, totalAms] = await Promise.all([
      getFindAllWithCountUnStake(criteria, start, limits),
      getDataUnStakeHistory(criteria, attributeMinting)
    ]);
    let finalMessage = { ...SUCCESS.found };
    finalMessage.message = "UnBond getting successfully";
    finalMessage.data = list;
    finalMessage.totalAmount = totalAms;
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
