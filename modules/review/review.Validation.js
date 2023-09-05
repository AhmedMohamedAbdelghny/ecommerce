import joi from "joi";
import { generalFiled } from "../../middleware/validation.js";

export const createreview = joi
  .object({
    productId: generalFiled.id.required(),
    comment: joi.string().required(),
    rating: joi.number().integer().positive().min(1).max(5).required()
  })
  .required();

export const updateReview = joi
  .object({
    reviewId: generalFiled.id.required(),
  })
  .required();
