import { Schema, model, Types } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "title is required"],
      lowercase: true,
      minLength:[2,"minLength is 2 letter"]
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
    image: {
      type: Object,
      required: [true, "image is required"],
    },
    customId:String
  },
  {
    timestamps: true,
    toJSON:{ virtuals: true },
    toObject:{ virtuals: true },
  }
);

categorySchema.virtual('subCategories', {
  ref: 'subCategory',
  localField: '_id',
  foreignField: 'categoryId',
  // justOne: true
});

const categoryModel = model("Category", categorySchema);
export default categoryModel;
