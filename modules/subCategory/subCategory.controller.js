import { AppError, asyncHandler } from "../../utils/globalError.js";
import subCategoryModel from "../../DB/models/subCategory.model.js";
import cloudinary from "../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import categoryModel from "../../DB/models/category.model.js";

// *******************************createSubCategory*********************************//

export const createSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { categoryId } = req.params;
  const category = await categoryModel.findById({ _id: categoryId });
  if (!category) {
    return next(new AppError("category not exist", 401));
  }
  console.log(req.params);
  const exist = await subCategoryModel.findOne({ name: name.toLowerCase() });
  if (exist) {
    return next(new AppError("subCategory already exist", 400));
  }
  if (!req.file) {
    return next(new AppError("image is required", 400));
  }
  const customId = nanoid(4);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `eCommerce2/categories/${category.customId}/subCategories/${customId}`,
    }
  );
  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    image: { secure_url, public_id },
    customId,
    categoryId,
    createdBy: req.user._id
  });
  if (!subCategory) {
    await cloudinary.uploader.destroy(public_id);
    return next(new AppError("failed to create subCategory", 400));
  }
  res.status(201).json({ msg: "done", subCategory });
});

// *******************************updateSubCategory*********************************

export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { categoryId, subCategoryId } = req.params;
  const { name } = req.body;
  const subCategory = await subCategoryModel.findOne({
    _id: subCategoryId,
    categoryId,
    createdBy: req.user._id
  });
  const category = await categoryModel.findOne({
    _id: categoryId,
  });
  if (!subCategory) {
    return next(new AppError("subCategory not exist", 404));
  }
  if (name) {
    if (subCategory.name == name.toLowerCase()) {
      return next(new AppError(" name match old name", 400));
    }
    if (await subCategoryModel.findOne({ name: name.toLowerCase() })) {
      return next(new AppError("subCategory already  exist", 404));
    }
    subCategory.name = name.toLowerCase();
    subCategory.slug = slugify(name);
  }
  if (req.file) {
    await cloudinary.uploader.destroy(subCategory.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `eCommerce2/categories/${category.customId}/subCategories/${subCategory.customId}`,
      }
    );
    subCategory.image = { secure_url, public_id };
  }
  subCategory.updatedBy = req.user._id
  await subCategory.save();
  res.status(201).json({ msg: "done", subCategory });
});

// ************************************getSubCategories*************************************

export const getSubCategories = asyncHandler(async (req, res, next) => {
  const subCategories = await subCategoryModel.find();
  subCategories.length > 0
    ? res.status(200).json({ msg: "done", subCategories })
    : next(new AppError("no subCategories found", 404));
});
