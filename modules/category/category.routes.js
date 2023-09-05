import { Router } from "express";
import * as CC from "./category.controller.js";
import { validation } from "../../middleware/validation.js";
import * as categoryValidation from "./categoryValidate.js";
import { multerValidation, myMulter } from "../../utils/multer.js";
import supCategoryRoutes from "../subCategory/subCategory.routes.js";
import { auth, role } from "../../middleware/auth.js";
const router = Router();

router.use("/:categoryId/subCategories", supCategoryRoutes);

router.get("/", CC.getCategories);
router.delete("/:categoryId", auth(role.user), CC.deleteCategories);
router.post(
  "/",
  auth(role.user),
  myMulter(multerValidation.image).single("image"),
  validation(categoryValidation.createCategory),
  CC.createCategory
);
router.put(
  "/:categoryId",
  auth(role.user),
  myMulter(multerValidation.image).single("image"),
  validation(categoryValidation.updateCategory),
  CC.updateCategory
);

export default router;
