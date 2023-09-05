import joi from "joi";
import { generalFiled } from "../../middleware/validation.js";

export const createProduct = joi
  .object({
    name: joi.string().min(2).max(30).required(),
    description: joi.string().min(2).max(30).optional(),
    colors: joi.array().required(),
    size: joi.array().required(),
    price: joi.number().min(1).required(),
    amount: joi.number().integer().positive().min(1).required(),
    discount: joi.number().min(1).max(100).required(),
    file: joi.array().items(generalFiled.file.required()).required(),
    categoryId: generalFiled.id.required(),
    subCategoryId: generalFiled.id.required(),
    brandId: generalFiled.id.required(),
  })
  .required();

export const updateProduct = joi
  .object({
    name: joi.string().min(2).max(30).optional(),
    description: joi.string().min(2).max(30).optional(),
    colors: joi.array().optional(),
    size: joi.array().optional(),
    price: joi.number().min(1).optional(),
    amount: joi.number().integer().positive().min(1).optional(),
    discount: joi.number().min(1).max(100).optional(),
    file: joi.array().items(generalFiled.file.optional()).optional(),
    subCategoryId: generalFiled.id.required(),
    brandId: generalFiled.id.required(),
    categoryId: generalFiled.id.required(),
  })
  .required();
