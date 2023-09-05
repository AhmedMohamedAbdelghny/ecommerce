import { Router } from "express";
import * as SCC from "./subCategory.controller.js";
import { validation } from "../../middleware/validation.js";
import * as subCategoryValidation from "./subCategory.Validation.js";
import { multerValidation, myMulter } from "../../utils/multer.js";
import { auth, role } from "../../middleware/auth.js";
const router = Router({ mergeParams: true });

router.get("/", SCC.getSubCategories);
router.post(
  "/",
  auth([role.user]),
  myMulter(multerValidation.image).single("image"),
  validation(subCategoryValidation.createSubCategory),
  SCC.createSubCategory
);
router.put(
  "/:subCategoryId",
  auth([role.user]),
  myMulter(multerValidation.image).single("image"),
  validation(subCategoryValidation.updateSubCategory),
  SCC.updateSubCategory
);

export default router;
