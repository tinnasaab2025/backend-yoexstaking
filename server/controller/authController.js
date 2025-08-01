"use strict";
import Web3 from "web3";

import { ERROR, SUCCESS } from "../config/AppConstants.js";
import jwt from "jsonwebtoken";
import { getOne, InsertData } from "../service/userService.js";
import { getOne as getOneConfi } from "../service/configrationService.js";
import {
  getOne as getOneBond,
  InsertData as InsertDataBond,
  updateData as updateBondData,
} from "../service/bondHistoryService.js";

import {
  getFindAllWithCount as getFindAllWithCountReward,
} from "../service/rewardListService.js";


import {
  getOne as getUnOneBond,
  InsertData as InsertUnDataBond,
  updateData as updateUnDataBond,
} from "../service/unBondHistoryService.js";

import {
  getOne as getOneStake,
  InsertData as InsertDataStake,
} from "../service/stakeGHistoryService.js";

import { getOne as getOneTokenPrice } from "../service/tokenValueService.js";
import {
  generateUniqueUserId,
  getRandomNumber,
  handleErrorMessage,
  handleSuccess,
} from "../utils/UniversalFunctions.js";
import { getTransactionDetails } from "../utils/web3.js";
import { token } from "morgan";
const web3 = new Web3("https://bsc-dataseed.binance.org/");

