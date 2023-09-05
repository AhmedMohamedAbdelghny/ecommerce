import userModel from "../../DB/models/user.model.js";
import { AppError, asyncHandler } from "../../utils/globalError.js";
import jwt from "jsonwebtoken"
import { sendEmail } from "../../utils/sendEmail.js";
import bcrypt from "bcrypt"
import { nanoid } from "nanoid";


// ***********************signUp***********************************
export const signUp = asyncHandler(async (req, res, next) => {
    const { name, email, password, rePassword, age, phone } = req.body
    const exist = await userModel.findOne({ email: email.toLowerCase() })
    if (exist) {
        return next(new AppError("user already exist", 400))
    }
    const token = jwt.sign({ email }, process.env.signature, { expiresIn: 60 * 2 })
    const link = `${req.protocol}://${req.headers.host}/users/confirmEmail/${token}`

    const sended = await sendEmail(email, "confirm email", `<a href="${link}">confirmEmail</a> `)

    if (!sended) {
        return next(new AppError("email not exist", 400))
    }
    const hash = bcrypt.hashSync(password, +process.env.saltOrRounds)
    const user = await userModel.create({ name, email, password: hash, rePassword, age, phone })
    user ? res.status(201).json({ msg: "done", user }) : next(new AppError("fail", 500))


})

// ***********************confirmEmail***********************************


export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    if (!token) {
        return next(new AppError("token not exist", 400))
    }
    const decoded = jwt.verify(token, process.env.signature)
    if (!decoded) {
        return next(new AppError(" invalid token", 400))
    }
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: false },
        { confirmed: true },
        { new: true })

    user ?
        res.status(201).json({ msg: "done email confirmed" })
        : next(new AppError("user not exist or altready confiremed", 500))

})



// ***********************refreashToken***********************************
export const refreashToken = asyncHandler(async (req, res, next) => {
    const { token } = req.params

    if (!token) {
        return next(new AppError(" token not exist", 400))
    }
    const decoded = jwt.verify(token, process.env.signature)
    if (!decoded) {
        return next(new AppError("invalid token", 400))
    }

    const user = await userModel.findOne({ email: decoded.email, confirmed: false })
    if (!user) {
        return next(new AppError("user not exist or already confirmed", 400))
    }

    const rfToken = jwt.sign({ email: user.email }, process.env.signature, { expiresIn: 60 * 2 })
    const rfLink = `${req.protocol}://${req.headers.host}/users/confirmEmail/${rfToken}`
    const sended = await sendEmail(user.email, "confirm email", `<a href="${rfLink}">confirmEmail</a> `)

    if (!sended) {
        return next(new AppError("email not exist", 400))
    }
    res.status(201).json({ msg: "plz confirm your email from msg" })


})

// ***********************forgetPassword***********************************
export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const user = await userModel.findOne({ email: email.toLowerCase() })
    if (!user) {
        return next(new AppError(" user not exist", 400))
    }
    let code = nanoid(4)
    let hashedCode = bcrypt.hashSync(code, +process.env.saltOrRounds)
    const token = jwt.sign({ email: user.email, code: hashedCode }, process.env.signature, { expiresIn: 60 * 5 })
    const link = `${req.protocol}://${req.headers.host}/users/resestPassword/${token}`
    const sended = await sendEmail(user.email, "resestPassword", `<a href="${link}">resestPassword</a> `)

    if (!sended) {
        return next(new AppError("email not exist", 400))
    }
    await userModel.findOneAndUpdate({ email }, { code }, { new: true })
    res.status(201).json({ msg: "plz resest your Password", link })


})
// ***********************resestPassword***********************************
export const resestPassword = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    const { newPassword } = req.body
    if (!token) {
        return next(new AppError(" token not exist", 400))
    }
    const decoded = jwt.verify(token, process.env.signature)
    if (!decoded) {
        return next(new AppError("invalid token", 400))
    }

    const user = await userModel.findOne({ email: decoded.email })
    if (!user) {
        return next(new AppError("user not exist", 400))
    }
    const match = bcrypt.compareSync(user.code, decoded.code)
    if (!match) {
        return next(new AppError("code not match", 400))
    }

    const hash = bcrypt.hashSync(newPassword, +process.env.saltOrRounds)

    const updatedUser = await userModel.findOneAndUpdate({ email: decoded.email },
        { code: null, password: hash, changePassAt: Date.now() }
        , { new: true })
    res.status(201).json({ msg: "done", updatedUser })


})

// ***********************signIn***********************************
export const signIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email: email.toLowerCase() })
    if (!user) {
        return next(new AppError("user not exist", 400))
    }
    if (user.confirmed == false) {
        return next(new AppError("email not confirmed yet ", 400))
    }
    const match = bcrypt.compareSync(password, user.password)
    if (!match) {
        return next(new AppError("password not match try again", 400))
    }
    const token = jwt.sign({ email: user.email, id: user._id }, process.env.signature, { expiresIn: '7 day' })

    res.status(201).json({ msg: "done", token })


})