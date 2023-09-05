import { AppError, asyncHandler } from "../../utils/globalError.js";
import cloudinary from "../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import categoryModel from "../../DB/models/category.model.js";
import productModel from "../../DB/models/product.model.js";
import subCategoryModel from "../../DB/models/subCategory.model.js";
import brandModel from "../../DB/models/brand.model.js";
import ApiFeatures from "./../../utils/apiFeatures.js";

// *******************************createProduct*********************************//
export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, categoryId, subCategoryId, brandId, price, discount, amount } =
    req.body;

  const exist = await productModel.findOne({ name: name.toLowerCase() });
  if (exist) {
    return next(new AppError("product already exist", 401));
  }
  const brand = await brandModel.findById(brandId);
  if (!brand) {
    return next(new AppError("brand not exist", 401));
  }
  const subCategory = await subCategoryModel.findById(subCategoryId);
  if (!subCategory) {
    return next(new AppError("subCategory not exist or category", 401));
  }
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new AppError("category not exist or category", 401));
  }
  req.body.slug = slugify(name, "_");
  req.body.stock = amount;
  req.body.finalPrice = price - price * ((discount || 0) / 100);

  if (!req.files.length) {
    return next(new AppError("images is required", 400));
  }
  const customId = nanoid(4);
  const publicIds = [];
  const images = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `eCommerce2/categories/${category.customId}/subCategories/${subCategory.customId}/Brands/${brand.customId}/products/${customId}`,
      }
    );
    images.push({ secure_url, public_id });
    publicIds.push(public_id);
  }
  req.body.images = images;
  req.body.customId = customId;
  req.body.createdBy = req.user._id
  const product = await productModel.create(req.body);
  if (!product) {
    await cloudinary.uploader.destroy(publicIds);
    return next(new AppError("failed to create subCategory", 400));
  }
  res.status(201).json({ msg: "done", product });
});

// *******************************updateProduct*********************************//
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params
  const { categoryId, subCategoryId, brandId, name, description, amount, price, discount } = req.body
  const product = await productModel.findOne({ _id: productId, createdBy: req.user._id })
  if (!product) {
    return next(new AppError("product not exist", 401))
  }
  const category = await categoryModel.findById(categoryId)
  if (!category) {
    return next(new AppError("category not exist", 401))
  }
  const subCategory = await subCategoryModel.findById(subCategoryId)
  if (!subCategory) {
    return next(new AppError("subCategory not exist", 401))
  }
  const brand = await brandModel.findById(brandId)
  if (!brand) {
    return next(new AppError("brand not exist", 401))
  }

  if (name) {
    if (product.name == name.toLowerCase()) {
      return next(new AppError("name match old product name plz change it", 401))
    }
    if (await productModel.findOne({ name: name.toLowerCase() })) {
      return next(new AppError("product already exist", 401))
    }
    req.body.name = name
    req.body.slug = slugify(name)
  }
  if (description) {
    req.body.description = description
  }

  if (amount) {
    const consStock = amount - product.soldItems
    consStock > 0 ? req.body.stock = consStock : req.body.stock = 0
  }

  if (price && discount) {
    req.body.finalPrice = price - price * (discount / 100);

  } else if (price) {
    req.body.finalPrice = price - price * (product.discount / 100);
  } else if (discount) {
    req.body.finalPrice = product.price - product.price * (discount / 100);

  }

  if (req.files.length) {
    let imgsArr = []
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
        {
          folder: `eCommerce2/categories/${category.customId}/subCategories/${subCategory.customId}/Brands/${brand.customId}/products/${product.customId}`,
        }
      )
      imgsArr.push({ secure_url, public_id })
    }
    req.body.images = imgsArr
    for (const imgs of product.images) {
      await cloudinary.uploader.destroy(imgs.public_id)
    }
  }
  req.body.updatedBy = req.user._id
  const updatedProduct = await productModel.findByIdAndUpdate(productId, req.body, { new: true })
  res.status(200).json({ msg: "done", updatedProduct })

})

// *******************************deleteProduct*********************************//
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params
  const product = await productModel.findByIdAndDelete(productId)
  if (product) {
    for (const imgs of product.images) {
      await cloudinary.uploader.destroy(imgs.public_id)
    }
    return res.status(200).json({ msg: "done" })
  } else {

    return next(new AppError("fail to delete", 401))
  }
})

// *******************************getProducts***********************************//

export const getProducts = asyncHandler(async (req, res, next) => {

  const apiFeatures = new ApiFeatures(productModel.find(), req.query).pagination().sort().search()
  const products = await apiFeatures.mongooseQuery

  res.status(200).json({ msg: "done", products })


})