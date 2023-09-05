import joi from "joi";
import { generalFiled } from "../../middleware/validation.js";

export const createorder = joi.object({
  couponCode: joi.string().optional(),
  addresse: joi.string().required(),
  note: joi.string().optional(),
  phone: joi.array().items(joi.string().required()).required(),
  products: joi.array().items(joi.object({
    productId: generalFiled.id.required(),
    quantity: joi.number().positive().required()
  })).optional(),
  paymentMethod: joi.string().valid("cash", "visa").required()
}).required();

export const cancelorder = joi.object({
  orderId: generalFiled.id.required(),
  reason: joi.string().optional()
}).required();
