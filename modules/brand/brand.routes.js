import { Router } from "express";
import * as SCC from "./brand.controller.js";
import { validation } from "../../middleware/validation.js";
import * as brandValidation from "./brandValidate.js";
import { multerValidation, myMulter } from "../../utils/multer.js";
import { auth, role } from "../../middleware/auth.js";
const router = Router();

router.get("/", SCC.getBrands);

router.post(
  "/",
  auth(role.user),
  myMulter(multerValidation.image).single("image"),
  validation(brandValidation.createBrand),
  SCC.createBrand
);
router.put(
  "/:brandId",
  auth(role.user),
  myMulter(multerValidation.image).single("image"),
  validation(brandValidation.updateBrand),
  SCC.updateBrand
);

export default router;
