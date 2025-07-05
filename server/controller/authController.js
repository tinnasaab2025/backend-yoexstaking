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
      finalResponse.message = 'Success';
      finalResponse.data = {
        token: createToken({id:user.id, user_id:user.user_id, sponser_id: user.sponser_id, wallet_address:user.eth_address}),
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
       token: createToken({id:result.id, user_id:result.user_id, sponser_id: result.sponser_id, wallet_address:result.eth_address}),
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
      include: ['id']
    }
    const user = await getOne(criteria, attribute);

    if (user) {
      let finalResponse = { ...SUCCESS.found };
      finalResponse.message = 'Success';
      finalResponse.auth = true;
       finalResponse.wallet_address = wallet_address.toLowerCase();
      return res.status(SUCCESS.found.statusCode).json(finalResponse);
    } else {
     let finalResponse = { ...ERROR.dataNotFound };
      finalResponse.message = 'Failed';
      finalResponse.auth = false;
      return res.status(ERROR.dataNotFound.statusCode).json(finalResponse);
    }
  } catch (error) {
    return res
      .status(ERROR.somethingWentWrong.statusCode)
      .json(ERROR.somethingWentWrong);
  }
};  

function createToken(object) {
  let token = jwt.sign(
    object,
    "thisisSecret"
  );
  return token;
}