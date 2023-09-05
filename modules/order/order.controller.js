// import { nanoid } from "nanoid";
import cartModel from "../../DB/models/cart.model.js";
import couponModel from "../../DB/models/coupon.model.js";
import productModel from "../../DB/models/product.model.js";
import { AppError, asyncHandler } from "../../utils/globalError.js";
// import createInvoice from "../../utils/pdf.js";
import orderModel from "./../../DB/models/order.model.js";
import Stripe from "stripe";
import payment from "../../utils/payment.js";

// *******************************createorder*********************************//
export const createorder = asyncHandler(async (req, res, next) => {
  const { couponCode, phone, addresse, note, paymentMethod } = req.body;

  if (!req.body.products) {
    const cart = await cartModel.findOne({ userId: req.user._id })
    if (!cart?.products?.length) {
      return next(new AppError(`cart is empty `, 401));
    }
    req.body.products = cart.products
    req.body.cart = true
  }

  let productList = [];
  let subPrice = 0;
  let productIds = []
  for (let product of req.body.products) {
    const checkPrroduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
      isDeleted: false
    })
    if (!checkPrroduct) {
      return next(new AppError(`product not exist or quantity avaliable is${checkPrroduct.stock} `, 401));
    }
    if (req.body.cart) {
      product = product.toObject()
    }
    product.name = checkPrroduct.name
    product.unitPrice = checkPrroduct.finalPrice
    product.allPrice = product.unitPrice * product.quantity
    productList.push(product)
    productIds.push(product.productId)
    subPrice += product.allPrice
  }

  if (couponCode) {
    const coupon = await couponModel.findOne({ code: couponCode.toLowerCase(), usedBy: { $nin: req.user._id } })
    if (!coupon) {
      return next(new AppError(`coupon not exist or code already used before `, 401));
    }
    if (coupon.toDate < Date.now()) {
      return next(new AppError(`coupon expired `, 401));
    }
    req.body.coupon = coupon
  }

  const order = await orderModel.create({
    products: productList,
    phone, addresse, note,
    paymentMethod,
    status: paymentMethod == "cash" ? "placed" : "waitPayment",
    couponId: req.body?.coupon?._id,
    subPrice,
    totalPrice: subPrice - (subPrice * (req.body?.coupon?.amount / 100 || 0)),
    createdBy: req.user._id
  })

  for (const product of req.body.products) {
    await productModel.updateOne({ _id: product.productId }, {
      $inc: { stock: -product.quantity, soldItems: product.quantity }
    })
  }
  if (req.body?.coupon) {
    await couponModel.updateOne({ code: couponCode }, { $addToSet: { usedBy: req.user._id } })
  }
  if (req.body.cart) {
    await cartModel.updateOne({ userId: req.user._id }, { products: [] })
  } else {
    await cartModel.updateOne({ userId: req.user._id }, {
      $pull: { products: { productId: { $in: productIds } } }
    })

  }
  // invoice
  // const invoice = {
  //   shipping: {
  //     name: req.user.name,
  //     address: "1234 Main Street",
  //     city: "cairo",
  //     country: "cairo",
  //   },
  //   date: order.createdAt,
  //   items: req.body.products,
  //   subtotal: subPrice,
  //   totalPrice: order.totalPrice,
  //   invoice_nr: order._id,
  //   couponCode: req.body.coupon ? req.body.coupon.code : "not exist"
  // };
  // const path = req.user.name + nanoid(3)
  // await createInvoice(invoice, `${path}.pdf`);

  //payment
  if (req.body.paymentMethod == 'visa') {
    const stripe = new Stripe(process.env.stripeKey)
    if (req.body.coupon) {
      const coupon = await stripe.coupons.create({ percent_off: req.body.coupon.amount, duration: "once" })
      req.body.couponId = coupon.id
    }
    const session = await payment({
      stripe,
      customer_email: req.user.email,
      cancel_url: `http://localhost:3000/orders?orderId=${order._id.toString()}`,
      metadata: { orderId: order._id.toString() },
      line_items: order.products.map((product) => {
        return {
          price_data: {
            currency: "EGP",
            product_data: {
              name: product.name
            },
            unit_amount: product.unitPrice * 100
          },
          quantity: product.quantity
        }
      }),
      discounts: req.body.couponId ? [{ coupon: req.body.couponId }] : []
    })
    return res.status(201).json({ msg: "success", order, url: session.url });

  }
  return res.status(201).json({ msg: "success", order });
});

// *******************************cancelorder*********************************
export const cancelorder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { reason } = req.body;
  const order = await orderModel.findById({ _id: orderId });
  if (!order) {
    return next(new AppError("order not exist ", 401));
  }
  if ((order?.status != 'placed' && order?.paymentMethod == "cash") ||
    (order?.status != 'waitPayment' && order?.paymentMethod == "visa")) {
    return next(new AppError("can not cancel order ", 401));
  }
  await orderModel.updateOne({ _id: orderId }, { status: "cancel", reason, updatedBy: req.user._id })
  if (order.couponId) {
    await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: req.user._id } })
  }
  for (const product of order.products) {
    await productModel.updateOne({ _id: product.productId }, { $inc: { stock: product.quantity, soldItems: -product.quantity } })
  }
  // await orderModel.deleteOne({ _id: orderId })
  res.status(201).json({ msg: "done cancel" })
});

