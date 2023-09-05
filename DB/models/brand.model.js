import { Schema, model, Types } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      lowercase: true,
    },
    slug: {
      type: String,
      required: true,
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
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "categoryId is required"],
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: "subCategory",
      required: [true, "subCategoryId is required"],
    },
    image: {
      type: Object,
      required: [true, "image is required"],
    },
    customId: String,
  },
  {
    timestamps: true,
  }
);

const brandModel = model("Brand", brandSchema);
export default brandModel;
