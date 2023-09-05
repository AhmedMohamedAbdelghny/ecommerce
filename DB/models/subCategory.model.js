import { Schema, model, Types } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "title is required"],
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

const subCategoryModel = model("subCategory", subCategorySchema);
export default subCategoryModel;
