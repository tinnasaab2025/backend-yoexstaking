import express from 'express';
import upload from '../../middleware/upload.js';
import { getDataUri } from '../../utils/dataUri.js';
import { handleErrorMessage, uploadFilesWithCloudinary } from '../../utils/UniversalFunctions.js';
import {  uploadValidator } from '../../middleware/uploadValidator.js';
import { getOne, InsertData, updateData } from "../../service/userProfileService.js";
import { getOne as getOneUser } from "../../service/userService.js";
import { ERROR, SUCCESS } from '../../config/AppConstants.js';


const router = express.Router();

// 👇 Accept 4 image fields: image1, image2, image3, image4
const fields = [
    { name: 'pan_image', maxCount: 1 },
    { name: 'passport_front', maxCount: 1 },
    { name: 'passport_back', maxCount: 1 },
    { name: 'passport_photo', maxCount: 1 },
];

const checkIfUploadAllowed = async (req, res, next) => {
  try {
    const { user_id } = req.user;
     const userProfile = await getOne({ user_id: user_id }, ['status']);
        console.log("userProfile", userProfile);
        if (userProfile && parseInt(userProfile.status) === 0) {
            let finalMessage = { ...ERROR.error };
            finalMessage.message = "Your documents is already under review.";
            return res.status(ERROR.error.statusCode).json(finalMessage);
        }
        if (userProfile && parseInt(userProfile.status) === 1) {
            let finalMessage = { ...ERROR.error };
            finalMessage.message = "Your documents is already approved.";
            return res.status(ERROR.error.statusCode).json(finalMessage);
        }

    next(); 
  } catch (err) {
     handleErrorMessage(res, err);
  }
};

router.post('/api/v1/upload', checkIfUploadAllowed,upload.fields(fields),uploadValidator, async (req, res) => {
    try {
        const { country, region, first_name, last_name, email, number, pan_number, passport_number, date_of_issue, date_of_expiry } = req.body;
        const { user_id } = req.user;
        const imageUrls = {};
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

        // Loop through image fields
        for (let field of fields) {
            const fileArray = req.files[field.name];
            if (fileArray && fileArray.length > 0) {
                const file64 = getDataUri(fileArray[0]);
                const result = await uploadFilesWithCloudinary(file64.content);
                imageUrls[field.name] = result;
            } else {
                imageUrls[field.name] = null; // Handle missing image
            }
        }
        const userProfile = await getOne({ user_id: user_id }, ['status']);
        let ress = null;
        if (userProfile && userProfile.status === 2) {
            // 🔍 Filter non-empty fields from req.body
            const updatedFields = {};
            const allowedFields = [
                'country', 'region', 'first_name', 'last_name',
                'email', 'number', 'pan_number', 'passport_number',
                'date_of_issue', 'date_of_expiry'
            ];

            allowedFields.forEach((key) => {
                if (req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== '') {
                    updatedFields[key] = req.body[key];
                }
            });

            // 🔍 Add only uploaded images
            Object.keys(imageUrls).forEach((key) => {
                if (imageUrls[key]) {
                    updatedFields[key] = imageUrls[key];
                }
            });

            updatedFields.status = 1;

            ress = await updateData(criteria, updatedFields);
        } else {
            ress = await InsertData({
                user_id: user_id,
                country: country,
                region: region,
                first_name: first_name,
                last_name: last_name,
                email: email,
                number: number,
                pan_number: pan_number,
                passport_number: passport_number,
                date_of_issue: date_of_issue,
                date_of_expiry: date_of_expiry,
                pan_image: imageUrls.pan_image,
                passport_front: imageUrls.passport_front,
                passport_back: imageUrls.passport_back,
                passport_photo: imageUrls.passport_photo
            });
        }


        if (!ress) {
            let finalMessage = { ...ERROR.error };
            finalMessage.message = "Failed to upload profile data.";
            return res.status(ERROR.error.statusCode).json(finalMessage);
        }
        let finalMessage = { ...SUCCESS.created };
        finalMessage.message = "Upload successful";
        return res.status(SUCCESS.created.statusCode).json(finalMessage);

    } catch (err) {
        handleErrorMessage(res, err);
    }
});

export default router;
