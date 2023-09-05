import joi from "joi";
import { generalFiled } from "../../middleware/validation.js";

export const createCart = joi
  .object({
    quantity: joi.number().min(1).required(),
    productId: generalFiled.id.required(),
  })
  .required();

export const removeCart = joi
  .object({
    productId: generalFiled.id,
  })
  .required();
