import joi from "joi";
import { generalFiled } from "../../middleware/validation.js";

export const createCategory = joi
  .object({
    name: joi.string().min(2).max(30).required(),
    file: generalFiled.file.required(),
  })
  .required();

export const updateCategory = joi
  .object({
    name: joi.string().min(2).max(30).optional(),
    file: generalFiled.file.optional(),
    categoryId: joi.optional(),
  })
  .required();
