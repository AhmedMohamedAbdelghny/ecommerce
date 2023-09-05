import productModel from "../../DB/models/product.model.js";
import { AppError, asyncHandler } from "../../utils/globalError.js";
import reviewModel from "../../DB/models/review.model.js";
import orderModel from "../../DB/models/order.model.js"
// *******************************createreview*********************************//
export const createreview = asyncHandler(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { productId } = req.params;

  const order = await orderModel.findOne({
    createdBy: req.user._id,
    status: "delivered",
    "products.productId": productId
  });
  if (!order) {
    return next(new AppError("cant make review before use it", 401));
  }
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError("product not exist", 401));
  }

  const review = await reviewModel.findOne({ createdBy: req.user._id, productId, orderId: order._id });

  if (review) {
    return next(new AppError("already reviwed it", 401));
  }
  const addreview = await reviewModel.create({
    createdBy: req.user._id,
    productId: productId,
    orderId: order._id,
    comment,
    rating
  });
  return res.status(201).json({ msg: "success", addreview });
});


////////////////////////update review ////////////////////////

export const updateReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params

  const review = await reviewModel.findOne({ _id: reviewId,createdBy: req.user._id })
  if (!review) {
      return next(new AppError("review not found", 404))
  }
  
  if (req.body.rating) {
      review.rating = req.body.rating
  }
  if (req.body.comment) {
      review.comment = req.body.comment
  }
  await review.save()
  return res.status(200).json({ msg: "success", review })
})
