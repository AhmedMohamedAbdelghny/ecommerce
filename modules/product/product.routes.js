import { Router } from "express";
import * as PC from "./product.controller.js";
import { multerValidation, myMulter } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as PV from "./productValidate.js";
import { auth, role } from "../../middleware/auth.js";
import reviewRoutes from "../review/review.routes.js"
const router = Router();

router.use("/:productId/reviews", reviewRoutes)

router.post(
  "/",
  auth([Object.values(role)]),
  myMulter(multerValidation.image).array("images", 3),
  validation(PV.createProduct),
  PC.createProduct
);
router.put(
  "/:productId",
  myMulter(multerValidation.image).array("images", 3),
  validation(PV.createProduct),
  PC.updateProduct
);
router.delete("/:productId", PC.deleteProduct);
router.get("/", PC.getProducts);


export default router;
