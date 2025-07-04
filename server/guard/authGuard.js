import jwt from "jsonwebtoken";
import { ERROR } from "../config/AppConstants.js";

export const verifyToken = (req, res, next) => {
  let headers = req.headers.authorization;
  const token = headers ? headers.split(/\s+/).pop() : "";
  if (!token) {
    return res
      .status(ERROR.token_required.statusCode)
      .json(ERROR.token_required);
  }
  try {
    const decoded = jwt.verify(token, "thisisSecret");
    req.user = decoded;
  } catch (err) {
    return res.status(ERROR.invalid_token.statusCode).json(ERROR.invalid_token);
  }
  return next();
};

export const verifyAdminToken = async (req, res, next) => {
  let headers = req.headers.authorization;
  const token = headers ? headers.split(/\s+/).pop() : "";
  if (!token) {
    return res
      .status(ERROR.token_required.statusCode)
      .json(ERROR.token_required);
  }
  try {
    const decoded = jwt.verify(token, "thisisSecret");
    req.user = decoded;
  } catch (err) {
    return res.status(ERROR.invalid_token.statusCode).json(ERROR.invalid_token);
  }
  return next();
};

export const verifyWebhookToken = async (req, res, next) => {
  let headers = req.headers;
  const token = headers["x-api-key"];
  if (!token) {
    return res
      .status(ERROR.token_required.statusCode)
      .json(ERROR.token_required);
  }
  try {
    const decoded = token === process.env.CONNECT_ATLANTIS_API_ACCESS_TOKEN;
    if (decoded) {
      req.user = decoded;
    } else {
      return res
        .status(ERROR.invalid_token.statusCode)
        .json(ERROR.invalid_token);
    }
  } catch (err) {
    return res.status(ERROR.invalid_token.statusCode).json(ERROR.invalid_token);
  }
  return next();
};