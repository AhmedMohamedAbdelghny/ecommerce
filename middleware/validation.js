import { Types } from "mongoose";
import Joi from "joi";
import { AppError } from "../utils/globalError.js";

const validationObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("invalid object _id");
};

export const generalFiled = {
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
  rePassword: Joi.string().valid(Joi.ref("password")).required(),
  id: Joi.string().custom(validationObjectId),
  file: Joi.object({
    size: Joi.number().positive().required(),
    path: Joi.string().required(),
    filename: Joi.string().required(),
    destination: Joi.string().required(),
    mimetype: Joi.string().required(),
    encoding: Joi.string().required(),
    originalname: Joi.string().required(),
    fieldname: Joi.string().required(),
  }),
};
export const validation = (schema) => {
  return (req, res, next) => {
    let arrErr = [];
    const inputData = { ...req.body, ...req.query, ...req.params };
    if (req.file || req.files) {
      inputData.file = req.file || req.files;
    }
    const { error } = schema.validate(inputData, { abortEarly: false });
    if (error) {
      error.details.map((err) => {
        arrErr.push(err.message);
      });
    }
    if (arrErr?.length) {
      return next(new AppError(arrErr, 400));
    } else {
      next();
    }
  };
};
