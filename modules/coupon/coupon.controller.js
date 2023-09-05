import couponModel from "../../DB/models/coupon.model.js";
import { AppError, asyncHandler } from "../../utils/globalError.js";
import moment from "moment"

// *******************************createCoupon*********************************//
export const createCoupon = asyncHandler(async (req, res, next) => {

    const { code, fromDate, toDate, amount } = req.body
    const exist = await couponModel.findOne({ code: code.toLowerCase() })
    if (exist) {
        return next(new AppError("coupon already exist", 401))
    }

    // const now = moment().format("YYYY MM DD HH:mm")
    // const fromDateMoment = moment(new Date(fromDate)).format("YYYY MM DD HH:mm")
    // const toDateMoment = moment(new Date(toDate)).format("YYYY MM DD HH:mm")

    // if (moment(fromDateMoment).isSameOrAfter(toDateMoment)
    //     || moment(fromDateMoment).isBefore(now)) {
    //     return next(new AppError("invalid fromDate ", 401))
    // }
    // if (moment(toDateMoment).isBefore(now)) {
    //     return next(new AppError("invalid toDate ", 401))
    // }
    // if (amount < 0 || amount > 100) {
    //     return next(new AppError("invalid amount ", 401))
    // }

    const coupon = await couponModel.create({ code, fromDate, toDate, amount, createdBy: req.user._id })
    coupon ? res.status(201).json({ msg: "done", coupon }) : next(new AppError("fail", 400))
})
// *******************************updateCoupon*********************************//
export const updateCoupon = asyncHandler(async (req, res, next) => {
    const { couponId } = req.params
    const { code, amount } = req.body
    const coupon = await couponModel.findOne({ _id: couponId })
    if (!coupon) {
        return next(new AppError("coupon not exist", 401))
    }
    if (code) {
        if (coupon.code == code.toLowerCase()) {
            return next(new AppError("code match old coupon code plz change it", 401))
        }
        if (await couponModel.findOne({ code: code.toLowerCase() })) {
            return next(new AppError("coupon already exist", 401))
        }
        coupon.code = code
    }
    if (req.body.fromDate || req.body.toDate) {
        // const now = moment().format("YYYY MM DD HH:mm")
        // const fromDateMoment = moment(new Date(req.body.fromDate)).format("YYYY MM DD HH:mm")
        // const toDateMoment = moment(new Date(req.body.toDate)).format("YYYY MM DD HH:mm")
        // if (moment(fromDateMoment).isSameOrAfter(toDateMoment)
        //     || moment(fromDateMoment).isBefore(now)) {
        //     return next(new AppError("invalid fromDate ", 401))
        // }
        // if (moment(toDateMoment).isBefore(now)) {
        //     return next(new AppError("invalid toDate ", 401))
        // }
        coupon.fromDate = req.body.fromDate
        coupon.toDate = req.body.toDate
    }

    if (amount) {
        // if (amount < 0 || amount > 100) {
        //     return next(new AppError("invalid amount ", 401))
        // }
        coupon.amount = amount
    }
    coupon.updatedBy = req.user._id
    await coupon.save()
    res.status(201).json({ msg: "done", coupon })
})