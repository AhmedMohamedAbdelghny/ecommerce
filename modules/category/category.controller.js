import { AppError, asyncHandler } from "../../utils/globalError.js";
import categoryModel from "../../DB/models/category.model.js";
import cloudinary from "./../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import subCategoryModel from "../../DB/models/subCategory.model.js";
import brandModel from "../../DB/models/brand.model.js";

// *******************************createCategory*********************************//

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const exist = await categoryModel.findOne({ name: name.toLowerCase() });
  if (exist) {
    return next(new AppError("category already exist", 400));
  }
  if (!req.file) {
    return next(new AppError("image is required", 400));
  }
  const customId = nanoid(4);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `eCommerce2/categories/${customId}`,
    }
  );
  const category = new categoryModel({
    name,
    slug: slugify(name),
    image: { secure_url, public_id },
    customId,
    createdBy: req.user._id
  });
  const newCategory = await category.save();
  if (!newCategory) {
    await cloudinary.uploader.destroy(public_id);
    return next(new AppError("failed to create category", 400));
  }
  res.status(201).json({ msg: "done", newCategory });
});

// *******************************updateCategory*********************************//

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  const category = await categoryModel.findById({ _id: categoryId, createdBy: req.user._id });
  if (!category) {
    return next(new AppError("category not exist", 404));
  }
  if (name) {
    if (category.name == name.toLowerCase()) {
      return next(new AppError(" name match old name", 400));
    }
    if (await categoryModel.findOne({ name: name.toLowerCase() })) {
      return next(new AppError("category already  exist", 404));
    }
    category.name = name.toLowerCase();
    category.slug = slugify(name);
  }
  if (req.file) {
    await cloudinary.uploader.destroy(category.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `eCommerce2/categories/${category.customId}`,
      }
    );
    category.image = { secure_url, public_id };
  }
  category.updatedBy = req.user._id
  await category.save();
  res.status(201).json({ msg: "done", category });
});

// ************************************getCategories*************************************

export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await categoryModel.find().populate([
    {
      path: "subCategories",
    },
  ]);

  // let list = [];
  // for (const category of categories) {
  //   const subCategory = await subCategoryModel.find({
  //     categoryId: category._id,
  //   });
  //   let arr = category.toObject();
  //   arr.subCategory = subCategory;
  //   list.push(arr);
  // }
  // const cursor = categoryModel.find({}).cursor();

  // for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  //   const subCategory = await subCategoryModel.find({
  //     categoryId: doc._id,
  //   });
  //   let arr = doc.toObject();
  //   arr.subcategory = subCategory;
  //   list.push(arr);
  // }

  res.status(200).json({ msg: "done", categories });
});
// ************************************deleteCategories*************************************

export const deleteCategories = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await categoryModel.findOneAndDelete({ _id: categoryId, createdBy: req.user._id });
  if (!category) {
    return next(new AppError("category not  exist", 404));
  }

  // delete from cloudinary
  await cloudinary.api.delete_resources_by_prefix(
    `eCommerce2/categories/${category.customId}`
  );
  await cloudinary.api.delete_folder(
    `eCommerce2/categories/${category.customId}`
  );

  // delete from db
  const deleteSubCategories = await subCategoryModel.deleteMany({ categoryId });
  const deleteBrands = await brandModel.deleteMany({ categoryId });
  // delete product >>>>>>>>>>>>>>
  if (!deleteSubCategories.deletedCount || !deleteBrands.deletedCount) {
    return next(new AppError("fail to delete", 400));
  }
  res.status(200).json({ msg: "done" });
});
