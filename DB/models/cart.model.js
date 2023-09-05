import { Schema, model, Types } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      unique: [true, "user is unique"],
      required:true
    },
    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "Product",
          required: [true, "productId is required"],
        },
        quantity: {
          type: Number,
          default: 1,
          required: [true, "quantity is required"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const cartModel = model("Cart", cartSchema);
export default cartModel;
