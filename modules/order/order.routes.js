import { Router } from "express";
import * as OC from "./order.controller.js";
import { validation } from "../../middleware/validation.js";
import * as OV from "./order.Validation.js";
import { auth, role } from "../../middleware/auth.js";
const router = Router();

router.post(
  "/",
  auth(role.user),
  validation(OV.createorder),
  OC.createorder
);
router.patch(
  "/:orderId",
  auth([role.user]),
  validation(OV.cancelorder),
  OC.cancelorder
);


router.post('/webhook', express.raw({type: 'application/json'}), OV.webhook);


export default router;
