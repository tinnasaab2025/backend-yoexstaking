import Joi from "joi";
import jwt from "jsonwebtoken";
import { ERROR, SUCCESS } from "../config/AppConstants.js";

import { getOne } from "../service/userService.js";

const bep20Regex = /^0x[a-fA-F0-9]{40}$/;

// export const signupValidation = async (req, res, next) => {
//   try {
//     const schema = Joi.object({
//       wallet_address: Joi.string().required(),
//     });
//     const validation = schema.validate(req.body);
//     let criteria = { addresse: req.body.address.toLowerCase() };
//     let sponsorCriteria = { addresse: req.body.sponsorId.toLowerCase() };
//     let checkAddress = await Users.findOne(
//       sponsorCriteria,
//       { _id: 1 },
//       { lean: true }
//     );
//     if (!checkAddress) {
//       let finalMessage = {};
//       finalMessage = { ...ERROR.error };
//       finalMessage.statusMessage =
//         "Sponsor Id invalid please check and try again later..";
//       return res.status(ERROR.error.statusCode).json(finalMessage);
//     }
//     req.body.sponsorId = checkAddress._id;
//     const emailExist = await getOne(criteria);

//     if (validation.error !== undefined || emailExist) {
//       let finalMessage = {};
//       finalMessage = { ...ERROR.error };
//       finalMessage.statusMessage = emailExist
//         ? "User Address Already Exist please check and try again later.."
//         : validation.error.details[0].message;
//       return res.status(ERROR.error.statusCode).json(finalMessage);
//     }
//     next();
//   } catch (error) {
//     let finalErrorMessage = { ...ERROR.somethingWentWrong };
//     finalErrorMessage.statusMessage = error.message;
//     return res
//       .status(ERROR.somethingWentWrong.statusCode)
//       .json(finalErrorMessage);
//   }
// };

// export const signupValidation2 = async (req, res, next) => {
//   try {
//     const schema = Joi.object({
//       sponsorId: Joi.string().required(),
//       address: Joi.string().required(),
//       name:Joi.string().required(),
//     });
//     const validation = schema.validate(req.body);
//     let criteria = { addresse: req.body.address.toLowerCase() };
//     let sponsorCriteria = { addresse: req.body.sponsorId.toLowerCase() };
//     let checkAddress = await Users.findOne(
//       sponsorCriteria,
//       { _id: 1 },
//       { lean: true }
//     );
//     if (!checkAddress) {
//       let finalMessage = {};
//       finalMessage = { ...ERROR.error };
//       finalMessage.statusMessage =
//         "Sponsor Id invalid please check and try again later..";
//       return res.status(ERROR.error.statusCode).json(finalMessage);
//     }
//     req.body.sponsorId = checkAddress._id;
//     const emailExist = await getOne(criteria);

//     if (validation.error !== undefined || emailExist) {
//       let finalMessage = {};
//       finalMessage = { ...ERROR.error };
//       finalMessage.statusMessage = emailExist
//         ? "User Address Already Exist please check and try again later.."
//         : validation.error.details[0].message;
//       return res.status(ERROR.error.statusCode).json(finalMessage);
//     }
//     next();
//   } catch (error) {
//     let finalErrorMessage = { ...ERROR.somethingWentWrong };
//     finalErrorMessage.statusMessage = error.message;
//     return res
//       .status(ERROR.somethingWentWrong.statusCode)
//       .json(finalErrorMessage);
//   }
// };

export const signupValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      code: Joi.string().trim(),
      wallet_address: Joi.string()
        .pattern(bep20Regex)
        .required()
        .messages({
          'string.pattern.base': 'Invalid BEP-20 address. It should start with 0x and be followed by 40 hex characters.',
          'string.empty': 'Wallet Address is required.'
        }),
    });
    const validation = schema.validate(req.body);
    let sponsorId = req.body.code
    if (sponsorId == '') {
      sponsorId = '0xDD372cDfb5E19d72fFcCFa2902D0c13a66F69431'
    }
    const attribute2 = {
      include: ['id', 'user_id', 'sponser_id', 'eth_address']
    }
    let criteria2 = { eth_address: req.body.wallet_address.toLowerCase() };
    let user = await getOne(
      criteria2,
      attribute2
    );

    if (user) {
      let finalResponse = { ...SUCCESS.login };
      finalResponse.data = {
        token: createToken(user._id, user.user_id, user.sponser_id, user.wallet_address),
      };
      return res.status(SUCCESS.login.statusCode).json(finalResponse);
    }
    let criteria = { eth_address: sponsorId.toLowerCase() };

    const attribute = {
      include: ['id','user_id','eth_address']
    }

    let sponsor = await getOne(
      criteria,
      attribute
    );
    if (!sponsor) {
      let finalMessage = {};
      finalMessage = { ...ERROR.error };
      finalMessage.message =
        "Invalid Invite Code";
      return res.status(ERROR.error.statusCode).json(finalMessage);
    }
    req.body.sponser_id = sponsor.user_id

    if (validation.error !== undefined) {
      let finalMessage = {};
      finalMessage = { ...ERROR.error };
      finalMessage.message = validation.error.details[0].message;
      return res.status(ERROR.error.statusCode).json(finalMessage);
    }
    next();
  } catch (error) {
    return res
      .status(ERROR.somethingWentWrong.statusCode)
      .json(ERROR.somethingWentWrong);
  }
};

export const signinValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      wallet_address: Joi.string()
        .pattern(bep20Regex)
        .required()
        .messages({
          'string.pattern.base': 'Invalid BEP-20 address. It should start with 0x and be followed by 40 hex characters.',
          'string.empty': 'Wallet Address is required.'
        }),
    });
    const validation = schema.validate(req.body);
    if (validation.error !== undefined) {
      let finalMessage = {};
      finalMessage = { ...ERROR.error };
      finalMessage.message = validation.error.details[0].message;
      return res.status(ERROR.error.statusCode).json(finalMessage);
    }
    next();
  } catch (error) {
    return res
      .status(ERROR.somethingWentWrong.statusCode)
      .json(ERROR.somethingWentWrong);
  }
};

export const walletExistValidation = async (req, res, next) => {
  try {
    const schema = Joi.object({
      wallet_address: Joi.string()
        .pattern(bep20Regex)
        .required()
        .messages({
          'string.pattern.base': 'Invalid BEP-20 address. It should start with 0x and be followed by 40 hex characters.',
          'string.empty': 'Wallet Address is required.'
        }),
    });
    const validation = schema.validate(req.body);
  
    if (validation.error !== undefined) {
      let finalMessage = {};
      finalMessage = { ...ERROR.error };
      finalMessage.message = validation.error.details[0].message;
      return res.status(ERROR.error.statusCode).json(finalMessage);
    }
    next();
  } catch (error) {
    return res
      .status(ERROR.somethingWentWrong.statusCode)
      .json(ERROR.somethingWentWrong);
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