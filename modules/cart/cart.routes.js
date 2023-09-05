import { Router } from "express";
import * as CAC from "./cart.controller.js";
import { validation } from "../../middleware/validation.js";
import * as cartValidation from "./cart.Validation.js";
import { auth, role } from "../../middleware/auth.js";
const router = Router();

router.post(
  "/",
  auth([role.user]),
  validation(cartValidation.createCart),
  CAC.createCart
);
router.delete(
  "/",
  auth([role.user]),
  validation(cartValidation.removeCart),
  CAC.removeCart
);
router.put("/", auth([role.user]), CAC.clearCart);

export default router;
