import joi from "joi"
import { generalFiled } from "../../middleware/validation.js"

export const signUp = joi.object({
    name: joi.string().min(2).max(25).required(),
    email: generalFiled.email.required(),
    password: generalFiled.password.required(),
    rePassword: generalFiled.rePassword.required(),
    age: joi.number().positive().integer().required(),
    phone: joi.string().min(11).max(11).required(),
})
export const confirmEmail = joi.object({
    token: joi.string().required(),
})