export const signin = async (req, res) => {
  try {
    const { wallet_address } = req.body;
    let criteria = {
      eth_address: wallet_address.toLowerCase(),
    };

    console.warn(criteria);
    const attribute = {
      include: ["id", "user_id", "sponser_id", "eth_address"],
    };
    const user = await getOne(criteria, attribute);

    if (user) {
      let finalResponse = { ...SUCCESS.login };
      finalResponse.message = "Success";
      finalResponse.data = {
        token: createToken({
          id: user.id,
          user_id: user.user_id,
          sponser_id: user.sponser_id,
          wallet_address: user.eth_address,
        }),
      };
      return res.status(SUCCESS.login.statusCode).json(finalResponse);
    } else {
      return res
        .status(ERROR.invalid_login.statusCode)
        .json(ERROR.invalid_login);
    }
  } catch (error) {
    return res
      .status(ERROR.somethingWentWrong.statusCode)
      .json(ERROR.somethingWentWrong);
  }
};
export const checkTra = async (req, res) => {
  try {
    const { hash } = req.query;
    const response = await getTransactionDetails(hash);
    const getBond = await getOneBond({ hash: hash }, ["id"]);
    if (getBond) {
      return res.status(200).json({
        statusCode: 200,
        status: true,
        message: "Transaction already exists",
        data: { hash: getBond.hash },
      });
    }

    let decodedData = null;

    response.receipt.logs.forEach((element) => {
      const isTargetEvent =
        element.topics[0] ===
        "0xf4eaee0731d9e8f20865ecc428d60d6cbae4cd25da599141fd3705eee81b52ad";

      if (isTargetEvent) {
        const topics = element.topics;
        const data = element.data;

        const decoded = web3.eth.abi.decodeLog(
          [
            { type: "uint256", name: "yoexAmount" },
            { type: "uint256", name: "bonusAmount" },
            { type: "uint256", name: "lockDays" },
            { type: "uint256", name: "unlockTime" },
          ],
          data,
          topics.slice(1)
        );

        const yoexRaw = decoded.yoexAmount.toString();
        const bonusRaw = decoded.bonusAmount.toString();
        const lockDays = decoded.lockDays.toString();
        const unlockTimeRaw = decoded.unlockTime.toString();

        const user = web3.eth.abi.decodeParameter("address", topics[1]);
        const index = web3.eth.abi
          .decodeParameter("uint256", topics[2])
          .toString();
        const usdtRaw = web3.eth.abi
          .decodeParameter("uint256", topics[3])
          .toString();

        decodedData = {
          yoexAmount: (Number(yoexRaw) / 1e12).toString(),
          bonusAmount: (Number(bonusRaw) / 1e12).toString(),
          lockDays: lockDays,
          unlockTime: new Date(Number(unlockTimeRaw) * 1000).toISOString(),
          user,
          index,
          usdtAmount: (Number(usdtRaw) / 1e18).toString(),
        };
      }
    });

    if (!decodedData) {
      return res.status(404).json({
        statusCode: 404,
        status: false,
        message: "BondCreated event not found in logs",
      });
    }

    const finalMessage = {
      statusCode: 200,
      status: true,
      message: "Success",
      data: { decodedData },
    };

    const [getUser, tokenPrice] = await Promise.all([
      getOne({ eth_address: decodedData.user.toLowerCase() }, ["user_id"]),
      getOneTokenPrice({ id: 1 }, ["amount"]),
    ]);
    const object = {
      user_id: getUser.user_id,
      wallet_address: decodedData.user,
      amount: parseFloat(decodedData.usdtAmount), // original USDT value
      total_bond:
        parseFloat(decodedData.usdtAmount) / parseFloat(tokenPrice.amount), // YOEX received
      bond_tokens: parseFloat(decodedData.yoexAmount), // same as total_bond unless split
      bond_principles: parseFloat(decodedData.bonusAmount), // bonus amount
      total_release_bond:
        parseFloat(decodedData.yoexAmount) +
        parseFloat(decodedData.bonusAmount), // default
      token_price: parseFloat(tokenPrice.amount), // you can set if available
      lock_days: parseInt(decodedData.lockDays),
      days: 0, // default unless tracked
      unbond_id: decodedData.index ? parseInt(decodedData.index) : 0,
      unbond_time: new Date(decodedData.unlockTime)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      hash: hash,
      status: 0, // or 0 as needed
    };

    await InsertDataBond(object);
    return res.status(200).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const rewardList = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    let criteria = {
      status: 1, // or any other criteria you need
    };
    const list = await getFindAllWithCountReward(criteria, parseInt(skip), parseInt(limit));
    handleSuccess(res, list);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const checkTransaction = async (req, res) => {
  try {
    const { hash } = req.query;
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
        message: "BondCreated event not found in logs",
      });
    }

    const finalMessage = {
      statusCode: 200,
      status: true,
      message: "Success",
      data: { decodedData },
    };

    const [getUser, tokenPrice] = await Promise.all([
      getOne({ eth_address: decodedData.user.toLowerCase() }, ["user_id"]),
      getOneTokenPrice({ id: 1 }, ["amount"]),
    ]);
    const object = {
      user_id: getUser.user_id,
      wallet_address: decodedData.user,
      tokens:
        parseFloat(decodedData.usdtAmount) / parseFloat(tokenPrice.amount), // original USDT value
      usdt_amount: parseFloat(decodedData.usdtAmount), // YOEX received
      hash: hash,
      token_price: parseFloat(tokenPrice.amount), // you can set if available
      timestamp_unix: 0,
    };

    await InsertDataStake(object);

    return res.status(200).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const unbond = async (req, res) => {
  try {
    const { hash } = req.body;
    const { user_id } = req.user;

    const getUnBond = await getUnOneBond({ hash: hash }, ["id"]);
    if (getUnBond) {
      return res.status(200).json({
        statusCode: 200,
        status: true,
        message: "Unbond Created successfully.",
        data: { hash: getUnBond.hash },
      });
    }
    const response = await getTransactionDetails(hash);
    let decodedData = null;

    response.receipt.logs.forEach((element) => {
      const isTargetEvent =
        element.topics[0] ===
        "0x050b644fc4db8f14bc2e5e5a687b38be8a866ec8752789067259b75bd74bc236";

      if (isTargetEvent) {
        const topics = element.topics;
        const data = element.data;

        const decoded = web3.eth.abi.decodeLog(
          [
            { type: "uint256", name: "principal" },
            { type: "uint256", name: "bonus" },
          ],
          data,
          topics.slice(1) // [user, index, totalWithdrawn]
        );

        const principalRaw = decoded.principal.toString();
        const bonusRaw = decoded.bonus.toString();

        const user = web3.eth.abi.decodeParameter("address", topics[1]);
        const index = web3.eth.abi
          .decodeParameter("uint256", topics[2])
          .toString();
        const totalWithdrawnRaw = web3.eth.abi
          .decodeParameter("uint256", topics[3])
          .toString();

        decodedData = {
          user,
          index,
          totalWithdrawn: (Number(totalWithdrawnRaw) / 1e12).toString(), // YOEX has 12 decimals
          principal: (Number(principalRaw) / 1e12).toString(),
          bonus: (Number(bonusRaw) / 1e12).toString(),
        };
      }
    });

    if (!decodedData) {
      return res.status(404).json({
        statusCode: 404,
        status: false,
        message: "BondUnstaked event not found in logs",
      });
    }

    const [getUser, tokenPrice] = await Promise.all([
      getOne({ user_id: user_id }, ["user_id", "eth_address"]),
      getOneTokenPrice({ id: 1 }, ["amount"]),
    ]);
    // console.warn(getUser, tokenPrice);
    if (getUser.eth_address.toLowerCase() !== decodedData.user.toLowerCase()) {
      return res.status(403).json({
        statusCode: 403,
        status: false,
        message: "Invalid unbond request. User does not match.",
      });
    }

    const withdrawUsdt =
      decodedData.totalWithdrawn * parseFloat(tokenPrice.amount);
    const object = {
      user_id: getUser.user_id,
      wallet_address: decodedData.user.toLowerCase(),
      amount: parseFloat(withdrawUsdt), // original USDT value
      total_unbond_tokens: parseFloat(decodedData.totalWithdrawn), // YOEX received
      bond_tokens: parseFloat(decodedData.principal), // same as total_bond unless split
      bond_reward_tokens: parseFloat(decodedData.bonus), // bonus amount
      index: parseInt(decodedData.index) || 0,
      hash: hash,
      token_price: parseFloat(tokenPrice.amount), // you can set if available
    };

    const inseretDataUnBond = await InsertUnDataBond(object);
    if (!inseretDataUnBond) {
      return res.status(500).json({
        statusCode: 500,
        status: false,
        message: "Failed to insert unbond data",
      });
    }

    if (inseretDataUnBond) {
      await updateBondData(
        { user_id: user_id, unbond_id: parseInt(decodedData.index) || 0 },
        { status: 1 }
      );
    }

    const finalMessage = {
      statusCode: 200,
      status: true,
      message: "Success",
      data: { decodedData },
    };

    return res.status(200).json(finalMessage);
  } catch (error) {
    handleErrorMessage(res, error);
  }
};

export const checkRegister = async (req, res) => {
  try {
    const result = true;
    if (result === true) {
      let finalMessage = { ...SUCCESS.created };
      finalMessage.data = true;
      return res.status(SUCCESS.created.statusCode).json(finalMessage);
    } else {
      return res.status(ERROR.error.statusCode).json(ERROR.error);
    }
  } catch (error) {
    let finalError = { ...ERROR.somethingWentWrong };
    finalError.statusMessage = error.message;
    return res.status(ERROR.somethingWentWrong.statusCode).json(finalError);
  }
};

export const signup = async (req, res) => {
  try {
    const { code, wallet_address, sponser_id } = req.body;
    let obj = {};
    obj.user_id = await generateUniqueUserId();
    obj.sponser_id = sponser_id;
    obj.sponser_eth_address = code;
    obj.password = getRandomNumber();
    obj.master_key = getRandomNumber();
    obj.eth_address = wallet_address;

    const result = await InsertData(obj);
    if (result) {
      let finalMessage = { ...SUCCESS.created };
      finalMessage.data = {
        token: createToken({
          id: result.id,
          user_id: result.user_id,
          sponser_id: result.sponser_id,
          wallet_address: wallet_address,
        }),
      };
      return res.status(SUCCESS.created.statusCode).json(finalMessage);
    } else {
      return res.status(ERROR.error.statusCode).json(ERROR.error);
    }
  } catch (error) {
    let finalError = { ...ERROR.somethingWentWrong };
    finalError.statusMessage = error.message;
    return res.status(ERROR.somethingWentWrong.statusCode).json(finalError);
  }
};
export const walletExist = async (req, res) => {
  try {
    const { wallet_address } = req.body;

    let criteria = {
      eth_address: wallet_address.toLowerCase(),
    };

    const attribute = {
      include: ["id"],
    };
    const user = await getOne(criteria, attribute);

    if (user) {
      let finalResponse = { ...SUCCESS.found };
      finalResponse.message = "Success";
      finalResponse.auth = true;
      finalResponse.wallet_address = wallet_address.toLowerCase();
      return res.status(SUCCESS.found.statusCode).json(finalResponse);
    } else {
      let finalResponse = { ...ERROR.dataNotFound };
      finalResponse.message = "Failed";
      finalResponse.auth = false;
      return res.status(ERROR.dataNotFound.statusCode).json(finalResponse);
    }
  } catch (error) {
    return res
      .status(ERROR.somethingWentWrong.statusCode)
      .json(ERROR.somethingWentWrong);
  }
};


export const getPopupStatus = async (req, res) => {
  try {

    let criteria = {
      setting_key: 'popup_enabled',
    };

    const attribute = {
      include: ["setting_value"],
    };
    const data = await getOneConfi(criteria, attribute);
    let finalResponse = { ...SUCCESS.found };
    finalResponse.message = "Success";
    finalResponse.data = data;
    return res.status(SUCCESS.found.statusCode).json(finalResponse);

  } catch (error) {
    handleErrorMessage(res, error);
  }
}

function createToken(object) {
  let token = jwt.sign(object, "thisisSecret");
  return token;
}
