import { Schema, model, Types } from "mongoose";

const productSchema = new Schema({
    name: {
      type: String,
      required: [true, "title is required"],
      lowercase: true,
      trim: true,
      minLength: [2, "minLength is 2 letter"],
    },
    description: {
      type: String,
      lowercase: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true
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
    brandId: {
      type: Types.ObjectId,
      ref: "Brand",
      required: [true, "brandId is required"],
    },
    images: { type: [Object], required: true },
    customId: String,
    price: { type: Number, required: true },
    discount: { type: Number },
    finalPrice: {
      type: Number,
      required: [true, "finalPrice is required"],
      default: 1,
    },
    stock: { type: Number,  required: true },
    amount: { type: Number,  required: true },
    soldItems: { type: Number },
    colors: [String],
    size: { type: [String], enum: ["l", "s", "m", "x"] },
    isDeleted: { type: Boolean, default: false },
    wishList: [{
      type: Types.ObjectId,
      ref: "User"
    }]
  },
  {
    timestamps: true,
    toJSON:{ virtuals: true },
    toObject:{ virtuals: true },
  }
);

productSchema.virtual('review', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'productId',
  // justOne: true
});


const productModel = model("Product", productSchema);
export default productModel;
