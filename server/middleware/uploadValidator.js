import Joi from 'joi';
import { ERROR } from '../config/AppConstants.js';
import { getOne } from '../service/userProfileService.js';



export const uploadValidator = async (req, res, next) => {
    try {
        const validation = uploadSchema.validate(req.body);
        if (validation.error) {
            let finalMessage = { ...ERROR.error };
            finalMessage.message = validation.error.details[0].message;
            return res.status(ERROR.error.statusCode).json(finalMessage);
        }

        const imageFields = ['pan_image', 'passport_front', 'passport_back', 'passport_photo'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic', 'image/heif'];

        for (let field of imageFields) {
            const file = req.files?.[field]?.[0];

            // ❌ If image not present, skip (because it's optional)
            if (!file) continue;

            // ✅ Type check
            if (!allowedTypes.includes(file.mimetype)) {
                let finalMessage = { ...ERROR.error };
                finalMessage.message = `${field} must be a JPG, PNG, HEIC, or HEIF image`;
                return res.status(ERROR.error.statusCode).json(finalMessage);
            }

            // ✅ Size check
            if (file.size > maxSize) {
                let finalMessage = { ...ERROR.error };
                finalMessage.message = `${field} must be less than 5MB`;
                return res.status(ERROR.error.statusCode).json(finalMessage);
            }
        }


        next();
    } catch (error) {
        return res
            .status(ERROR.somethingWentWrong.statusCode)
            .json(ERROR.somethingWentWrong);
    }
};
const uploadSchema = Joi.object({
    country: Joi.string().required(),
    region: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    number: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({ 'string.pattern.base': 'Phone number must be 10 digits' }),
    pan_number: Joi.string()
        .pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)
        .required()
        .messages({ 'string.pattern.base': 'Invalid PAN format' }),
    passport_number: Joi.string().trim().required(),
    date_of_issue: Joi.date().required(),
    date_of_expiry: Joi.date().greater(Joi.ref('date_of_issue')).required(),
});
