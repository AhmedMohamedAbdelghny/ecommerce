import joi from "joi";
import { generalFiled } from "../../middleware/validation.js";

export const createSubCategory = joi
  .object({
    name: joi.string().min(2).max(30).required(),
    file: generalFiled.file.required(),
    categoryId: generalFiled.id.required(),
  }).required();

export const updateSubCategory = joi
  .object({
    name: joi.string().min(2).max(30).optional(),
    file: generalFiled.file.optional(),
    subCategoryId: generalFiled.id.required(),
    categoryId: generalFiled.id.required(),
  }).required();
