import productModel from "../../DB/models/product.model.js";
import { AppError, asyncHandler } from "../../utils/globalError.js";
import cartModel from "./../../DB/models/cart.model.js";

// *******************************createCart*********************************//
export const createCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError("product not exist", 401));
  }
  if (product.stock < quantity || product.isDeleted) {
    await productModel.updateOne({ _id: productId }, { $addToSet: { wishList: req.user._id } })
    return next(new AppError(`product is deleted or quantity avaliable is ${product.stock}`, 401));
  }
  const cart = await cartModel.findOne({ userId: req.user._id });

  if (!cart) {
    const addCart = await cartModel.create({
      userId: req.user._id,
      products: [{ productId, quantity }],
    });
    return res.status(201).json({ msg: "done", addCart });
  }
  let match = false;
  for (let i = 0; i < cart.products.length; i++) {
    if (cart.products[i].productId.toString() == productId) {
      cart.products[i].quantity = quantity;
      match = true;
      break;
    }
  }
  if (!match) {
    cart.products.push({ productId, quantity });
  }
  cart.updatedBy = req.user._id
  await cart.save();
  return res.status(201).json({ msg: "success", cart });
});

// *******************************removeCart*********************************
export const removeCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const cart = await cartModel.updateOne(
    { userId: req.user._id },
    {
      $pull: { products: { productId: { $in: productId } } },
    }
  );
  cart.modifiedCount
    ? res.status(201).json({ msg: "done" })
    : next(new AppError("fail ", 401));
});

// *******************************clearCart*********************************
export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.updateOne(
    { userId: req.user._id },
    {
      products: [],
    }
  );
  cart.modifiedCount
    ? res.status(201).json({ msg: "done" })
    : next(new AppError("fail ", 401));
});
