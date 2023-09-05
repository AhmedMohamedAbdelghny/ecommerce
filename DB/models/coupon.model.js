import { Schema, model, Types } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "name is required"],
      lowercase: true,
      unique: true
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required:true
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    usedBy: [{
      type: Types.ObjectId,
      ref: "User",
    }],
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["valid", "inValid"],
      default: "valid"
    },
    fromDate: {
      type: String,
      required: true
    },
    toDate: {
      type: String,
      required: true
    }

  },
  {
    timestamps: true,
  }
);

const couponModel = model("Coupon", couponSchema);
export default couponModel;
