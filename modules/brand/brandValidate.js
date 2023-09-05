import joi from "joi";
import { generalFiled } from "../../middleware/validation.js";

export const createBrand = joi
  .object({
    name: joi.string().min(2).max(30).required(),
    file: generalFiled.file.required(),
    categoryId: generalFiled.id.required(),
    subCategoryId: generalFiled.id.required(),
  })
  .required();

export const updateBrand = joi
  .object({
    name: joi.string().min(2).max(30).optional(),
    file: generalFiled.file.optional(),
    brandId: generalFiled.id.required(),
    subCategoryId: generalFiled.id.required(),
    categoryId: generalFiled.id.required(),
  })
  .required();
