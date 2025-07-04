"use strict";

export const INCOME_LIMIT = 3;
export const SUCCESS = {
  created: {
    statusCode: 200,
    statusMessage: "Success",
    type: "created",
  },
  updated: {
    statusCode: 200,
    statusMessage: "Updated",
    type: "updated",
  },
  channelDeleted: {
    statusCode: 200,
    statusMessage: "channel deleted",
    type: "channelDeleted",
  },
  found: {
    statusCode: 200,
    statusMessage: "Data Found",
    type: "found",
  },
  login: {
    statusCode: 200,
    statusMessage: "login success",
    type: "login",
  },
  settingUpdated: {
    statusCode: 200,
    statusMessage: "Setting has been updated",
    type: "settingUpdated",
  },
  emailAlreadyExist: {
    statusCode: 200,
    statusMessage: "Email already exist please check and try again later..",
    type: "emailAlreadyExist",
  },
  sendInviteMail: {
    statusCode: 200,
    statusMessage: "Invitation sent successfully",
    type: "sendInviteMail",
  },
  sendMail: {
    statusCode: 200,
    statusMessage:
      "We have sent you an email with a link to reset your password. Please check your inbox and follow the instructions to recover your account.",
    type: "sendMail",
  },
};
export const ERROR = {
  error: {
    statusCode: 400,
    statusMessage: "Error",
    type: "error",
  },
  dataNotFound: {
    statusCode: 400,
    statusMessage: "Data not found",
    type: "dataNotFound",
  },
  InsufficientFund: {
    statusCode: 400,
    statusMessage: "Insufficient Balance",
    type: "InsufficientFund",
  },
  requestAlreadyApproved: {
    statusCode: 400,
    statusMessage:
      "Request already approved please check and try again later..",
    type: "requestAlreadyApproved",
  },
  requestAlreadyRejected: {
    statusCode: 400,
    statusMessage:
      "Request already rejected please check and try again later..",
    type: "requestAlreadyRejected",
  },
  usernameExist: {
    statusCode: 400,
    statusMessage: "Username already exist please check and try again later..",
    type: "usernameExist",
  },
  alreadyRegistered: {
    statusCode: 400,
    statusMessage: "User already registered!",
    type: "alreadyRegistered",
  },
  oldPasswordNotMatched: {
    statusCode: 400,
    statusMessage:
      "Old password not matched please check and try again later..",
    type: "oldPasswordNotMatched",
  },
  somethingWentWrong: {
    statusCode: 500,
    statusMessage: "Something went wrong",
    type: "somethingWentWrong",
  },
  fileNotFound: {
    statusCode: 400,
    statusMessage: "File not found!",
    type: "fileNotFound",
  },
  invalid_login: {
    statusCode: 400,
    statusMessage: "Invalid credentials",
    type: "invalid_login",
  },
  account_not_found: {
    statusCode: 400,
    statusMessage: "Account Not Found",
    type: "account_not_found",
  },
  token_required: {
    statusCode: 403,
    statusMessage: "A token is required for authentication",
    type: "token_required",
  },
  accessRequired: {
    statusCode: 403,
    statusMessage: "You have no access to this page",
    type: "accessRequired",
  },
  invalid_token: {
    statusCode: 401,
    statusMessage: "Invalid token",
    type: "invalid_token",
  },
  link_expired: {
    statusCode: 400,
    statusMessage: "Link expred!",
    type: "link_expired",
  },
  verified: {
    statusCode: 400,
    statusMessage: "Hash already verified!",
    type: "verified",
  },
};
