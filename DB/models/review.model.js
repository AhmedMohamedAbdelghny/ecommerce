import { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema(
  {
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: [true, "rating is required"] },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: [true, "productId is required"],
    },
    orderId: {
      type: Types.ObjectId,
      ref: "Order",
      required: [true, "productId is required"],
    },


  },
  {
    timestamps: true,
  }
);

const reviewModel = model("Review", reviewSchema);
export default reviewModel;
