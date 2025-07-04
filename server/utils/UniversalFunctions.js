"use strict";

import { v2 as cloudinary } from "cloudinary";

import multer from "multer";
import { ERROR, SUCCESS } from "../config/AppConstants.js";
import { getOne } from "../service/userService.js";


cloudinary.config({
  cloud_name: "test",
  api_key: "api_key",
  api_secret: "api_secret",
});

const currentDate = new Date();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let fileExtension = file.originalname
      .split(".")
      .filter(Boolean)
      .slice(1)
      .join(".");

    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
  },
});



export const upload = multer({ storage: storage });

export const todayDate = () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  return { startOfDay, endOfDay };
};

export const calculatePercentage = (percent, amount) => {
  return (percent / 100) * amount;
};


export const getWeekday = () => {
  const currentDay = currentDate.getDay();
  return currentDay;
};

export const getCurrentDate = () => {
  const dayOfMonth = currentDate.getDate();
  return dayOfMonth;
};

export const getRandomNumber = () => {
  return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
};





export const uploadFilesWithCloudinary = async (document) => {
  try {
    let ImageDate = await cloudinary.uploader.upload(
      document,
      { resource_type: "image" },
      function (error, result) { }
    );
    return ImageDate.secure_url;
  } catch (err) {
    throw err;
  }
};



export const generateUniqueUserId = async () => {
  let userId;
  let exists;

  // Loop until we generate a unique user ID
  do {
    // Generate a random user ID (YEX + random number between 1,000,000 and 9,999,999)
    userId = 'YEX' + Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;

    // Check if the user ID already exists in the database
    const attribute = {
      include: ['id']
    }
    const criteria = { user_id: userId };
    exists = await getOne(criteria, attribute);

  } while (exists); // Repeat if the ID exists

  // Return the unique user ID
  return userId;
};



export const handleErrorMessage = (res, error) => {
  return res
    .status(ERROR.somethingWentWrong.statusCode)
    .json({ ...ERROR.somethingWentWrong, statusMessage: error.message });
};
export const handleSuccess = (res, object) => {
  if (object.count > 0) {
    let finalMessage = {};
    finalMessage = { ...SUCCESS.found };
    finalMessage.data = object.rows;
    finalMessage.totalCount = object.count;
    return res.status(SUCCESS.found.statusCode).json(finalMessage);
  } else {
    let finalMessage = {};
    finalMessage = { ...ERROR.dataNotFound };
    finalMessage.data = [];
    return res.status(ERROR.error.statusCode).json(finalMessage);
  }
}