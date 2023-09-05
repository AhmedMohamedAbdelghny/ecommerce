import { AppError, asyncHandler } from "../../utils/globalError.js";
import cloudinary from "../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import categoryModel from "../../DB/models/category.model.js";
import brandModel from "../../DB/models/brand.model.js";
import subCategoryModel from "../../DB/models/subCategory.model.js";

// *******************************createBrand*********************************//
export const createBrand = asyncHandler(async (req, res, next) => {
  const { name, categoryId, subCategoryId } = req.body;
  const category = await categoryModel.findById({ _id: categoryId });
  if (!category) {
    return next(new AppError("category not exist", 401));
  }
  const subCategory = await subCategoryModel.findById({ _id: subCategoryId });
  if (!subCategory) {
    return next(new AppError("subCategory not exist", 401));
  }

  const exist = await brandModel.findOne({ name: name.toLowerCase() });
  if (exist) {
    return next(new AppError("brand already exist", 400));
  }
  if (!req.file) {
    return next(new AppError("image is required", 400));
  }
  const customId = nanoid(4);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `eCommerce2/categories/${category.customId}/subCategories/${subCategory.customId}/Brands/${customId}`,
    }
  );
  const brand = await brandModel.create({
    name,
    slug: slugify(name),
    image: { secure_url, public_id },
    customId,
    categoryId,
    subCategoryId,
    createdBy: req.user._id
  });
  if (!brand) {
    await cloudinary.uploader.destroy(public_id);
    return next(new AppError("failed to create subCategory", 400));
  }
  res.status(201).json({ msg: "done", brand });
});

// *******************************updateBrand*********************************
export const updateBrand = asyncHandler(async (req, res, next) => {
  const { brandId } = req.params;
  const { name, categoryId, subCategoryId } = req.body;
  const category = await categoryModel.findById(categoryId);
  const subCategory = await subCategoryModel.findById(subCategoryId);
  const brand = await brandModel.findOne({
    _id: brandId, createdBy: req.user._id
  });
  if (!brand) {
    return next(new AppError("brand not exist", 404));
  }
  if (name) {
    if (brand.name == name.toLowerCase()) {
      return next(new AppError(" name match old name", 400));
    }
    if (await brandModel.findOne({ name: name.toLowerCase() })) {
      return next(new AppError("brand already  exist", 404));
    }
    brand.name = name.toLowerCase();
    brand.slug = slugify(name);
  }
  if (req.file) {
    await cloudinary.uploader.destroy(brand.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `eCommerce2/categories/${category.customId}/subCategories/${subCategory.customId}/Brands/${brand.customId}`,
      }
    );
    brand.image = { secure_url, public_id };
  }
  brand.updatedBy = req.user._id
  await brand.save();
  res.status(201).json({ msg: "done", brand });
});

// ************************************getBrands*************************************

export const getBrands = asyncHandler(async (req, res, next) => {
  const Brands = await brandModel.find().populate([
    {
      path: "categoryId",
    },
    {
      path: "subCategoryId",
      populate: [
        {
          path: "categoryId",
        },
      ],
    },
  ]);
  Brands.length > 0
    ? res.status(200).json({ msg: "done", Brands })
    : next(new AppError("no Brands found", 404));
});
