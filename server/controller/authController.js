"use strict";
import { ERROR, SUCCESS } from "../config/AppConstants.js";
import jwt from "jsonwebtoken";
import { getOne, InsertData } from "../service/userService.js";
import { generateUniqueUserId, getRandomNumber } from "../utils/UniversalFunctions.js";



export const signin = async (req, res) => {
  try {
    const { wallet_address } = req.body;
    let criteria = {
      eth_address: wallet_address.toLowerCase(),
    };

    console.warn(criteria)
    const attribute = {
      include: ['id', 'user_id', 'sponser_id', 'wallet_address']
    }
    const user = await getOne(criteria, attribute);

    if (user) {
      let finalResponse = { ...SUCCESS.login };
      finalResponse.data = {
        token: createToken(user.id, user.user_id, user.sponser_id, user.wallet_address),
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
    const { code, eth_address,sponser_id } = req.body;
    let obj = {};
    obj.user_id = await generateUniqueUserId()
    obj.sponser_id = sponser_id;
    obj.sponser_eth_address = code;
    obj.password = getRandomNumber();
    obj.master_key = getRandomNumber();
    obj.eth_address = eth_address
    
    const result = await InsertData(obj);
    if (result) {
      
      let finalMessage = { ...SUCCESS.created };
      finalMessage.data = {
       token: createToken(obj.id, obj.user_id, obj.sponser_id, obj.eth_address),
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

function createToken(id, email) {
  let token = jwt.sign(
    {
      _id: id,
      email: email,
    },
    "thisisSecret"
  );
  return token;
}