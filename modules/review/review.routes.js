import { Router } from "express";
import * as RC from "./review.controller.js";
import { validation } from "../../middleware/validation.js";
import * as RV from "./review.Validation.js";
import { auth, role } from "../../middleware/auth.js";
const router = Router({ mergeParams: true });

router.post(
  "/",
  auth([role.user]),
  validation(RV.createreview),
  RC.createreview
);
router.put(
  "/",
  auth([role.user]),
  validation(RV.updateReview),
  RC.updateReview
);

export default router;
