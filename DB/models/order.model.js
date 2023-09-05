import { Schema, model, Types } from "mongoose";

const orderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User" },
    products: [{
      name: { type: String },
      productId: { type: Types.ObjectId, ref: "Product", required: [true, "productId is required"] },
      quantity: { type: Number, default: 1, required: [true, "quantity is required"] },
      unitPrice: { type: Number },
      allPrice: { type: Number },
    }],
    couponId: { type: Types.ObjectId, ref: "Coupon" },
    subPrice: { type: Number },
    totalPrice: { type: Number },
    phone: [{ type: String, required: [true, "phone is required"] }],
    addresse: { type: String, required: true },
    note: String,
    reason: String,
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User" },
    paymentMethod: { type: String, enum: ["cash", "visa"], required: true },
    status: {
      type: String,
      enum: ["placed", "waitPayment", "onWay", "cancel", "rejected", "delivered"],
    }
  },
  {
    timestamps: true,
  }
);

const orderModel = model("Order", orderSchema);
export default orderModel;
