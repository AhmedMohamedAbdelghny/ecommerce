import joi from "joi"
import { generalFiled } from "../../middleware/validation.js"

export const createCoupon = joi.object({
    code: joi.string().min(2).max(5).required(),
    amount: joi.number().min(1).max(100).positive().required(),
    fromDate: joi.date().greater(Date.now()).required(),
    toDate: joi.date().greater(joi.ref("fromDate")).required(),
})

export const updateCoupon = joi.object({
    couponId: generalFiled.id.required(),
    code: joi.string().min(2).max(5).optional(),
    amount: joi.number().min(1).max(100).positive().optional(),
    fromDate: joi.date().greater(Date.now()).required(),
    toDate: joi.date().greater(joi.ref("fromDate")).required(),
})

export const deleteCoupon = joi.object({
    couponId: generalFiled.id.required(),
})